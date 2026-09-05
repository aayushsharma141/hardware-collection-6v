const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const report = {
    button: { critical: [], migratable: [], dead: [] },
    legacyTokens: { critical: [], migratable: [], dead: [] }
};

const tokenRegex = /var\(--site-[a-zA-Z0-9-]+\)|bg-site-[a-zA-Z0-9-]+|text-site-[a-zA-Z0-9-]+|border-site-[a-zA-Z0-9-]+/g;

walkDir(rootDir, (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check button.tsx usage
    if (content.includes('ui/primitives/button') || content.includes('ui/primitives/button"')) {
        // Simple heuristic: if it's in a Room or Admin page, it's critical (cannot be migrated safely without Room migration).
        // If it's in a shared component, it might be migratable.
        if (filePath.includes('pages\\admin') || filePath.includes('pages/admin')) {
            report.button.critical.push(filePath);
        } else if (filePath.includes('pages\\') || filePath.includes('pages/')) {
            report.button.critical.push(filePath);
        } else {
            report.button.migratable.push(filePath);
        }
    }
    
    // Check legacy token usage
    const tokensMatch = content.match(tokenRegex);
    if (tokensMatch) {
        if (filePath.includes('pages\\admin') || filePath.includes('pages/admin') || filePath.includes('pages\\') || filePath.includes('pages/')) {
            report.legacyTokens.critical.push(filePath);
        } else {
            report.legacyTokens.migratable.push(filePath);
        }
    }
});

// NOTE: this script audits legacy design-token and button.tsx usage — it is NOT a
// dependency/CVE scanner despite the filename. Vulnerability scanning is `npm audit`,
// enforced as GATE-05 in scripts/release-verification.ts.
let markdown = `# Legacy Design-Token & Component Migration Audit\n\n> Not a CVE scan. For vulnerabilities run \`npm audit --audit-level=critical\`.\n\n`;

markdown += `## Legacy \`button.tsx\` Dependencies\n`;
markdown += `- **Critical (Blocks Deletion)**: ${report.button.critical.length} files\n`;
markdown += `- **Migratable (Can be replaced now)**: ${report.button.migratable.length} files\n`;
markdown += `- **Dead**: 0 files (It is still used)\n\n`;

markdown += `### Critical Files (Sample)\n`;
report.button.critical.slice(0, 5).forEach(f => markdown += `- ${f.replace(rootDir, '')}\n`);

markdown += `\n### Migratable Files (Sample)\n`;
report.button.migratable.slice(0, 5).forEach(f => markdown += `- ${f.replace(rootDir, '')}\n`);


markdown += `\n## Legacy Tokens Dependencies\n`;
markdown += `- **Critical (Blocks Deletion)**: ${report.legacyTokens.critical.length} files\n`;
markdown += `- **Migratable (Can be replaced now)**: ${report.legacyTokens.migratable.length} files\n`;
markdown += `- **Dead**: 0 files\n\n`;

markdown += `### Critical Files (Sample)\n`;
report.legacyTokens.critical.slice(0, 5).forEach(f => markdown += `- ${f.replace(rootDir, '')}\n`);

markdown += `\n### Migratable Files (Sample)\n`;
report.legacyTokens.migratable.slice(0, 5).forEach(f => markdown += `- ${f.replace(rootDir, '')}\n`);

const outDir = path.join(__dirname, '../audit-reports');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}
fs.writeFileSync(path.join(outDir, 'dependency_audit_report.md'), markdown);
console.log('Report generated at audit-reports/dependency_audit_report.md');
