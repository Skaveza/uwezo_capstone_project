#!/usr/bin/env python3
"""
Stage 1 Training: Train on Synthetic Kenyan Documents
Uses Donut model for document understanding

Used in Notebook:
    !python train_stage1_kenyan.py --data ./data/training --output ./models/stage1 --epochs 15
"""
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import DonutProcessor, VisionEncoderDecoderModel
from transformers import get_scheduler
from PIL import Image
import json
from tqdm import tqdm
import os
import argparse
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt

#Memory Optimization
os.environ['PYTORCH_CUDA_ALLOC_CONF'] = 'expandable_segments:True'
torch.backends.cudnn.benchmark = True

# Check for GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

class KenyanDocumentDataset(Dataset):
    """Custom dataset for Kenyan documents"""
    
    def __init__(self, jsonl_path, processor, max_length=512):
        self.processor = processor
        self.max_length = max_length
        self.samples = []
        
        # Load JSONL file
        with open(jsonl_path, 'r') as f:
            for line in f:
                self.samples.append(json.loads(line))
        
        print(f"Loaded {len(self.samples)} samples from {jsonl_path}")
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        sample = self.samples[idx]
        
        # Load image
        image = Image.open(sample['image']).convert('RGB')

        #Resize image
        image = image.resize((896, 672), Image.Resampling.LANCZOS)
        
        # Get ground truth
        ground_truth = sample['ground_truth']
        
        # Process image and text
        pixel_values = self.processor(image, return_tensors="pt").pixel_values.squeeze()
        
        # Tokenize ground truth
        labels = self.processor.tokenizer(
            ground_truth,
            padding="max_length",
            max_length=self.max_length,
            truncation=True,
            return_tensors="pt"
        ).input_ids.squeeze()
        
        # Replace padding token id with -100 (ignore in loss)
        labels[labels == self.processor.tokenizer.pad_token_id] = -100
        
        return {
            'pixel_values': pixel_values,
            'labels': labels
        }

def create_dataloaders(data_dir, processor, batch_size=4, max_length=512):
    """Create train and validation dataloaders"""
    
    train_dataset = KenyanDocumentDataset(
        f"{data_dir}/train.jsonl",
        processor,
        max_length=max_length
    )
    
    val_dataset = KenyanDocumentDataset(
        f"{data_dir}/val.jsonl",
        processor,
        max_length=max_length
    )
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=2 if torch.cuda.is_available() else 0
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=2 if torch.cuda.is_available() else 0
    )
    
    return train_loader, val_loader

def train_epoch(model, train_loader, optimizer, scheduler, device, epoch):
    """Train for one epoch"""
    
    model.train()
    total_loss = 0
    progress_bar = tqdm(train_loader, desc=f"Epoch {epoch}")
    
    for batch_idx, batch in enumerate(progress_bar):
        # Move to device
        pixel_values = batch['pixel_values'].to(device)
        labels = batch['labels'].to(device)
        
        # Forward pass
        outputs = model(pixel_values=pixel_values, labels=labels)
        loss = outputs.loss
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        scheduler.step()
        
        # Update metrics
        total_loss += loss.item()
        avg_loss = total_loss / (batch_idx + 1)
        
        # Update progress bar
        progress_bar.set_postfix({
            'loss': f'{avg_loss:.4f}',
            'lr': f'{scheduler.get_last_lr()[0]:.2e}'
        })
    
    return total_loss / len(train_loader)

def validate(model, val_loader, device, epoch):
    """Validate the model"""
    
    model.eval()
    total_loss = 0
    
    with torch.no_grad():
        progress_bar = tqdm(val_loader, desc=f"Validation {epoch}")
        
        for batch in progress_bar:
            pixel_values = batch['pixel_values'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(pixel_values=pixel_values, labels=labels)
            loss = outputs.loss
            
            total_loss += loss.item()
            avg_loss = total_loss / (len(progress_bar))
            
            progress_bar.set_postfix({'val_loss': f'{avg_loss:.4f}'})
    
    return total_loss / len(val_loader)

def save_checkpoint(model, processor, optimizer, epoch, train_loss, val_loss, output_dir, is_best=False):
    """Save model checkpoint"""
    
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
        'train_loss': train_loss,
        'val_loss': val_loss
    }
    
    # Save regular checkpoint
    checkpoint_path = f"{output_dir}/checkpoint_epoch_{epoch}.pt"
    torch.save(checkpoint, checkpoint_path)
    
    # Save model and processor separately (for easier loading)
    model.save_pretrained(f"{output_dir}/model_epoch_{epoch}")
    processor.save_pretrained(f"{output_dir}/model_epoch_{epoch}")
    
    # If best model, save separately
    if is_best:
        torch.save(checkpoint, f"{output_dir}/best_model.pt")
        model.save_pretrained(f"{output_dir}/best_model")
        processor.save_pretrained(f"{output_dir}/best_model")
        print(f"  ✓ Saved best model (val_loss: {val_loss:.4f})")

def plot_training_curves(history, output_dir):
    """Plot and save training curves"""
    
    epochs = range(1, len(history['train_loss']) + 1)
    
    plt.figure(figsize=(12, 5))
    
    # Loss curves
    plt.subplot(1, 2, 1)
    plt.plot(epochs, history['train_loss'], 'b-', label='Train Loss', linewidth=2)
    plt.plot(epochs, history['val_loss'], 'r-', label='Val Loss', linewidth=2)
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('Training and Validation Loss')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Learning rate
    plt.subplot(1, 2, 2)
    plt.plot(epochs, history['learning_rate'], 'g-', linewidth=2)
    plt.xlabel('Epoch')
    plt.ylabel('Learning Rate')
    plt.title('Learning Rate Schedule')
    plt.yscale('log')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/training_curves.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"  ✓ Training curves saved to {output_dir}/training_curves.png")

def main():
    parser = argparse.ArgumentParser(
        description='Stage 1: Train on Synthetic Kenyan Documents'
    )

    parser.add_argument('--data', type=str, required=True, help='Training data directory')
    parser.add_argument('--output', type=str, required=True, help='Output directory for models and logs')
    parser.add_argument('--model-name', type=str, default='naver-clova-ix/donut-base', help='Pretrained model name')
    parser.add_argument('--epochs', type=int, default=10, help='Number of epochs')
    parser.add_argument('--batch-size', type=int, default=2, help='Batch size')
    parser.add_argument('--learning-rate', type=float, default=2e-5, help='Learning rate')
    parser.add_argument('--max-length', type=int, default=256, help='Max sequence length')
    parser.add_argument('--warmup-steps', type=int, default=200, help='Warmup steps')

    args = parser.parse_args()

    print("="*80)
    print("STAGE 1 TRAINING: SYNTHETIC KENYAN DOCUMENTS")
    print("="*80)
    print(f"Model: {args.model_name}")
    print(f"Data: {args.data}")
    print(f"Output: {args.output}")
    print(f"Epochs: {args.epochs}")
    print(f"Batch size: {args.batch_size}")
    print(f"Learning rate: {args.learning_rate}")
    print(f"Device: {device}")
    print("="*80)

    # Create output directory
    os.makedirs(args.output, exist_ok=True)

    # Load processor
    print("\nLoading processor...")
    processor = DonutProcessor.from_pretrained(args.model_name)

    # Load model with proper padding and decoder start token
    print("Loading model...")
    model = VisionEncoderDecoderModel.from_pretrained(
        args.model_name,
        pad_token_id=processor.tokenizer.pad_token_id,
        decoder_start_token_id=processor.tokenizer.bos_token_id
    )

    print(f"  pad_token_id: {model.config.pad_token_id}")
    print(f"  decoder_start_token_id: {model.config.decoder_start_token_id}")

    # Enable gradient checkpointing
    model.gradient_checkpointing_enable()
    if hasattr(model.encoder, 'config'):
        model.encoder.config.use_gradient_checkpointing = True

    model.to(device)

    print(f"  Model parameters: {sum(p.numel() for p in model.parameters()):,}")
    print(f"  Trainable parameters: {sum(p.numel() for p in model.parameters() if p.requires_grad):,}")

    # Create dataloaders
    print("\nCreating dataloaders...")
    train_loader, val_loader = create_dataloaders(
        args.data,
        processor,
        batch_size=args.batch_size,
        max_length=args.max_length
    )

    print(f"  Train batches: {len(train_loader)}")
    print(f"  Val batches: {len(val_loader)}")

    # Setup optimizer and scheduler
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate)
    num_training_steps = args.epochs * len(train_loader)
    scheduler = get_scheduler(
        "linear",
        optimizer=optimizer,
        num_warmup_steps=args.warmup_steps,
        num_training_steps=num_training_steps
    )

    # Training loop
    print("\n" + "="*80)
    print("STARTING TRAINING")
    print("="*80)

    history = {'train_loss': [], 'val_loss': [], 'learning_rate': []}
    best_val_loss = float('inf')
    start_time = datetime.now()

    for epoch in range(1, args.epochs + 1):
        print(f"\nEpoch {epoch}/{args.epochs}")
        print("-" * 80)

        train_loss = train_epoch(model, train_loader, optimizer, scheduler, device, epoch)
        val_loss = validate(model, val_loader, device, epoch)

        current_lr = scheduler.get_last_lr()[0]
        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        history['learning_rate'].append(current_lr)

        print(f"\nEpoch {epoch} Summary:")
        print(f"  Train Loss: {train_loss:.4f}")
        print(f"  Val Loss: {val_loss:.4f}")
        print(f"  Learning Rate: {current_lr:.2e}")

        is_best = val_loss < best_val_loss
        if is_best:
            best_val_loss = val_loss

        save_checkpoint(model, processor, optimizer, epoch, train_loss, val_loss, args.output, is_best=is_best)

        # Save training history
        pd.DataFrame(history).to_csv(f'{args.output}/training_history.csv', index=False)

    # Training complete
    end_time = datetime.now()
    duration = end_time - start_time

    print("\n" + "="*80)
    print("TRAINING COMPLETE")
    print("="*80)
    print(f"Total time: {duration}")
    print(f"Best validation loss: {best_val_loss:.4f}")
    print(f"Final train loss: {history['train_loss'][-1]:.4f}")
    print(f"Final val loss: {history['val_loss'][-1]:.4f}")

    plot_training_curves(history, args.output)
    
    # Save training summary
    summary = f"""
Stage 1 Training Summary
{'='*80}

Model: {args.model_name}
Training Data: {args.data}
Output Directory: {args.output}

Training Configuration:
- Epochs: {args.epochs}
- Batch Size: {args.batch_size}
- Learning Rate: {args.learning_rate}
- Max Length: {args.max_length}
- Warmup Steps: {args.warmup_steps}

Training Results:
- Best Validation Loss: {best_val_loss:.4f}
- Final Train Loss: {history['train_loss'][-1]:.4f}
- Final Val Loss: {history['val_loss'][-1]:.4f}
- Training Duration: {duration}

Device: {device}
Started: {start_time}
Completed: {end_time}

"""
    
    with open(f'{args.output}/training_summary.txt', 'w') as f:
        f.write(summary)
    
    print(summary)
    print(f"\nAll outputs saved to: {args.output}")
    print("\nFiles generated:")
    print("  - best_model/ (best checkpoint)")
    print("  - best_model.pt")
    print("  - checkpoint_epoch_*.pt (all checkpoints)")
    print("  - training_history.csv")
    print("  - training_curves.png")
    print("  - training_summary.txt")

if __name__ == '__main__':
    main()