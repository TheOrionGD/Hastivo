const fs = require('fs');
const path = 's:/Projects/Hastivo/client/src/components/ui/smoothui';
const dirs = fs.readdirSync(path).filter(f => fs.statSync(path + '/' + f).isDirectory());
console.log('Total smoothui component folders now:', dirs.length);

const toPascal = str => str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');

let fileContent = '// Central export and registry of all ' + dirs.length + '+ Smooth UI components for Hastivo screens\n';
fileContent += 'import React from "react";\n\n';

const exportsList = [];
dirs.sort().forEach((dir) => {
  const compName = toPascal(dir);
  fileContent += 'export { default as ' + compName + ' } from "./' + dir + '";\n';
  exportsList.push(compName);
});

fileContent += '\nexport const SmoothUIComponents = {\n  ' + exportsList.join(',\n  ') + '\n};\n';
fileContent += 'export default SmoothUIComponents;\n';

fs.writeFileSync(path + '/index.ts', fileContent, 'utf8');
console.log('Successfully regenerated smoothui/index.ts with ' + exportsList.length + ' named exports!');

