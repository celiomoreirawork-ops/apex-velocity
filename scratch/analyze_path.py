
import re

content = open('c:/Users/celio/.gemini/antigravity/scratch/apex-velocity/src/components/layout/Sidebar.jsx', 'r').read()
match = re.search(r'<path d="(M164\.718.*?)"', content)
if match:
    path_data = match.group(1)
    # Paths usually start with M
    segments = re.findall(r'M[^M]+', path_data)
    starts = {}
    for i, seg in enumerate(segments):
        start = re.match(r'M([0-9\.]+)\s+([0-9\.]+)', seg)
        if start:
            coords = (float(start.group(1)), float(start.group(2)))
            if coords in starts:
                print(f"DUPLICATE FOUND! Segment {i} starts at {coords}, same as Segment {starts[coords]}")
            starts[coords] = i
        print(f"Segment {i} starts at {start.groups() if start else '?'}: {seg[:40]}...")
else:
    print("Path not found")
