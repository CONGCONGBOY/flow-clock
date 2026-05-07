// Preload: patch os.hostname() to return ASCII-only for Vercel CLI
const os = require('os');
const orig = os.hostname;
os.hostname = function () {
  const name = orig.call(os);
  return /[^\x00-\x7F]/.test(name) ? 'flow-clock-pc' : name;
};
