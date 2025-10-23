# src/preprocessing.py

import json
from pathlib import Path
from datasets import Dataset, DatasetDict
from transformers import LayoutLMv3Processor
from PIL import Image

# Paths
PROC_IMG = Path("processed/images")
PROC_OCR = Path("processed/ocr")
YOLO_ROOT = Path("yolo")

# Label definitions
CLASSES = [
    "table_transactions_data","table_transactions_header","account_holder_name",
    "bank_name","account_number","statement_period","opening_balance",
    "currency","doc_type"
]
BIO_LABELS = ["O"] + [f"B-{c}" for c in CLASSES] + [f"I-{c}" for c in CLASSES]
id2label = {i:l for i,l in enumerate(BIO_LABELS)}
label2id = {l:i for i,l in id2label.items()}


def load_yolo(lbl_path, W, H):
    out = []
    if not lbl_path.exists():
        return out
    for ln in lbl_path.read_text().strip().splitlines():
        c, xc, yc, w, h = ln.split()
        c = int(c)
        xc, yc, w, h = map(float, (xc, yc, w, h))
        x1 = max(int((xc - w / 2) * W), 0)
        y1 = max(int((yc - h / 2) * H), 0)
        x2 = min(int((xc + w / 2) * W), W - 1)
        y2 = min(int((yc + h / 2) * H), H - 1)
        out.append({"cid": c, "name": CLASSES[c], "bbox": [x1, y1, x2, y2]})
    return out


def center_in(box, x, y):
    x1, y1, x2, y2 = box
    return x1 <= x <= x2 and y1 <= y <= y2


def to_bio(words, fields):
    tags = ["O"] * len(words)
    for i, w in enumerate(words):
        x1, y1, x2, y2 = w["bbox"]
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
        hit = None
        for f in fields:
            if center_in(f["bbox"], cx, cy):
                hit = f["name"]
                break
        if hit:
            prev = tags[i - 1] if i > 0 else "O"
            prefix = "I-" if prev.endswith(hit) else "B-"
            tags[i] = f"{prefix}{hit}"
    return tags


def page_examples(split):
    IMG_SPLIT = PROC_IMG / split
    OCR_SPLIT = PROC_OCR / split
    LBL_SPLIT = YOLO_ROOT / "labels" / split

    items = []
    for jp in sorted(OCR_SPLIT.glob("*.json")):
        data = json.loads(jp.read_text())
        W, H = data["width"], data["height"]
        words = [w for w in data["words"] if w.get("text", "").strip()]
        img_path = Path(data["image_path"])
        lbl = LBL_SPLIT / (img_path.stem + ".txt")
        fields = load_yolo(lbl, W, H)
        tags = to_bio(words, fields)

        boxes_1000 = [
            [
                int(1000 * w["bbox"][0] / W),
                int(1000 * w["bbox"][1] / H),
                int(1000 * w["bbox"][2] / W),
                int(1000 * w["bbox"][3] / H),
            ]
            for w in words
        ]
        items.append(
            {
                "image_path": str(img_path),
                "words": [w["text"] for w in words],
                "boxes": boxes_1000,
                "labels": [label2id[t] for t in tags],
            }
        )
    return items


def get_dataset():
    train_items = page_examples("train")
    val_items = page_examples("val")
    test_items = page_examples("test")

    processor = LayoutLMv3Processor.from_pretrained(
        "microsoft/layoutlmv3-base", apply_ocr=False
    )

    def encode_batch(batch):
        images = [Image.open(p).convert("RGB") for p in batch["image_path"]]
        enc = processor(
            images=images,
            text=batch["words"],
            boxes=batch["boxes"],
            word_labels=batch["labels"],
            truncation=True,
            padding="max_length",
            max_length=512,
            return_tensors="pt",
        )
        return {k: v.numpy() for k, v in enc.items()}

    ds = DatasetDict(
        {
            "train": Dataset.from_list(train_items),
            "validation": Dataset.from_list(val_items),
            "test": Dataset.from_list(test_items),
        }
    )
    encoded = ds.map(
        encode_batch, batched=True, remove_columns=ds["train"].column_names
    )
    return encoded, id2label, label2id, BIO_LABELS
