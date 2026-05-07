/**
 * Vercel deploy wrapper — monkey-patches os.userInfo to avoid
 * Chinese-character username issues in HTTP headers on Windows.
 */
const Module = require('module');
const origRequire = Module.prototype.require;

// Patch os module before anything loads
Module.prototype.require = function (id) {
  const mod = origRequire.call(this, id);
  if (id === 'os') {
    const origUserInfo = mod.userInfo;
    mod.userInfo = function (options) {
      const info = origUserInfo.call(mod, options);
      if (info && typeof info.username === 'string' && /[^\x00-\x7F]/.test(info.username)) {
        info.username = 'vercel-deploy';
      }
      return info;
    };
  }
  return mod;
};

// Now run vercel
const { execSync } = require('child_process');
const args = process.argv.slice(2);
const cmd = `npx --yes vercel ${args.join(' ')}`;

try {
  execSync(cmd, { stdio: 'inherit', shell: true });
} catch (e) {
  process.exit(e.status || 1);
}
