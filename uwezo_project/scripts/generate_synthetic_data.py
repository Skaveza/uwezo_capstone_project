#!/usr/bin/env python3

"""
Kenyan Synthetic Document Generator
Generates synthetic Kenyan National IDs and Bank statements with annotations for the Uwezo Project.

Usage: 
     python3 generate_synthetic_data.py --ids 100 --statements 100 --output ./data/synthetic
     python3 generate_synthetic_data.py --ids 1000 --statements 100 --output ./data/synthetic
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
from faker import Faker
import random, json, numpy as np
from datetime import datetime, timedelta
import pandas as pd
from tqdm import tqdm
import os, argparse, sys
import gc
import psutil

# Configuration
KENYAN_CONFIG = {
    'ethnic_groups': {
        'Kikuyu': 0.22, 'Luhya': 0.14, 'Luo': 0.13, 'Kalenjin': 0.12,
        'Kamba': 0.11, 'Kisii': 0.06, 'Meru': 0.05, 'Mijikenda': 0.05,
        'Maasai': 0.03, 'Turkana': 0.02, 'Other': 0.07
    },
    
    'counties': [
        'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Machakos', 'Kakamega',
        'Kisumu', 'Uasin Gishu', 'Meru', 'Kilifi', 'Nyeri', 'Kajiado',
        'Murang\'a', 'Kirinyaga', 'Laikipia', 'Garissa', 'Kitui', 'Bungoma',
        'Kakamega', 'Vihiga', 'Busia', 'Siaya', 'Kisii', 'Nyamira'
    ],
    
    'banks': [
        'KCB Bank Kenya', 'Equity Bank', 'Cooperative Bank',
        'Standard Chartered', 'Absa Bank Kenya', 'Family Bank',
        'Diamond Trust Bank', 'I&M Bank', 'Stanbic Bank', 'NCBA Bank'
    ],
    
    'names_by_ethnicity': {
        'Kikuyu': [
            'John Kamau', 'Mary Wanjiku', 'Peter Mwangi', 'Grace Nyambura',
            'James Karanja', 'Alice Wambui', 'David Njoroge', 'Jane Wanjiru',
            'Samuel Kimani', 'Lucy Wairimu', 'Patrick Ngugi', 'Ann Mumbi'
        ],
        'Luo': [
            'Peter Odhiambo', 'Grace Akinyi', 'James Otieno', 'Mary Atieno',
            'Tom Omondi', 'Lucy Anyango', 'Paul Owino', 'Sarah Awuor',
            'John Ochieng', 'Jane Adhiambo', 'David Okoth', 'Rose Auma'
        ],
        'Luhya': [
            'Sifa Kaveza', 'Mary Nafula', 'Peter Wekesa', 'Grace Nekesa',
            'David Barasa', 'Alice Khisa', 'James Makokha', 'Jane Wanjala',
            'Patrick Mukhwana', 'Lucy Nanjala', 'Stephen Wanyama', 'Ruth Simiyu'
        ],
        'Kalenjin': [
            'David Kipchoge', 'Grace Chebet', 'John Kibet', 'Mary Jepkorir',
            'Peter Rotich', 'Alice Chepkemoi', 'James Korir', 'Sarah Jeptoo',
            'William Kiptoo', 'Ruth Chepngetich', 'Daniel Kipruto', 'Jane Chepkoech'
        ],
        'Kamba': [
            'John Mutua', 'Mary Nduku', 'Peter Muthoka', 'Grace Ndinda',
            'James Mumo', 'Alice Mwikali', 'David Mutinda', 'Jane Kavita',
            'Patrick Musyoka', 'Lucy Mutheu', 'Stephen Kioko', 'Ruth Kanini'
        ],
        'Kisii': [
            'James Nyamweya', 'Mary Kemunto', 'John Ondieki', 'Grace Moraa',
            'Peter Ongeri', 'Alice Kwamboka', 'David Mogeni', 'Jane Kerubo'
        ],
        'Meru': [
            'John M\'Maitai', 'Mary Kendi', 'Peter Kaaria', 'Grace Kawira',
            'David M\'Murungi', 'Alice Kanini', 'James Kiura', 'Jane Karimi'
        ]
    },
    
    'quality_levels': {
        'excellent': {'blur': 0.0, 'noise': 0.0, 'rotation': 0.0, 'weight': 0.40},
        'good': {'blur': 0.5, 'noise': 0.02, 'rotation': 1.0, 'weight': 0.30},
        'fair': {'blur': 1.0, 'noise': 0.05, 'rotation': 2.0, 'weight': 0.20},
        'poor': {'blur': 2.0, 'noise': 0.10, 'rotation': 3.0, 'weight': 0.10}
    }
}

fake = Faker()

# Helper Functions
def select_by_distribution(distribution_dict):
    """Select item based on probability distribution"""
    items = list(distribution_dict.keys())
    weights = list(distribution_dict.values())
    return random.choices(items, weights=weights, k=1)[0]

def generate_kenyan_id_number():
    """Generate realistic Kenyan ID number (8 digits)"""
    return f"{random.randint(10000000, 99999999)}"

def generate_phone_number():
    """Generate Kenyan phone number (+254)"""
    prefix = random.choice(['701', '702', '703', '710', '711', '720', '721', '722', '733', '740', '741'])
    return f"+254{prefix}{random.randint(100000, 999999)}"

def generate_account_number(bank):
    """Generate bank-specific account number"""
    if 'KCB' in bank:
        return f"1234{random.randint(100000, 999999)}"
    elif 'Equity' in bank:
        return f"0150{random.randint(100000000, 999999999)}"
    elif 'Cooperative' in bank:
        return f"01{random.randint(10000000000, 99999999999)}"
    elif 'Standard Chartered' in bank:
        return f"0102{random.randint(100000000, 999999999)}"
    else:
        return f"{random.randint(1000000000, 9999999999)}"

def select_quality_level():
    """Select document quality level based on distribution"""
    levels = list(KENYAN_CONFIG['quality_levels'].keys())
    weights = [KENYAN_CONFIG['quality_levels'][l]['weight'] for l in levels]
    return random.choices(levels, weights=weights, k=1)[0]

def generate_transaction_amount(transaction_type):
    """Generate realistic amounts based on transaction type"""
    amount_ranges = {
        'M-PESA Deposit': (50, 50000),
        'Salary Payment': (15000, 300000),
        'ATM Withdrawal': (100, 20000),
        'KPLC - Electricity': (500, 15000),
        'Nairobi Water': (300, 8000),
        'School Fees Payment': (5000, 50000),
        'Loan Repayment': (1000, 50000),
        'Tala Loan Disbursement': (1000, 50000),
        'Branch Loan': (5000, 200000),
        'Airtel Money Transfer': (50, 30000),
        'POS Purchase - Supermarket': (200, 15000),
        'POS Purchase - Petrol': (500, 10000),
        'Standing Order': (1000, 50000),
        'Dividend Payment': (500, 50000),
        'Rent Payment': (5000, 100000)
    }
    min_amt, max_amt = amount_ranges.get(transaction_type, (100, 10000))
    return random.uniform(min_amt, max_amt)

def apply_quality_degradation(img, quality):
    """Apply quality degradation to image"""
    quality_params = KENYAN_CONFIG['quality_levels'][quality]
    
    # Apply blur
    if quality_params['blur'] > 0:
        img = img.filter(ImageFilter.GaussianBlur(radius=quality_params['blur']))
    
    # Apply rotation
    if quality_params['rotation'] > 0:
        angle = random.uniform(-quality_params['rotation'], quality_params['rotation'])
        img = img.rotate(angle, fillcolor='white', expand=False)
    
    # Apply noise
    if quality_params['noise'] > 0:
        img_array = np.array(img)
        noise = np.random.normal(0, quality_params['noise'] * 255, img_array.shape)
        img_array = np.clip(img_array + noise, 0, 255).astype(np.uint8)
        img = Image.fromarray(img_array)
    
    return img

# National ID Generation
def generate_national_id_data():
    """Generate synthetic National ID data"""
    ethnicity = select_by_distribution(KENYAN_CONFIG['ethnic_groups'])
    
    # Get name from ethnicity or generate random
    if ethnicity in KENYAN_CONFIG['names_by_ethnicity']:
        full_name = random.choice(KENYAN_CONFIG['names_by_ethnicity'][ethnicity])
    else:
        full_name = fake.name()
    
    # Generate other details
    id_number = generate_kenyan_id_number()
    dob = fake.date_of_birth(minimum_age=18, maximum_age=80)
    issue_date = fake.date_between(start_date='-10y', end_date='today')
    district = random.choice(KENYAN_CONFIG['counties'])
    
    return {
        'id_number': id_number,
        'full_name': full_name,
        'date_of_birth': dob.strftime('%d/%m/%Y'),
        'place_of_birth': district,
        'date_of_issue': issue_date.strftime('%d/%m/%Y'),
        'district_of_birth': district,
        'ethnicity': ethnicity,
        'sex': random.choice(['M', 'F'])
    }

def create_national_id_image(data, quality='excellent'):
    """Create synthetic National ID image"""
    # Create image (standard ID card size)
    width, height = 856, 540
    img = Image.new('RGB', (width, height), color='#E8F4F8')
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
    
    # Draw border
    draw.rectangle([10, 10, width-10, height-10], outline='#003366', width=3)
    
    # Title
    draw.text((width//2, 40), "REPUBLIC OF KENYA", fill='#003366', 
              font=title_font, anchor='mm')
    draw.text((width//2, 70), "NATIONAL IDENTITY CARD", fill='#003366', 
              font=text_font, anchor='mm')
    
    # Photo placeholder
    draw.rectangle([30, 110, 180, 280], fill='#CCCCCC', outline='#003366', width=2)
    draw.text((105, 195), "PHOTO", fill='#666666', font=text_font, anchor='mm')
    
    # ID Details
    y_offset = 120
    x_label = 220
    x_value = 400
    line_height = 35
    
    fields = [
        ('ID Number:', data['id_number']),
        ('Full Name:', data['full_name']),
        ('Date of Birth:', data['date_of_birth']),
        ('Sex:', data['sex']),
        ('District:', data['district_of_birth']),
        ('Date of Issue:', data['date_of_issue'])
    ]
    
    for label, value in fields:
        draw.text((x_label, y_offset), label, fill='#003366', font=label_font)
        draw.text((x_value, y_offset), str(value), fill='#000000', font=text_font)
        y_offset += line_height
    
    # Security feature placeholder
    draw.rectangle([width-150, height-80, width-30, height-30], outline='#CCCCCC', width=2)
    draw.text((width-90, height-55), "HOLOGRAM", fill='#AAAAAA', font=label_font, anchor='mm')
    
    # Signature line
    draw.line([30, 320, 180, 320], fill='#003366', width=2)
    draw.text((105, 335), "Signature", fill='#003366', font=label_font, anchor='mm')
    
    # Apply quality degradation
    img = apply_quality_degradation(img, quality)
    
    return img

# Bank Statement Generation
def generate_bank_statement_data():
    """Generate synthetic bank statement data"""
    bank = random.choice(KENYAN_CONFIG['banks'])
    ethnicity = select_by_distribution(KENYAN_CONFIG['ethnic_groups'])
    
    if ethnicity in KENYAN_CONFIG['names_by_ethnicity']:
        account_name = random.choice(KENYAN_CONFIG['names_by_ethnicity'][ethnicity])
    else:
        account_name = fake.name()
    
    account_number = generate_account_number(bank)
    phone = generate_phone_number()
    
    # Generate statement period (last month)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    # Generate transactions
    num_transactions = random.randint(15, 40)
    transactions = []
    balance = random.uniform(5000, 100000)
    opening_balance = balance
    
    transaction_types = [
        ('M-PESA Deposit', 'credit'),
        ('Salary Payment', 'credit'),
        ('ATM Withdrawal', 'debit'),
        ('KPLC - Electricity', 'debit'),
        ('Nairobi Water', 'debit'),
        ('School Fees Payment', 'debit'),
        ('Loan Repayment', 'debit'),
        ('Tala Loan Disbursement', 'credit'),
        ('Branch Loan', 'credit'),
        ('Airtel Money Transfer', 'credit'),
        ('POS Purchase - Supermarket', 'debit'),
        ('POS Purchase - Petrol', 'debit'),
        ('Standing Order', 'debit'),
        ('Dividend Payment', 'credit'),
        ('Rent Payment', 'debit')
    ]
    
    current_date = start_date
    for _ in range(num_transactions):
        trans_type, direction = random.choice(transaction_types)
        amount = generate_transaction_amount(trans_type)
        
        if direction == 'debit':
            balance -= amount
        else:
            balance += amount
        
        transactions.append({
            'date': current_date.strftime('%d/%m/%Y'),
            'description': trans_type,
            'debit': f"{amount:.2f}" if direction == 'debit' else '',
            'credit': f"{amount:.2f}" if direction == 'credit' else '',
            'balance': f"{balance:.2f}"
        })
        
        current_date += timedelta(days=random.randint(1, 3))
        if current_date > end_date:
            break
    
    return {
        'bank': bank,
        'account_name': account_name,
        'account_number': account_number,
        'phone': phone,
        'start_date': start_date.strftime('%d/%m/%Y'),
        'end_date': end_date.strftime('%d/%m/%Y'),
        'opening_balance': f"{opening_balance:.2f}",
        'closing_balance': f"{balance:.2f}",
        'transactions': transactions,
        'ethnicity': ethnicity
    }

def create_bank_statement_image(data, quality='excellent'):
    """Create synthetic bank statement image"""
    # Calculate height based on transactions
    base_height = 400
    trans_height = len(data['transactions']) * 25 + 200
    height = max(base_height, trans_height)
    width = 800
    
    img = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(img)
    
    # Load fonts
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 10)
    except:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Bank header
    draw.rectangle([0, 0, width, 80], fill='#1E4D8B')
    draw.text((width//2, 25), data['bank'].upper(), fill='white', 
              font=title_font, anchor='mm')
    draw.text((width//2, 55), "BANK STATEMENT", fill='white', 
              font=text_font, anchor='mm')
    
    # Account details
    y = 100
    draw.text((50, y), f"Account Name: {data['account_name']}", fill='black', font=text_font)
    y += 25
    draw.text((50, y), f"Account Number: {data['account_number']}", fill='black', font=text_font)
    y += 25
    draw.text((50, y), f"Statement Period: {data['start_date']} to {data['end_date']}", 
              fill='black', font=text_font)
    y += 25
    draw.text((50, y), f"Opening Balance: KES {data['opening_balance']}", fill='black', font=text_font)
    y += 40
    
    # Transaction table header
    draw.rectangle([40, y, width-40, y+25], fill='#E0E0E0')
    draw.text((60, y+5), "Date", fill='black', font=text_font)
    draw.text((180, y+5), "Description", fill='black', font=text_font)
    draw.text((450, y+5), "Debit (KES)", fill='black', font=text_font)
    draw.text((570, y+5), "Credit (KES)", fill='black', font=text_font)
    draw.text((680, y+5), "Balance (KES)", fill='black', font=text_font)
    y += 30
    
    # Transactions
    for trans in data['transactions']:
        draw.text((60, y), trans['date'], fill='black', font=small_font)
        draw.text((180, y), trans['description'][:30], fill='black', font=small_font)
        draw.text((450, y), trans['debit'], fill='black', font=small_font)
        draw.text((570, y), trans['credit'], fill='black', font=small_font)
        draw.text((680, y), trans['balance'], fill='black', font=small_font)
        y += 25
    
    # Closing balance
    y += 20
    draw.rectangle([40, y, width-40, y+30], fill='#F0F0F0')
    draw.text((width//2, y+15), f"Closing Balance: KES {data['closing_balance']}", 
              fill='black', font=text_font, anchor='mm')
    
    # Apply quality degradation
    img = apply_quality_degradation(img, quality)
    
    return img

# Main generation function
def memory_usage():
    """Check current memory usage"""
    process = psutil.Process()
    return process.memory_info().rss / 1024 / 1024  # MB

def generate_synthetic_dataset_optimized(num_ids, num_statements, output_dir, batch_size=200):
    """Generate dataset with memory optimization for 8GB RAM"""
    
    print("="*60)
    print("OPTIMIZED SYNTHETIC DOCUMENT GENERATION")
    print(f"Memory available: {psutil.virtual_memory().total / 1024 / 1024 / 1024:.1f} GB")
    print(f"Free space: {psutil.disk_usage(output_dir).free / 1024 / 1024 / 1024:.1f} GB")
    print("="*60)
    
    # Create directories
    os.makedirs(f'{output_dir}/national_ids', exist_ok=True)
    os.makedirs(f'{output_dir}/bank_statements', exist_ok=True)
    os.makedirs(f'{output_dir}/annotations', exist_ok=True)
    
    metadata = []
    start_time = datetime.now()
    
    # Generate National IDs in small batches
    print(f"\nGenerating {num_ids} National IDs (batch size: {batch_size})...")
    for batch_num in range(0, num_ids, batch_size):
        batch_end = min(batch_num + batch_size, num_ids)
        current_batch_size = batch_end - batch_num
        
        print(f"\nNational IDs Batch {batch_num//batch_size + 1}/{(num_ids + batch_size - 1)//batch_size}")
        print(f"Memory before batch: {memory_usage():.1f} MB")
        
        batch_metadata = []
        for i in tqdm(range(current_batch_size), desc=f"IDs {batch_num + 1}-{batch_end}"):
            global_idx = batch_num + i
            try:
                data = generate_national_id_data()
                quality = select_quality_level()
                img = create_national_id_image(data, quality)
                
                # Save image immediately to free memory
                img_path = f"{output_dir}/national_ids/id_{global_idx + 1:05d}.png"
                img.save(img_path)
                
                # Save annotation
                annotation_path = f"{output_dir}/annotations/id_{global_idx + 1:05d}.json"
                with open(annotation_path, 'w') as f:
                    json.dump({
                        'document_type': 'national_id',
                        'image_path': img_path,
                        'quality': quality,
                        'fields': data
                    }, f, indent=2)
                
                batch_metadata.append({
                    'document_type': 'national_id',
                    'document_id': f'id_{global_idx + 1:05d}',
                    'quality': quality,
                    'ethnicity': data['ethnicity'],
                    'sex': data['sex'],
                    'district': data['district_of_birth']
                })
                
                # Force garbage collection every 50 images
                if (i + 1) % 50 == 0:
                    gc.collect()
                    
            except Exception as e:
                print(f"\nError generating ID {global_idx + 1}: {e}")
                continue
        
        metadata.extend(batch_metadata)
        
        # Save checkpoint after each batch
        checkpoint_df = pd.DataFrame(metadata)
        checkpoint_df.to_csv(f'{output_dir}/metadata_checkpoint.csv', index=False)
        
        print(f"Memory after batch: {memory_usage():.1f} MB")
        print(f"✓ Batch completed - {len(metadata)}/{num_ids + num_statements} total documents")
        
        # Clear batch data
        del batch_metadata
        gc.collect()
    
    # Generate Bank Statements in small batches
    print(f"\nGenerating {num_statements} Bank Statements (batch size: {batch_size})...")
    for batch_num in range(0, num_statements, batch_size):
        batch_end = min(batch_num + batch_size, num_statements)
        current_batch_size = batch_end - batch_num
        
        print(f"\nBank Statements Batch {batch_num//batch_size + 1}/{(num_statements + batch_size - 1)//batch_size}")
        print(f"Memory before batch: {memory_usage():.1f} MB")
        
        batch_metadata = []
        for i in tqdm(range(current_batch_size), desc=f"Statements {batch_num + 1}-{batch_end}"):
            global_idx = batch_num + i
            try:
                data = generate_bank_statement_data()
                quality = select_quality_level()
                img = create_bank_statement_image(data, quality)
                
                # Save image immediately to free memory
                img_path = f"{output_dir}/bank_statements/statement_{global_idx + 1:05d}.png"
                img.save(img_path)
                
                # Save annotation
                annotation_path = f"{output_dir}/annotations/statement_{global_idx + 1:05d}.json"
                with open(annotation_path, 'w') as f:
                    json.dump({
                        'document_type': 'bank_statement',
                        'image_path': img_path,
                        'quality': quality,
                        'fields': data
                    }, f, indent=2)
                
                batch_metadata.append({
                    'document_type': 'bank_statement',
                    'document_id': f'statement_{global_idx + 1:05d}',
                    'quality': quality,
                    'bank': data['bank'],
                    'ethnicity': data['ethnicity'],
                    'num_transactions': len(data['transactions'])
                })
                
                # Force garbage collection every 25 images (statements use more memory)
                if (i + 1) % 25 == 0:
                    gc.collect()
                    
            except Exception as e:
                print(f"\nError generating statement {global_idx + 1}: {e}")
                continue
        
        metadata.extend(batch_metadata)
        
        # Save checkpoint after each batch
        checkpoint_df = pd.DataFrame(metadata)
        checkpoint_df.to_csv(f'{output_dir}/metadata_checkpoint.csv', index=False)
        
        print(f"Memory after batch: {memory_usage():.1f} MB")
        print(f"✓ Batch completed - {len(metadata)}/{num_ids + num_statements} total documents")
        
        # Clear batch data
        del batch_metadata
        gc.collect()
    
    # Save final metadata
    metadata_df = pd.DataFrame(metadata)
    metadata_df.to_csv(f'{output_dir}/metadata.csv', index=False)
    
    duration = datetime.now() - start_time
    print(f" Generation completed in {duration}")
    print(f" Total documents: {len(metadata)}")
    print(f" Final memory usage: {memory_usage():.1f} MB")
    
    return metadata_df

# Command line interface
def main():
    parser = argparse.ArgumentParser(
        description='Generate synthetic Kenyan documents (National IDs and Bank Statements)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate small test batch
  python generate_synthetic_data.py --ids 50 --statements 50 --output ./data/synthetic
  
  # Generate full dataset
  python generate_synthetic_data.py --ids 10000 --statements 10000 --output ./data/synthetic
        """
    )
    
    parser.add_argument('--ids', type=int, default=100, help='Number of National IDs to generate')
    parser.add_argument('--statements', type=int, default=100, help='Number of Bank Statements to generate')
    parser.add_argument('--output', type=str, default='./data/synthetic', help='Output directory')
    parser.add_argument('--batch-size', type=int, default=200, help='Batch size for memory optimization')
    parser.add_argument('--seed', type=int, default=None, help='Random seed for reproducibility')
    
    args = parser.parse_args()
    
    # Set random seed if provided
    if args.seed is not None:
        random.seed(args.seed)
        np.random.seed(args.seed)
        print(f"Random seed set to: {args.seed}")
    
    # Validate inputs
    if args.ids < 0 or args.statements < 0:
        print("Error: Number of documents must be positive")
        sys.exit(1)
    
    # Ensure output directory exists before checking disk space
    os.makedirs(args.output, exist_ok=True)
    
    # Check disk space
    free_space_gb = psutil.disk_usage(args.output).free / 1024 / 1024 / 1024
    estimated_space_gb = (args.ids + args.statements) * 0.0002  # ~200KB per document
    
    if free_space_gb < estimated_space_gb:
        print(f" Warning: Estimated space needed: {estimated_space_gb:.1f} GB")
        print(f"   Available space: {free_space_gb:.1f} GB")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            return 1
    
    # Generate dataset
    try:
        metadata_df = generate_synthetic_dataset_optimized(
            num_ids=args.ids,
            num_statements=args.statements,
            output_dir=args.output,
            batch_size=args.batch_size
        )
        print(" Dataset generation completed successfully.")
        return 0
    except KeyboardInterrupt:
        print("\n\nGeneration interrupted by user")
        print("Partial data may have been saved. Check metadata_checkpoint.csv")
        return 1
    except Exception as e:
        print(f"\n\nError during generation: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
