# src/evaluate.py

import numpy as np
import evaluate
from transformers import AutoProcessor, LayoutLMv3ForTokenClassification
from src.preprocessing import get_dataset

encoded, id2label, label2id, BIO_LABELS = get_dataset()
metric = evaluate.load("seqeval")

def _align(predictions, labels):
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

if __name__ == "__main__":
    model = LayoutLMv3ForTokenClassification.from_pretrained(
        "models/layoutlmv3_runs/checkpoint-best"
    )
    processor = AutoProcessor.from_pretrained("microsoft/layoutlmv3-base", apply_ocr=False)
    preds, labels, _ = model.predict(encoded["test"])
    preds, refs = _align(preds, labels)
    results = metric.compute(predictions=preds, references=refs)
    print(results)
