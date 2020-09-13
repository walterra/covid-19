const neatCsv = require('neat-csv');
const fs = require('fs').promises;

(async () => {
  try {
    const covidCSV = await fs.readFile('./data/corin_data.csv');
    const covid = await neatCsv(covidCSV);

    let lastUpdate = covid.pop().dataTime;
    console.log('last update', lastUpdate);

    if (lastUpdate.search('8:00')) {
      console.log('↥ last update was just this morning, skip it')
      lastUpdate = covid.pop().dataTime;
      console.log('last update', lastUpdate);
    }

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
