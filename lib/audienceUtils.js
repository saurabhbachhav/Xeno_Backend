// lib/audienceUtils.js
async function getAudienceSize(rules) {
  // TODO: Replace with real query logic against your user DB.
  // For now, return a random number between 100 and 1000:
  return Math.floor(100 + Math.random() * 900);
}

module.exports = { getAudienceSize };
