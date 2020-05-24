const d3 = require('d3-array');
const moment = require('moment');
const neatCsv = require('neat-csv');
const fs = require('fs').promises;

(async () => {
  try {
    const covidCSV = await fs.readFile('./data/corin_data.csv');
    const covid = await neatCsv(covidCSV);

    const lastUpdate = covid.pop().dataTime;
    console.log('last update', lastUpdate);

    const metadata = {
      lastUpdate
    };

    // write the JSON metadata file
    fs.writeFile(`./data/metadata.json`, JSON.stringify(metadata, null, 2), 'utf8', (err) => {
      if (err) return console.log(err);
      console.log('Done creating metadata file.');
    })
  } catch(e) {
    console.error('Unable to parse metadata:', e);
  }
})();
