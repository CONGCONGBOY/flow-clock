process.env.EXPORT = 'true'
require('child_process').execSync('next build', { stdio: 'inherit', shell: true })
