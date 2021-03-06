module.exports = {
    hooks: {
        'before:init': ['npm run lint', 'npm run format'],
        'after:bump': 'npm run build',
        'after:git:release': 'npm run pack',
        'after:release':
            'echo Successfully released ${name} v${version} to ${repo.repository}.',
    },
    git: {
        commitMessage: 'chore: release v${version}',
    },
    npm: {
        publish: false,
    },
    github: {
        release: true,
        releaseName: '${version}',
        assets: ['pack/*.zip'],
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
