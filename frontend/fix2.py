with open('src/services/reports.service.ts', 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(r'callback\(reports\);\s*\}\);', 'callback(reports);\n      }, onError);', code)

with open('src/services/reports.service.ts', 'w', encoding='utf-8') as f:
    f.write(code)