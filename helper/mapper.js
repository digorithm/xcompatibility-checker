/*
Mapper is a tool to help the tool developers to generate a more specific database
based on the original data.json from caniuse.

Usage:
- Go to your terminal, move to the root folder, run `node helper/mapper.js`
- It will show you one caniuse main keyword at a time, this will be used to query caniuse API
- Insert a short text for this main keyword, it will be displayed to the tool user
- Insert code keywords that will be used to scan the user's code, this will be
triggers to query caniuse API
- A file called `db.json` will be written if not exists
- If it exists, it will continue from where it stopped (based in keys on db.json
with regards to keys in original data.json)
*/

const rawDb = require('../lib/data/data.json');

const fs = require('fs');

const features = rawDb.data;

const prompt = require('prompt-sync')();

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function printRelevantInformation(k, data) {
  console.log(`Keyword: ${k}\r\n`);
  console.log(`Title: ${data[k].title}\r\n`);
  console.log(`Description: ${data[k].description}\r\n`);
  console.log(`Support links: ${JSON.stringify(data[k].links)}\r\n`);
  console.log(`Spec: ${data[k].spec}\r\n`);
  console.log(`Notes: ${data[k].notes}\r\n`);
}

function getKeywordsFromUser() {
  const shortText = prompt('Enter a short descriptive text for this keyword: ');

  const keywords = prompt('Enter your keywords (separated by comma): ');
  let splittedKeywords = keywords.split(',');

  splittedKeywords = splittedKeywords.map(e => e.trim());

  const kData = { text: shortText.trim(), keywords: splittedKeywords };

  return kData;
}

function saveToDisk(data) {
  fs.writeFileSync('db.json', JSON.stringify(data));
}

function getFullySupportedBrowsers(stats) {
  const BrowserSupportList = {};

  Object.keys(stats).forEach((browser) => {
    let ys = 0;
    let notys = 0;
    let total = 0;
    Object.keys(stats[browser]).forEach((version) => {
      if (stats[browser][version] === 'y') {
        ys += 1;
      } else {
        notys += 1;
      }
      total += 1;
    });
    if (ys === total) {
      BrowserSupportList[browser] = true;
    } else {
      BrowserSupportList[browser] = false;
    }
  });
  return BrowserSupportList;
}

function startProcessing() {
  let alreadyProcessedKeys = [];

  let keywordTriggerMap = {};

  if (fs.existsSync('db.json')) {
    const db = JSON.parse(fs.readFileSync('db.json'));
    alreadyProcessedKeys = Object.keys(db);
    // if it exists, we continue the processing from where we stopped
    keywordTriggerMap = db;
  }

  // Iterating over each feature
  Object.keys(features).forEach((feature) => {
    if (!isInArray(feature, alreadyProcessedKeys)) {
      printRelevantInformation(feature, features);

      const supportedBrowsers = getFullySupportedBrowsers(features[feature].stats);

      const FromUser = getKeywordsFromUser();

      // Add fully supported browsers from a given feature
      FromUser.fully_supported_browsers = supportedBrowsers;

      keywordTriggerMap[feature] = FromUser;

      saveToDisk(keywordTriggerMap);
    }
  });
}

startProcessing();
