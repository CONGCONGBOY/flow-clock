// Preload: patch os.userInfo to return ASCII-only username
const os = require('os');
const orig = os.userInfo;
os.userInfo = function (options) {
  const info = orig.call(os, options);
  if (info && typeof info.username === 'string' && /[^\x00-\x7F]/.test(info.username)) {
    info.username = info.username.replace(/[^\x00-\x7F]/g, '') || 'vercel-deploy';
  }
  return info;
};
