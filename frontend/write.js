const fs = require('fs');
let code = fs.readFileSync('src/pages/citizen/PotholeMap.tsx', 'utf8');

code = code.replace(
  /const html =\s+<div style="background-color: \+ color \+ ; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb\(0 0 0 \/ 0\.1\); display: flex; align-items: center; justify-content: center; transform: scale\( \+ \(isSelected \? '1\.25' : '1'\) \+ \); transition: transform 0\.2s;">\s+<\/div>/,
  "const html = '<div style=\"background-color: ' + color + '; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); transform: scale(' + (isSelected ? \\\"1.25\\\" : \\\"1\\\") + '); transition: transform 0.2s;\"></div>'"
);
fs.writeFileSync('src/pages/citizen/PotholeMap.tsx', code);