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

function microCommitLocal(branch, file, content, msg) {
    run(`git checkout -b ${branch}`);
    fs.appendFileSync(path.join(repoPath, file), content + '\n');
    run(`git add ${file}`);
    run(`git commit -m "${msg}"`);
    run(`git checkout main`);
    run(`git merge ${branch}`);
    run(`git branch -d ${branch}`);
}

const steps = [
    // Trade Manager Errs & Vars
    { file: 'contracts/trade-manager.clar', content: '(define-constant ERR-NOT-AUTHORIZED (err u100))', msg: 'feat: add ERR-NOT-AUTHORIZED to trade-manager' },
    { file: 'contracts/trade-manager.clar', content: '(define-data-var cargo-id-counter uint u0)', msg: 'feat: add cargo-id-counter variable' },
    // Cargo Map
    { file: 'contracts/trade-manager.clar', content: '\n(define-map cargo\n  { cargo-id: uint }\n  {\n    sender: principal,\n    vessel-id: uint,\n    description: (string-ascii 100),\n    status: (string-ascii 20)\n  }\n)', msg: 'feat: define cargo data map' },
    // book-cargo function
    { file: 'contracts/trade-manager.clar', content: '\n(define-public (book-cargo (vessel-id uint) (description (string-ascii 100)))', msg: 'feat: add book-cargo signature' },
    { file: 'contracts/trade-manager.clar', content: '  (let ((cargo-id (+ (var-get cargo-id-counter) u1)))', msg: 'feat: implement cargo-id increment' },
    { file: 'contracts/trade-manager.clar', content: '    (map-set cargo { cargo-id: cargo-id } { sender: tx-sender, vessel-id: vessel-id, description: description, status: "pending" })', msg: 'feat: add map-set to book-cargo' },
    { file: 'contracts/trade-manager.clar', content: '    (var-set cargo-id-counter cargo-id)', msg: 'feat: update cargo-id-counter' },
    { file: 'contracts/trade-manager.clar', content: '    (ok cargo-id)\n  )\n)', msg: 'feat: close book-cargo function' },
    // Getter
    { file: 'contracts/trade-manager.clar', content: '\n(define-read-only (get-cargo (cargo-id uint))', msg: 'feat: add get-cargo read-only function' },
    { file: 'contracts/trade-manager.clar', content: '  (map-get? cargo { cargo-id: cargo-id })\n)', msg: 'feat: implement get-cargo body' }
];

steps.forEach((s, i) => {
    const fullPath = path.join(repoPath, s.file);
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '');
    }
    const branchName = `feat/trade-step-${Date.now()}-${i}`;
    microCommitLocal(branchName, s.file, s.content, s.msg);
});

console.log('Pushing changes...');
run('git push origin main');
