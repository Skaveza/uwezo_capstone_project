def predict_fields(img_path: Path, ocr_json: Path):
    data = json.loads(ocr_json.read_text())
    W,H = data["width"], data["height"]
    words = [w for w in data["words"] if (w.get("text","").strip())]
    boxes = [[int(1000*w["bbox"][0]/W), int(1000*w["bbox"][1]/H),
              int(1000*w["bbox"][2]/W), int(1000*w["bbox"][3]/H)] for w in words]

    enc = processor(
        images=Image.open(img_path).convert("RGB"),
        text=[w["text"] for w in words],
        boxes=boxes,
        return_tensors="pt",
        truncation=True, padding="max_length", max_length=512
    )
    with torch.no_grad():
        logits = model(**{k:v for k,v in enc.items() if k in ["input_ids","bbox","attention_mask","pixel_values"]}).logits
    pred = logits.argmax(-1)[0].tolist()
    mask = enc["attention_mask"][0].tolist()

    fields = {c:[] for c in CLASSES}
    cur_field = None
    for t, wtxt, m in zip(pred, [w["text"] for w in words], mask):
        if not m: continue
        tag = id2label.get(t, "O")
        if tag.startswith("B-"):
            cur_field = tag[2:]
            fields[cur_field].append(wtxt)
        elif tag.startswith("I-") and cur_field == tag[2:]:
            fields[cur_field].append(wtxt)
        else:
            cur_field = None
    return {k: " ".join(v).strip() for k,v in fields.items()}

# example
ex_img = (PROC_IMG/"val").rglob("*.jpg").__next__()
ex_json = PROC_OCR/"val"/(ex_img.stem + ".json")
print(predict_fields(ex_img, ex_json))
