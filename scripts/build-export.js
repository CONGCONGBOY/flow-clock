const fs = require('fs')
const path = require('path')

process.env.EXPORT = 'true'
require('child_process').execSync('next build', { stdio: 'inherit', shell: true })

// GitHub Pages ignores _next/ without .nojekyll
fs.writeFileSync(path.join(__dirname, '..', 'out', '.nojekyll'), '')
console.log('✓ .nojekyll added to out/')
