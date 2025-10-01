#!/usr/bin/env python3
"""
Prepare Synthetic Kenyan Dataset for Training
Converts synthetic data into format required by vision-language models

Usage:
    python prepare_training_data.py --input ./data/synthetic --output ./data/training
"""

import json
import pandas as pd
from PIL import Image
import os
import argparse
from pathlib import Path
import random
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import shutil

def load_synthetic_data(input_dir):
    """Load metadata and prepare file paths"""
    print("Loading synthetic data metadata...")
    
    metadata_path = f"{input_dir}/metadata.csv"
    metadata_df = pd.read_csv(metadata_path)
    
    print(f"  Total documents: {len(metadata_df)}")
    print(f"  National IDs: {len(metadata_df[metadata_df['document_type'] == 'national_id'])}")
    print(f"  Bank Statements: {len(metadata_df[metadata_df['document_type'] == 'bank_statement'])}")
    
    return metadata_df

def prepare_document_sample(input_dir, doc_type, doc_id):
    """Load image and annotation for a single document"""
    
    # Load image
    if doc_type == 'national_id':
        img_path = f"{input_dir}/national_ids/{doc_id}.png"
    else:
        img_path = f"{input_dir}/bank_statements/{doc_id}.png"
    
    # Load annotation
    annot_path = f"{input_dir}/annotations/{doc_id}.json"
    
    if not os.path.exists(img_path) or not os.path.exists(annot_path):
        return None
    
    with open(annot_path, 'r') as f:
        annotation = json.load(f)
    
    return {
        'image_path': img_path,
        'document_type': doc_type,
        'fields': annotation['fields'],
        'quality': annotation['quality']
    }

def create_training_format(sample):
    """
    Convert sample to training format
    Format: {"image": path, "ground_truth": JSON string of extracted fields}
    """
    
    # For National ID
    if sample['document_type'] == 'national_id':
        ground_truth = {
            "document_type": "national_id",
            "id_number": sample['fields']['id_number'],
            "full_name": sample['fields']['full_name'],
            "date_of_birth": sample['fields']['date_of_birth'],
            "sex": sample['fields']['sex'],
            "district_of_birth": sample['fields']['district_of_birth'],
            "date_of_issue": sample['fields']['date_of_issue']
        }
    
    # For Bank Statement
    else:
        ground_truth = {
            "document_type": "bank_statement",
            "bank": sample['fields']['bank'],
            "account_name": sample['fields']['account_name'],
            "account_number": sample['fields']['account_number'],
            "start_date": sample['fields']['start_date'],
            "end_date": sample['fields']['end_date'],
            "opening_balance": sample['fields']['opening_balance'],
            "closing_balance": sample['fields']['closing_balance'],
            "transactions": sample['fields']['transactions'][:10]  # Limit transactions for training
        }
    
    return {
        "image": sample['image_path'],
        "ground_truth": json.dumps(ground_truth)
    }

def split_dataset(metadata_df, train_ratio=0.70, val_ratio=0.15, test_ratio=0.15, random_seed=42):
    """Simple random split that works with any dataset size"""
    
    print("\nSplitting dataset...")
    
    # Shuffle the dataset
    shuffled_df = metadata_df.sample(frac=1, random_state=random_seed).reset_index(drop=True)
    
    # Calculate split indices
    n_total = len(shuffled_df)
    n_train = int(n_total * train_ratio)
    n_val = int(n_total * val_ratio)
    
    # Split the data
    train_df = shuffled_df.iloc[:n_train]
    val_df = shuffled_df.iloc[n_train:n_train + n_val]
    test_df = shuffled_df.iloc[n_train + n_val:]
    
    print(f"  Train: {len(train_df)} ({len(train_df)/n_total*100:.1f}%)")
    print(f"  Val: {len(val_df)} ({len(val_df)/n_total*100:.1f}%)")
    print(f"  Test: {len(test_df)} ({len(test_df)/n_total*100:.1f}%)")
    
    # Show distribution by document type
    print("\nDocument type distribution:")
    for split_name, split_df in [('Train', train_df), ('Val', val_df), ('Test', test_df)]:
        nat_ids = len(split_df[split_df['document_type'] == 'national_id'])
        bank_stmts = len(split_df[split_df['document_type'] == 'bank_statement'])
        print(f"  {split_name}: {nat_ids} National IDs, {bank_stmts} Bank Statements")
    
    return train_df, val_df, test_df

def save_split(input_dir, split_df, output_dir, split_name):
    """Save a data split in training format"""
    
    print(f"\nPreparing {split_name} split...")
    
    samples = []
    
    for _, row in tqdm(split_df.iterrows(), total=len(split_df), desc=f"Processing {split_name}"):
        sample = prepare_document_sample(input_dir, row['document_type'], row['document_id'])
        
        if sample is not None:
            training_sample = create_training_format(sample)
            samples.append(training_sample)
    
    # Save as JSONL (one JSON object per line)
    output_path = f"{output_dir}/{split_name}.jsonl"
    with open(output_path, 'w') as f:
        for sample in samples:
            f.write(json.dumps(sample) + '\n')
    
    print(f"   Saved {len(samples)} samples to {output_path}")
    
    return samples

def create_dataset_info(train_samples, val_samples, test_samples, output_dir):
    """Create dataset information file"""
    
    info = {
        "dataset_name": "Kenyan Synthetic Documents",
        "version": "1.0",
        "description": "Synthetic Kenyan National IDs and Bank Statements for document verification training",
        "total_samples": len(train_samples) + len(val_samples) + len(test_samples),
        "splits": {
            "train": len(train_samples),
            "validation": len(val_samples),
            "test": len(test_samples)
        },
        "document_types": ["national_id", "bank_statement"],
        "fields": {
            "national_id": [
                "document_type", "id_number", "full_name", "date_of_birth",
                "sex", "district_of_birth", "date_of_issue"
            ],
            "bank_statement": [
                "document_type", "bank", "account_name", "account_number",
                "start_date", "end_date", "opening_balance", "closing_balance", "transactions"
            ]
        },
        "quality_levels": ["excellent", "good", "fair", "poor"]
    }
    
    with open(f"{output_dir}/dataset_info.json", 'w') as f:
        json.dump(info, f, indent=2)
    
    print(f"\n Dataset info saved to {output_dir}/dataset_info.json")

def create_data_stats(metadata_df, output_dir):
    """Create statistics about the dataset splits"""
    
    print("\nGenerating dataset statistics...")
    
    stats = []
    
    for split_name in ['train', 'val', 'test']:
        split_file = f"{output_dir}/{split_name}.jsonl"
        
        if os.path.exists(split_file):
            with open(split_file, 'r') as f:
                samples = [json.loads(line) for line in f]
            
            doc_types = {}
            for sample in samples:
                gt = json.loads(sample['ground_truth'])
                doc_type = gt['document_type']
                doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
            
            stats.append({
                'split': split_name,
                'total': len(samples),
                'national_ids': doc_types.get('national_id', 0),
                'bank_statements': doc_types.get('bank_statement', 0)
            })
    
    stats_df = pd.DataFrame(stats)
    stats_df.to_csv(f"{output_dir}/split_statistics.csv", index=False)
    
    print("\nDataset Split Statistics:")
    print(stats_df.to_string(index=False))
    print(f"\n Statistics saved to {output_dir}/split_statistics.csv")

def main():
    parser = argparse.ArgumentParser(
        description='Prepare synthetic Kenyan data for training',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument('--input', type=str, required=True,
                       help='Input directory with synthetic data')
    parser.add_argument('--output', type=str, required=True,
                       help='Output directory for training data')
    parser.add_argument('--train-ratio', type=float, default=0.70,
                       help='Training set ratio (default: 0.70)')
    parser.add_argument('--val-ratio', type=float, default=0.15,
                       help='Validation set ratio (default: 0.15)')
    parser.add_argument('--test-ratio', type=float, default=0.15,
                       help='Test set ratio (default: 0.15)')
    parser.add_argument('--seed', type=int, default=42,
                       help='Random seed (default: 42)')
    
    args = parser.parse_args()
    
    print("="*80)
    print("PREPARING TRAINING DATA")
    print("="*80)
    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print(f"Split: {args.train_ratio:.0%} train, {args.val_ratio:.0%} val, {args.test_ratio:.0%} test")
    print("="*80)
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    # Load metadata
    metadata_df = load_synthetic_data(args.input)
    
    # Split dataset
    train_df, val_df, test_df = split_dataset(
        metadata_df,
        train_ratio=args.train_ratio,
        val_ratio=args.val_ratio,
        test_ratio=args.test_ratio,
        random_seed=args.seed
    )
    
    # Save splits
    train_samples = save_split(args.input, train_df, args.output, 'train')
    val_samples = save_split(args.input, val_df, args.output, 'val')
    test_samples = save_split(args.input, test_df, args.output, 'test')
    
    # Create dataset info
    create_dataset_info(train_samples, val_samples, test_samples, args.output)
    
    # Create statistics
    create_data_stats(metadata_df, args.output)
    
    print("\n" + "="*80)
    print("DATA PREPARATION COMPLETE")
    print("="*80)
    print(f"\nTraining data ready at: {args.output}")
    print("\nGenerated files:")
    print("  - train.jsonl")
    print("  - val.jsonl")
    print("  - test.jsonl")
    print("  - dataset_info.json")
    print("  - split_statistics.csv")

if __name__ == '__main__':
    main()
