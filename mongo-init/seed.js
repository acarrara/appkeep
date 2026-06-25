// Runs automatically when the MongoDB container starts for the first time.
// Seeds the e2e test user so the app's whitelist check passes.
db = db.getSiblingDB('appkeep-e2e');
db.users.insertOne({
  email: 'e2e@appkeep.test',
  name: 'E2E Test User'
});