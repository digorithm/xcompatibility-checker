# XCompatibility Checker

TODO: Write read me.

## Generating initial json database

- Go to your terminal, move to the root folder, run `node helper/mapper.js`

- It will show you one caniuse main keyword at a time, this will be used to query caniuse API in the future

- Insert a short text for this main keyword, it will be displayed to the tool user

- Insert code keywords that will be used to scan the user's code, this will be triggers to query caniuse API

- A file called `db.json` will be written if not exists

- If it exists, it will continue from where it stopped (based in keys on db.json with regards to keys in original data.json)

The final JSON structure of this data will be:

```JSON
{
  "caniuse_keyword1": {
    "text": "a short descriptive text",
    "your_keywords": ["list", "of", "keywords"]
  },
  ...
}
```