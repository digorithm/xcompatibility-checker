let processedDB = require('../db.json');

const fs = require('fs');

const prompt = require('prompt-sync')();

function getKeywordsFromUser() {
  const keywords = prompt('Enter your keywords (separated by comma): ');

  let splittedKeywords = keywords.split(',');

  splittedKeywords = splittedKeywords.map(e => e.trim());

  return splittedKeywords;
}

function saveToDisk(data) {
  fs.writeFileSync('../db.json', JSON.stringify(data));
}

function continueMapping() {
  Object.keys(processedDB).forEach((keyword) => {
    if (processedDB[keyword].keywords.length === 1) {
      console.log("Keyword to be mapped: " + keyword);
      const inputKeywords = getKeywordsFromUser();
      processedDB[keyword].keywords = inputKeywords;
      saveToDisk(processedDB);
    }
});
}

continueMapping();