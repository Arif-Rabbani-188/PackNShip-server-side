// config/firebase.js
// Initializes Firebase Admin SDK using base64 encoded service key from env.
const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps.length) return admin;
  const b64 = process.env.FB_SERVICE_KEY;
  if (!b64) {
    console.warn('FB_SERVICE_KEY not set. Firebase auth verification will fail.');
    return admin;
  }
  try {
    const decoded = Buffer.from(b64, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decoded);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase initialized');
  } catch (e) {
    console.error('Failed to init Firebase', e);
  }
  return admin;
}

module.exports = initFirebase();
