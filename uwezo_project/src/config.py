"""
Uwezo Project Configuration
"""

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
        'Nyeri', 'Kajiado', 'Murang'a', 'Kirinyaga', 'Laikipia'
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
