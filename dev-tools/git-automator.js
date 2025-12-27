const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Git Automator for Stacks Maritime Trading
 * High-frequency micro-commit and PR automation tool.
 */

function run(command) {
    try {
        console.log(`Running: ${command}`);
        return execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    } catch (error) {
        console.error(`Error running command: ${command}`);
        // console.error(error.message);
        return null;
    }
}

function microTask({ branchName, commitMessage, prTitle, prBody, action }) {
    console.log(`\n--- Starting Micro Task: ${branchName} ---`);
    
    // Ensure we are on main and up to date
    run('git checkout main');
    run('git pull origin main');

    // Create and switch to new branch
    run(`git checkout -b ${branchName}`);

    // Perform the action (code changes)
    action();

    // Commit
    run('git add .');
    run(`git commit -m "${commitMessage}"`);

    // Push branch
    run(`git push origin ${branchName}`);

    // Create PR using gh CLI
    // --fill uses the commit message as title/body if not provided
    const prCmd = `gh pr create --title "${prTitle}" --body "${prBody}" --head ${branchName} --base main`;
    run(prCmd);

    // Merge PR
    // --merge deletes the branch after merge usually, but let's be explicit
    run(`gh pr merge --merge --auto`);
    
    // Sometimes auto-merge takes a second or needs manual trigger if not configured for auto-merge on repo
    // Let's just merge it immediately if possible
    run(`gh pr merge --merge --delete-branch`);

    // Back to main
    run('git checkout main');
    run('git pull origin main');
    
    console.log(`--- Completed Micro Task: ${branchName} ---\n`);
}

module.exports = { microTask, run };
