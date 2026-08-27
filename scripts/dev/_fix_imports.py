import pathlib
import re
import sys

ROOT = pathlib.Path(r"E:\Hardware-Collection\src")
APPLY = "--apply" in sys.argv
STMT = re.compile(r'import\s+(?:type\s+)?\{[^}]*\}\s+from\s+["\']lucide-react["\']\s*;?', re.DOTALL)

def repl(content, nl):
    def _r(m):
        stmt = m.group(0)
        brace = re.search(r'\{(.*)\}', stmt, re.DOTALL)
        if not brace:
            return stmt
        names = [n.strip() for n in brace.group(1).split(',') if n.strip()]
        names = [n for n in names if re.fullmatch(r'[A-Za-z_$][\w$]*', n)]
        rest = content.replace(stmt, '')
        used = []
        for n in names:
            if re.search(r'(?<![A-Za-z0-9_$])' + re.escape(n) + r'(?![A-Za-z0-9_$])', rest):
                used.append(n)
        if len(used) == len(names):
            return stmt
        if not used:
            return ''
        if '\n' in stmt:
            im = re.search(r'\r?\n([ \t]+)', stmt)
            ind = im.group(1) if im else '  '
            return 'import {' + ''.join(nl + ind + n + ',' for n in used) + nl + '} from "lucide-react";'
        return 'import { ' + ', '.join(used) + ' } from "lucide-react";'
    return STMT.sub(_r, content)

for p in sorted(ROOT.rglob('*.tsx')):
    raw = p.read_bytes()
    bom = raw.startswith(b'\xef\xbb\xbf')
    content = raw.decode('utf-8-sig')
    if 'lucide-react' not in content:
        continue
    nl = '\r\n' if '\r\n' in content else '\n'
    new_content = repl(content, nl)
    print('=' * 70)
    print(p)
    print('  NOW :')
    for s in STMT.findall(content):
        print('       ' + s.replace('\r\n', '\n').replace('\n', '\n       '))
    if new_content != content:
        print('  THEN:')
        for s in STMT.findall(new_content):
            print('       ' + s.replace('\r\n', '\n').replace('\n', '\n       '))
        if APPLY:
            p.write_bytes((b'\xef\xbb\xbf' if bom else b'') + new_content.encode('utf-8'))
            print('  -> WRITTEN')
    else:
        print('  (no change)')

print('=' * 70)
print('ALL TSX FILES:')
for p in sorted(ROOT.rglob('*.tsx')):
    print(' ', p)
