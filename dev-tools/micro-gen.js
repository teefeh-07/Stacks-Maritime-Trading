const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoPath = 'c:\\Users\\HP\\Desktop\\Blockchain\\Stacks Blockchain\\Stacks-Maritime-Trading';

function run(cmd) {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { cwd: repoPath, stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed: ${cmd}`);
        return null;
    }
}

function microCommit(branch, file, content, msg) {
    run(`git checkout -b ${branch}`);
    fs.appendFileSync(path.join(repoPath, file), content + '\n');
    run(`git add ${file}`);
    run(`git commit -m "${msg}"`);
    run(`git push origin ${branch}`);
    run(`git checkout main`);
    run(`git merge ${branch}`);
    run(`git push origin main`);
    run(`git branch -d ${branch}`);
}

// Example usage to add register-vessel function
const steps = [
    {
        branch: 'feat/vessel-reg-sig',
        file: 'contracts/vessel-registry.clar',
        content: '(define-public (register-vessel (vessel-id uint) (name (string-ascii 64)) (capacity uint))',
        msg: 'feat: add register-vessel function signature'
    },
    {
        branch: 'feat/vessel-reg-begin',
        file: 'contracts/vessel-registry.clar',
        content: '  (begin',
        msg: 'feat: add begin block to register-vessel'
    },
    {
        branch: 'feat/vessel-reg-check',
        file: 'contracts/vessel-registry.clar',
        content: '    (asserts! (is-none (map-get? vessels { vessel-id: vessel-id })) ERR-VESSEL-ALREADY-EXISTS)',
        msg: 'feat: add existence check to register-vessel'
    },
    {
        branch: 'feat/vessel-reg-set',
        file: 'contracts/vessel-registry.clar',
        content: '    (ok (map-set vessels { vessel-id: vessel-id } { owner: tx-sender, name: name, capacity: capacity, status: "active" }))',
        msg: 'feat: add map-set to register-vessel'
    },
    {
        branch: 'feat/vessel-reg-close',
        file: 'contracts/vessel-registry.clar',
        content: '  )\n)',
        msg: 'feat: close register-vessel function'
    }
];

steps.forEach(s => {
    microCommit(s.branch, s.file, s.content, s.msg);
});
