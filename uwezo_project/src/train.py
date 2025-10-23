# src/train.py
import numpy as np
import evaluate
from pathlib import Path
from transformers import (
    AutoProcessor,
    LayoutLMv3ForTokenClassification,
    Trainer,
    TrainingArguments,
)
from src.preprocessing import get_dataset

# Build dataset
encoded, id2label, label2id, BIO_LABELS = get_dataset()

metric = evaluate.load("seqeval")

def _align_predictions(predictions, labels, id2label):
    preds = np.argmax(predictions, axis=-1)
    true_preds, true_labels = [], []
    for p_row, l_row in zip(preds, labels):
        tp, tl = [], []
        for p, l in zip(p_row, l_row):
            if l == -100:
                continue
            tp.append(id2label[int(p)])
            tl.append(id2label[int(l)])
        true_preds.append(tp)
        true_labels.append(tl)
    return true_preds, true_labels

def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    preds, refs = _align_predictions(predictions, labels, id2label)
    res = metric.compute(predictions=preds, references=refs)
    return {
        "precision": res["overall_precision"],
        "recall": res["overall_recall"],
        "f1": res["overall_f1"],
        "accuracy": res["overall_accuracy"],
    }

num_labels = len(BIO_LABELS)
processor = AutoProcessor.from_pretrained(
    "microsoft/layoutlmv3-base", apply_ocr=False
)
model = LayoutLMv3ForTokenClassification.from_pretrained(
    "microsoft/layoutlmv3-base",
    num_labels=num_labels,
    id2label=id2label,
    label2id=label2id,
)

args = TrainingArguments(
    output_dir="models/layoutlmv3_runs",
    learning_rate=5e-5,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    num_train_epochs=10,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    logging_steps=50,
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    greater_is_better=True,
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=encoded["train"],
    eval_dataset=encoded["validation"],
    tokenizer=processor,
    compute_metrics=compute_metrics,
)

if __name__ == "__main__":
    trainer.train()
