import os, re, glob
files = sorted(glob.glob("**/*.mdx", recursive=True))
files = [f for f in files if "node_modules" not in f]
for f in files:
    with open(f) as fp:
        text = fp.read()
    text = re.sub(r'^---\n.*?\n---\n', '', text, count=1, flags=re.DOTALL)
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    text = re.sub(r'`[^`]*`', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    for i, line in enumerate(text.split('\n'), 1):
        l = line.strip()
        if not l or l.startswith('#'):
            continue
        l = re.sub(r'^[-*]\s+', '', l)
        l = re.sub(r'^\d+\.\s+', '', l)
        sentences = re.split(r'(?<=[.!?])\s+', l)
        for s in sentences:
            words = re.findall(r"\b[\w']+\b", s)
            if len(words) > 30:
                print(f"{f}:{i}: ({len(words)} words) {s[:220]}")
