import fs from 'fs';
const targetPath = 's:/Projects/Hastivo/client/src/components/ui/smoothui';
const dirs = fs.readdirSync(targetPath).filter(f => {
  if (f === 'lib') return false;
  return fs.statSync(targetPath + '/' + f).isDirectory();
});

const toPascal = str => str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');

let fileContent = '// Central export and registry of all ' + dirs.length + '+ Smooth UI components for Hastivo screens\n';
fileContent += 'import React from "react";\n\n';

const exportsList = [];
dirs.sort().forEach((dir) => {
  const compName = toPascal(dir);
  fileContent += 'export { default as ' + compName + ' } from "./' + dir + '";\n';
  exportsList.push(compName);

  // Add alias if contains 'Ai' -> 'AI', or '3d' -> '3D'
  if (compName.startsWith('Ai')) {
    const aiCompName = 'AI' + compName.slice(2);
    fileContent += 'export { default as ' + aiCompName + ' } from "./' + dir + '";\n';
    exportsList.push(aiCompName);
  }
  if (compName.includes('3d')) {
    const threeDName = compName.replace('3d', '3D');
    fileContent += 'export { default as ' + threeDName + ' } from "./' + dir + '";\n';
    exportsList.push(threeDName);
  }
});

fileContent += '\nexport const SmoothUIComponents = {\n  ' + exportsList.join(',\n  ') + '\n};\n';
fileContent += 'export default SmoothUIComponents;\n';

fs.writeFileSync(targetPath + '/index.ts', fileContent, 'utf8');
console.log('Successfully regenerated smoothui/index.ts with aliases! Total exports:', exportsList.length);
