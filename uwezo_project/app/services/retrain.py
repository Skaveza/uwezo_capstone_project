import subprocess

def retrain_model(document_id):
    subprocess.Popen(["python", "train.py", "--document_id", str(document_id)])
    return True
