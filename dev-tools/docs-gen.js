const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = 'c:\\Users\\HP\\Desktop\\Blockchain\\Stacks Blockchain\\Stacks-Maritime-Trading';

function run(cmd) {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { cwd: repoPath, stdio: 'inherit' });
    } catch (e) {
        return null;
    }
}

function microCommitLocal(branch, file, content, msg) {
    run(`git checkout -b ${branch}`);
    const dir = path.dirname(path.join(repoPath, file));
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(repoPath, file), content + '\n');
    run(`git add ${file}`);
    run(`git commit -m "${msg}"`);
    run(`git checkout main`);
    run(`git merge ${branch}`);
    run(`git branch -d ${branch}`);
}

const steps = [
    { file: 'docs/vision.md', content: '# Vision\nA transparent, efficient maritime trade ecosystem.', msg: 'docs: add vision statement' },
    { file: 'docs/vision.md', content: '\n## Goals\n- Blockchain-based vessel tracking.', msg: 'docs: add blockchain tracking goal' },
    { file: 'docs/vision.md', content: '- Automated cargo escrow.', msg: 'docs: add cargo escrow goal' },
    { file: 'docs/architecture.md', content: '# Architecture\nBuilt on Stacks (Clarity 4).', msg: 'docs: initialize architecture doc' },
    { file: 'docs/architecture.md', content: '\n## Smart Contracts\n- Vessel Registry: Identity management.', msg: 'docs: describe vessel registry in architecture' },
    { file: 'docs/architecture.md', content: '- Trade Manager: Order management.', msg: 'docs: describe trade manager in architecture' },
    { file: 'docs/api/vessel-registry.md', content: '# Vessel Registry API\nMethods for vessel management.', msg: 'docs: initialize vessel registry API doc' },
    { file: 'docs/api/vessel-registry.md', content: '\n### register-vessel\nRegisters a new vessel on-chain.', msg: 'docs: add register-vessel API details' },
    { file: 'docs/api/vessel-registry.md', content: '\n### update-vessel-status\nUpdates the operational status.', msg: 'docs: add update-vessel-status API details' }
];

steps.forEach((s, i) => {
    const branchName = `docs/step-${Date.now()}-${i}`;
    microCommitLocal(branchName, s.file, s.content, s.msg);
});

run('git push origin main');
