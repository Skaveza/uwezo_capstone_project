# Uwezo: AI-Powered Document Verification for Kenya

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
