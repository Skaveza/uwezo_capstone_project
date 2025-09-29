"""
Uwezo Project Setup Script
Run this first to create your project structure
"""

import os
from pathlib import Path

def create_project_structure():
    """Create the complete project directory structure"""
    
    # Define directory structure
    directories = [
        'notebooks',
        'src/generators',
        'src/utils',
        'data/fc_amf_subset',
        'data/synthetic/national_ids',
        'data/synthetic/bank_statements',
        'data/annotations',
        'data/splits/train',
        'data/splits/val',
        'data/splits/test',
        'models/checkpoints',
        'models/final',
        'outputs/visualizations',
        'outputs/metrics',
        'outputs/samples'
    ]
    
    # Create directories
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✓ Created: {directory}")
    
    # Create __init__.py files for Python packages
    init_files = [
        'src/__init__.py',
        'src/generators/__init__.py',
        'src/utils/__init__.py'
    ]
    
    for init_file in init_files:
        Path(init_file).touch()
        print(f"✓ Created: {init_file}")
    
    print("\n✅ Project structure created successfully!")

def create_requirements_file():
    """Create requirements.txt with all dependencies"""
    
    requirements = """# Core ML libraries
datasets==2.16.1
transformers==4.37.2
torch==2.1.2
accelerate==0.26.1

# Image processing
pillow==10.2.0
opencv-python==4.9.0.80
reportlab==4.0.9

# Data generation
faker==22.6.0

# Data manipulation and analysis
pandas==2.2.0
numpy==1.26.3
scipy==1.12.0

# Visualization
matplotlib==3.8.2
seaborn==0.13.2
plotly==5.18.0

# Utilities
tqdm==4.66.1
pyyaml==6.0.1
python-dotenv==1.0.1

# Jupyter
jupyter==1.0.0
ipywidgets==8.1.1
"""
    
    with open('requirements.txt', 'w') as f:
        f.write(requirements)
    
    print("✓ Created: requirements.txt")

def create_config_file():
    """Create configuration file with project settings"""
    
    config = """\"\"\"
Uwezo Project Configuration
\"\"\"

# Dataset configuration
DATASET_CONFIG = {
    'fc_amf_subset_size': 50000,  # Number of documents to use from FC-AMF-OCR
    'synthetic_national_ids': 10000,
    'synthetic_bank_statements': 10000,
    'train_split': 0.70,
    'val_split': 0.15,
    'test_split': 0.15
}

# Kenyan demographics
KENYAN_DEMOGRAPHICS = {
    'ethnic_groups': {
        'Kikuyu': 0.22,
        'Luhya': 0.14,
        'Luo': 0.13,
        'Kalenjin': 0.12,
        'Kamba': 0.11,
        'Kisii': 0.06,
        'Meru': 0.05,
        'Mijikenda': 0.05,
        'Maasai': 0.03,
        'Turkana': 0.02,
        'Other': 0.07
    },
    'counties': [
        'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Machakos', 
        'Kakamega', 'Kisumu', 'Uasin Gishu', 'Meru', 'Kilifi',
        'Nyeri', 'Kajiado', 'Murang\'a', 'Kirinyaga', 'Laikipia'
    ],
    'major_banks': [
        'KCB Bank Kenya', 'Equity Bank', 'Cooperative Bank',
        'Standard Chartered', 'Absa Bank Kenya', 'Family Bank',
        'Diamond Trust Bank', 'I&M Bank', 'Stanbic Bank', 'NCBA Bank'
    ]
}

# Document quality levels
QUALITY_LEVELS = {
    'excellent': {'blur': 0.0, 'noise': 0.0, 'rotation': 0.0, 'percentage': 0.40},
    'good': {'blur': 0.5, 'noise': 0.02, 'rotation': 1.0, 'percentage': 0.30},
    'fair': {'blur': 1.0, 'noise': 0.05, 'rotation': 2.0, 'percentage': 0.20},
    'poor': {'blur': 2.0, 'noise': 0.10, 'rotation': 3.0, 'percentage': 0.10}
}

# Model configuration
MODEL_CONFIG = {
    'model_name': 'naver-clova-ix/donut-base',  # Default model
    'max_length': 512,
    'image_size': (1280, 960),
    'batch_size': 8,
    'learning_rate': 1e-5,
    'num_epochs': 10
}

# Training configuration
TRAINING_CONFIG = {
    'seed': 42,
    'gradient_accumulation_steps': 4,
    'warmup_steps': 500,
    'weight_decay': 0.01,
    'logging_steps': 100,
    'save_steps': 1000,
    'eval_steps': 500
}

# Paths
PATHS = {
    'data_dir': 'data/',
    'model_dir': 'models/',
    'output_dir': 'outputs/',
    'checkpoint_dir': 'models/checkpoints/'
}
"""
    
    with open('src/config.py', 'w') as f:
        f.write(config)
    
    print("✓ Created: src/config.py")

def create_readme():
    """Create README with project overview"""
    
    readme = """# Uwezo: AI-Powered Document Verification for Kenya

## Project Overview
Uwezo is a machine learning platform that uses Large Language Models (LLMs) and advanced OCR 
to verify Kenyan financial documents (National IDs and bank statements).

## Project Structure
```
uwezo_project/
├── notebooks/          # Jupyter notebooks for experimentation
├── src/               # Source code
│   ├── generators/    # Synthetic data generators
│   └── utils/         # Utility functions
├── data/              # Datasets
├── models/            # Trained models and checkpoints
└── outputs/           # Results and visualizations
```

## Setup Instructions

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run notebooks in order:
- 01_data_exploration.ipynb
- 02_synthetic_generation.ipynb
- 03_model_training.ipynb
- 04_evaluation.ipynb

## Research Objectives
- Improve document verification accuracy to >95%
- Reduce processing time to <10 seconds per document
- Ensure bias mitigation across demographic groups

## Author
Mwachoni Sifa Kaveza
African Leadership University
"""
    
    with open('README.md', 'w') as f:
        f.write(readme)
    
    print("✓ Created: README.md")

if __name__ == "__main__":
    print(" Setting up Uwezo Project Structure...\n")
    
    create_project_structure()
    print()
    create_requirements_file()
    create_config_file()
    create_readme()
    
    print("\n" + "="*60)
    print("Setup Complete!")
    print("="*60)
    print("\nNext Steps:")
    print("1. Run: pip install -r requirements.txt")
