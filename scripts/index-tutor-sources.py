"""Build a private, page-cited search index. Never put this corpus in public/."""
import json, re, hashlib
from pathlib import Path
from collections import Counter
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
sources = [
    ('textbook', 'Algebra and Trigonometry, 4th edition', Path('/Users/joshuachang/Desktop/Copy of Algebra and Trigonometry, 4th Edition (James Stewart, Lothar Redlin, Saleem Watson) (z-lib.org) (1).pdf'), None),
    ('math-notes', 'Chapter 2 class notes', Path('/Users/joshuachang/Downloads/Chapter 2 All Notes (1).pdf'), None),
    ('chem-unit3', 'AP Chemistry Unit 3 packet', Path('/Users/joshuachang/Downloads/AP Chemistry Packets Fall 2026.pdf'), range(47, 69)),
    ('chem-packet', 'AP Chemistry Packets Fall 2026 (full packet)', Path('/Users/joshuachang/Downloads/AP Chemistry Packets Fall 2026.pdf'), [i for i in range(152) if i not in range(47, 69)]),
]
stop = set('the a an and or of to in is are for on with as at by be it this that from if find use what how when then can does has have not you your'.split())
pages, manifest, postings = [], [], {}
for ident, title, path, selected in sources:
    reader = PdfReader(path)
    selected = list(selected if selected is not None else range(len(reader.pages)))
    empty = []
    for n in selected:
        text = reader.pages[n].extract_text() or ''
        text = re.sub(r'/f_([a-z]+)', r'\1', text)
        text = text.translate(str.maketrans({'':'=', '':'+', '':'−', '':'≤', '':'≥', '':'>', '':'<'}))
        text = re.sub(r'[ \t]+', ' ', text).strip()
        if len(text) < 30:
            empty.append(n + 1)
            continue
        # Overlap preserves formulas crossing chunk boundaries; citation is always PDF page.
        for start in range(0, len(text), 3200):
            chunk = text[max(0, start - 200):start + 3400]
            idx = len(pages)
            pages.append({'source': ident, 'title': title, 'pdfPage': n + 1, 'text': chunk})
            for word, count in Counter(re.findall(r'[a-z0-9]{2,}', chunk.lower())).items():
                if word not in stop:
                    postings.setdefault(word, []).append([idx, min(count, 8)])
    manifest.append({'id': ident, 'title': title, 'pdfPages': len(reader.pages), 'indexedPages': selected, 'emptyPages': empty, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
    print(title, len(selected), 'pages scanned;', len(empty), 'pages without useful text', flush=True)
out = ROOT / 'db' / 'tutor-corpus.json'
out.write_text(json.dumps({'version': 'sources-v2-full-chem', 'manifest': manifest, 'pages': pages, 'postings': postings}, ensure_ascii=False, separators=(',', ':')))
print('Private index:', len(pages), 'chunks;', out.stat().st_size, 'bytes')
