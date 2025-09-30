#!/usr/bin/env python3
"""
Validate generated synthetic dataset
Checks file counts, integrity, and consistency
"""

import os
import json
import pandas as pd
import argparse
from pathlib import Path
import sys

def validate_dataset(dataset_path):
    """Validate generated dataset integrity"""
    print("="*60)
    print("DATASET VALIDATION")
    print("="*60)
    
    dataset_path = Path(dataset_path)
    
    if not dataset_path.exists():
        print(f" Dataset path does not exist: {dataset_path}")
        return False
    
    print(f"Validating: {dataset_path}")
    print()
    
    # Check directory structure
    required_dirs = ['national_ids', 'bank_statements', 'annotations']
    missing_dirs = []
    for dir_name in required_dirs:
        dir_path = dataset_path / dir_name
        if not dir_path.exists():
            missing_dirs.append(dir_name)
        else:
            print(f" Found directory: {dir_name}")
    
    if missing_dirs:
        print(f" Missing directories: {missing_dirs}")
        return False
    
    # Count files in each directory
    print("\n" + "="*40)
    print("FILE COUNT VALIDATION")
    print("="*40)
    
    # Count National IDs
    id_files = list((dataset_path / 'national_ids').glob('*.png'))
    print(f"National ID images: {len(id_files)}")
    
    # Count Bank Statements  
    stmt_files = list((dataset_path / 'bank_statements').glob('*.png'))
    print(f"Bank Statement images: {len(stmt_files)}")
    
    # Count Annotations
    id_annotations = list((dataset_path / 'annotations').glob('id_*.json'))
    stmt_annotations = list((dataset_path / 'annotations').glob('statement_*.json'))
    print(f"ID annotations: {len(id_annotations)}")
    print(f"Statement annotations: {len(stmt_annotations)}")
    
    # Check metadata file
    metadata_path = dataset_path / 'metadata.csv'
    if metadata_path.exists():
        try:
            df = pd.read_csv(metadata_path)
            print(f"Metadata records: {len(df)}")
            
            # Check metadata consistency
            id_metadata = len(df[df['document_type'] == 'national_id'])
            stmt_metadata = len(df[df['document_type'] == 'bank_statement'])
            print(f"Metadata - IDs: {id_metadata}, Statements: {stmt_metadata}")
            
        except Exception as e:
            print(f" Error reading metadata: {e}")
    else:
        print(" Metadata file missing")
    
    print("\n" + "="*40)
    print("FILE INTEGRITY CHECK")
    print("="*40)
    
    # Check file integrity
    corrupted_files = []
    missing_annotations = []
    
    # Check National IDs
    for img_file in id_files[:100]:  # Check first 100 files
        # Check image file
        try:
            from PIL import Image
            with Image.open(img_file) as img:
                img.verify()
        except Exception as e:
            corrupted_files.append(f"Image: {img_file.name} - {e}")
        
        # Check corresponding annotation
        annotation_file = dataset_path / 'annotations' / f"{img_file.stem}.json"
        if not annotation_file.exists():
            missing_annotations.append(f"Missing annotation: {annotation_file.name}")
        else:
            try:
                with open(annotation_file, 'r') as f:
                    json.load(f)
            except Exception as e:
                corrupted_files.append(f"Annotation: {annotation_file.name} - {e}")
    
    # Check Bank Statements
    for img_file in stmt_files[:100]:  # Check first 100 files
        # Check image file
        try:
            from PIL import Image
            with Image.open(img_file) as img:
                img.verify()
        except Exception as e:
            corrupted_files.append(f"Image: {img_file.name} - {e}")
        
        # Check corresponding annotation
        annotation_file = dataset_path / 'annotations' / f"{img_file.stem}.json"
        if not annotation_file.exists():
            missing_annotations.append(f"Missing annotation: {annotation_file.name}")
        else:
            try:
                with open(annotation_file, 'r') as f:
                    json.load(f)
            except Exception as e:
                corrupted_files.append(f"Annotation: {annotation_file.name} - {e}")
    
    # Report results
    if corrupted_files:
        print(f" Found {len(corrupted_files)} corrupted files:")
        for error in corrupted_files[:5]:  # Show first 5 errors
            print(f"   - {error}")
        if len(corrupted_files) > 5:
            print(f"   ... and {len(corrupted_files) - 5} more")
    else:
        print(" All checked files are valid")
    
    if missing_annotations:
        print(f" Found {len(missing_annotations)} missing annotations:")
        for error in missing_annotations[:5]:
            print(f"   - {error}")
        if len(missing_annotations) > 5:
            print(f"   ... and {len(missing_annotations) - 5} more")
    else:
        print(" All annotations present")
    
    print("\n" + "="*40)
    print("SUMMARY")
    print("="*40)
    
    # Final assessment
    total_expected = len(id_files) + len(stmt_files)
    print(f"Total images: {total_expected}")
    print(f"Total annotations: {len(id_annotations) + len(stmt_annotations)}")
    
    if not corrupted_files and not missing_annotations:
        print(" DATASET VALIDATION PASSED")
        print(f" {len(id_files)} National IDs")
        print(f" {len(stmt_files)} Bank Statements")
        print(f" {len(id_annotations) + len(stmt_annotations)} Annotations")
        return True
    else:
        print("DATASET VALIDATION FAILED")
        return False

def validate_all_batches(base_path="./data"):
    """Validate all synthetic_part batches"""
    base_path = Path(base_path)
    batches = list(base_path.glob("synthetic_part*"))
    
    if not batches:
        print("No synthetic_part batches found")
        return
    
    print("VALIDATING ALL BATCHES")
    print("="*60)
    
    total_ids = 0
    total_statements = 0
    all_valid = True
    
    for batch_path in sorted(batches):
        print(f" Validating: {batch_path.name}")
        print("-" * 40)
        
        if validate_dataset(batch_path):
            # Count files for summary
            id_files = len(list((batch_path / 'national_ids').glob('*.png')))
            stmt_files = len(list((batch_path / 'bank_statements').glob('*.png')))
            total_ids += id_files
            total_statements += stmt_files
        else:
            all_valid = False
    
    print("\n" + "="*60)
    print("FINAL SUMMARY")
    print("="*60)
    print(f"Total batches: {len(batches)}")
    print(f"Total National IDs: {total_ids}")
    print(f"Total Bank Statements: {total_statements}")
    print(f"Grand Total: {total_ids + total_statements} documents")
    
    if all_valid:
        print("ALL BATCHES VALIDATED SUCCESSFULLY!")
    else:
        print(" Some batches have issues")

def main():
    parser = argparse.ArgumentParser(description='Validate synthetic dataset')
    parser.add_argument('dataset', nargs='?', help='Path to dataset directory (optional)')
    parser.add_argument('--all', action='store_true', help='Validate all batches in ./data')
    
    args = parser.parse_args()
    
    if args.all:
        validate_all_batches()
    elif args.dataset:
        if validate_dataset(args.dataset):
            print("\nValidation PASSED")
            sys.exit(0)
        else:
            print("\n Validation FAILED")
            sys.exit(1)
    else:
        # Default: validate all batches
        validate_all_batches()

if __name__ == '__main__':
    main()