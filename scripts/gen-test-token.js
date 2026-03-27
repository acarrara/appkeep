/**
 * Generates a long-lived JWT for e2e testing.
 * Run once, then store the output in .env as E2E_TEST_JWT and in CI as an encrypted secret.
 *
 * Usage: node scripts/gen-test-token.js
 *
 * Requires the test user email to exist in MongoDB (whitelist it there first).
 */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const privateKey = process.env.APPKEEP_PRIVATE_KEY;
if (!privateKey) {
  console.error('APPKEEP_PRIVATE_KEY is not set in .env');
  process.exit(1);
}

const token = jwt.sign(
  {
    sub: 'e2e-test-user',
    email: 'e2e@appkeep.test',
    exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) // 10 years
  },
  privateKey.replace(/\\n/g, '\n'),
  {algorithm: 'RS256'}
);

console.log(token);
