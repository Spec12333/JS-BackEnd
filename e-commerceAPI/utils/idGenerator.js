const crypto = require('node:crypto');

function generateNumberId() {
  return crypto.randomUUID()
}

module.exports = generateNumberId;