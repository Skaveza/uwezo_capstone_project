# Uwezo Document Verification Platform

## Overview
**Uwezo** is an intelligent platform designed to simplify and enhance the verification of financial documents. By leveraging advanced large language models (LLMs), Uwezo helps organizations efficiently extract, analyze, and validate document data while maintaining essential human oversight.

## Key Features
- **Automated Data Extraction:** Accurately extracts structured data from uploaded financial documents.  
- **Suspicious Document Detection:** Flags documents that may require closer human review.  
- **Continuous Learning:** Retrains on reviewed documents to improve accuracy over time.  

## Goal
Uwezo aims to streamline the document verification process, reducing manual effort without compromising on reliability or compliance.  

## Benefits
- Faster verification of financial documents  
- Reduced errors and fraud risk  
- Intelligent system that improves with use  
- Maintains essential human oversight for critical decisions  

## Getting Started
1. Upload your financial documents to the platform.  
2. Let Uwezo extract and analyze the data.  
3. Review flagged documents to ensure accuracy.  
4. Benefit from improved performance as the system learns from your feedback.  

# Setting Up the Uwezo Platform

Follow these steps to get the Uwezo Document Verification Platform running locally.

---

### 1. Clone the Repository
```bash
git clone <repository-url>
cd uwezo-platform
```
## Set Up and Environment
```bash
python -m venv env
source env/bin/activate
```
## Install Backend Dependencies
```bash
pip install -r requirements.txt
```
## Configure Environment Variables
```
VITE_API_BASE_URL=http://localhost:8000
```
## Run Backend
```
uvicorn api.main:app --reload
```
## Run Frontend
```
npm install
npm run dev
```

 ## Designs
 
<img width="1191" height="567" alt="Upload Documents" src="https://github.com/user-attachments/assets/fc1248f0-d6b2-4b86-a7d1-626da4ee5e04" />
<img width="1197" height="502" alt="Results" src="https://github.com/user-attachments/assets/acb671cd-efac-4596-8ccd-b6582904713c" />
<img width="1194" height="377" alt="Analytics" src="https://github.com/user-attachments/assets/6b814f39-428a-4c5f-8099-b7f36948bcdf" />
<img width="1191" height="660" alt="UserProfile" src="https://github.com/user-attachments/assets/6ba973ca-ab03-4cde-a45e-9dfde90e78d1" />


## Deployment Plan: Render

Follow these steps to deploy the Uwezo backend on [Render](https://render.com):

---

### 1. Create a New Web Service
1. Go to **Render → New → Web Service**.
2. Connect your `uwezo_backend` GitHub repository.
3. Choose the **main branch** for deployment.

---

### 2. Set Build & Start Commands

**Build Command:**
```bash
pip install -r requirements.txt
```
## Demo Video
https://youtu.be/eIkShx6rIC0
 
