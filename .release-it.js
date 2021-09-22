module.exports = {
    hooks: {
        'before:init': ['npm run lint', 'npm run format'],
    },
    git: {
        commitMessage: 'chore: release v${version}',
    },
    npm: {
        publish: false,
    },
    plugins: {
        '@release-it/conventional-changelog': {
            infile: 'CHANGELOG.md',
            preset: {
                name: 'conventionalcommits',
                types: [
                    {
                        type: 'feat',
                        section: '✨ Features',
                    },
                    {
                        type: 'fix',
                        section: '🐛 Bug Fixes',
                    },
                ],
            },
        },
    },
}
