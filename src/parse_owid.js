const d3 = require('d3-array');
const moment = require('moment');
const neatCsv = require('neat-csv');
const fs = require('fs').promises;

(async () => {
  try {
    // Google Mobility
    const mobilityCSV = await fs.readFile('./data/Global_Mobility_Report_2020-04-23.csv');
    const mobility = await neatCsv(mobilityCSV);

    const groupedMobility = d3.groups(mobility, d => d.country_region);

    // https://ourworldindata.org/air-pollution


    // https://ourworldindata.org/most-densely-populated-countries
    const densityCSV = await fs.readFile('./data/owid-population-density.csv');
    const density = await neatCsv(densityCSV);
    const groupedDensity = d3.groups(density, d => d.Entity, d => d.Year)

    const densityMax = {};

    groupedDensity.forEach(l => {
      const location = l[0];
      const maxYear = l[1].reduce((prev, curr) => {
        const year = parseInt(curr[1][0]['Year']);
        return Math.max(prev, year);
      }, 0);
      const maxExp = l[1].find(d => {
        return parseInt(d[1][0]['Year']) === maxYear;
      });
      densityMax[location] = Math.round(parseFloat(maxExp[1][0]['Population density (people per sq. km of land area) (people per km² of land area)']));
    });

    // https://ourworldindata.org/world-population-growth#all-charts-preview
    const ageCSV = await fs.readFile('./data/owid-size-of-young-working-elderly-populations.csv');
    const age = await neatCsv(ageCSV);
    const groupedAge = d3.groups(age, d => d.Entity, d => d.Year)

    const youngMax = {};
    const workingMax = {};
    const elderlyMax = {};

    groupedAge.forEach(l => {
      const location = l[0];
      const maxYear = l[1].reduce((prev, curr) => {
        const year = parseInt(curr[1][0]['Year']);
        return Math.max(prev, year);
      }, 0);
      const maxExp = l[1].find(d => {
        return parseInt(d[1][0]['Year']) === maxYear;
      });
      youngMax[location] = Math.round(parseFloat(maxExp[1][0]['Young (<15 years)']));
      workingMax[location] = Math.round(parseFloat(maxExp[1][0]['Working age (15-64 years)']));
      elderlyMax[location] = Math.round(parseFloat(maxExp[1][0]['Elderly (65+ years)']));
    });

    // https://ourworldindata.org/world-population-growth#all-charts-preview
    const popCSV = await fs.readFile('./data/owid-population.csv');
    const population = await neatCsv(popCSV);
    const groupedPop = d3.groups(population, d => d.Entity, d => d.Year)

    const popMax = {};

    groupedPop.forEach(l => {
      const location = l[0];
      const maxYear = l[1].reduce((prev, curr) => {
        const year = parseInt(curr[1][0]['Year']);
        return Math.max(prev, year);
      }, 0);
      const maxExp = l[1].find(d => {
        return parseInt(d[1][0]['Year']) === maxYear;
      });
      popMax[location] = Math.round(parseFloat(maxExp[1][0]['Population']));
    });

    // https://ourworldindata.org/health-meta#life-expectancy
    const lifeCSV = await fs.readFile('./data/owid-life-expectancy.csv');
    const life = await neatCsv(lifeCSV);
    const groupedLife = d3.groups(life, d => d.Entity, d => d.Year)

    const lifeExp = {};

    groupedLife.forEach(l => {
      const location = l[0];
      const maxYear = l[1].reduce((prev, curr) => {
        // console.log(curr[1][0]['Life expectancy (years)']);
        const year = parseInt(curr[1][0]['Year']);
        return Math.max(prev, year);
      }, 0);
      const maxExp = l[1].find(d => {
        // console.log(d[1][0]['Year'], maxYear)
        return parseInt(d[1][0]['Year']) === maxYear;
      });
      // console.log(maxYear, parseFloat(maxExp[1][0]['Life expectancy (years)']));
      lifeExp[location] = Math.round(parseFloat(maxExp[1][0]['Life expectancy (years)']));
    });

    // https://ourworldindata.org/health-meta#burden-of-disease
    const dalysCSV = await fs.readFile('./data/owid-dalys-rate-from-all-causes.csv');
    const dalys = await neatCsv(dalysCSV);
    const groupedDalys = d3.groups(dalys, d => d.Entity, d => d.Year)

    const dalysMax = {};

    groupedDalys.forEach(l => {
      const location = l[0];
      const maxYear = l[1].reduce((prev, curr) => {
        // console.log(curr[1][0]['Life expectancy (years)']);
        const year = parseInt(curr[1][0]['Year']);
        return Math.max(prev, year);
      }, 0);
      const maxExp = l[1].find(d => {
        // console.log(d[1][0]['Year'], maxYear)
        return parseInt(d[1][0]['Year']) === maxYear;
      });
      // console.log(maxYear, parseFloat(maxExp[1][0]['Life expectancy (years)']));
      dalysMax[location] = Math.round(parseFloat(maxExp[1][0]['DALYs (Disability-Adjusted Life Years) - All causes - Sex: Both - Age: Age-standardized (Rate) (DALYs per 100,000)']));
    });

    const data = await fs.readFile('./data/owid-covid-data.csv');
    const csv = (await neatCsv(data)).filter(r => r.location !== 'World');
    // console.log(csv[0]);

    const cases = csv.map(({ location, date, total_cases }) => ({ location, date, total_cases: total_cases }));
    // console.log(cases[0]);
    const grouped = d3.groups(cases, d => d.location, d => d.date);

    const locationMeta = {};
    grouped.map(g => {
      const location = g[0];

      const datesO = {};

      const inner = g[1];

      inner.forEach(i => {
        // console.log(i)
        const date = i[0];
        const datum = i[1][0];
        datesO[date] = datum.total_cases;
      });

      const datesA = Object.keys(datesO).sort();

      const dateFirst = datesA.find(function(el) {
        return datesO[el] > 0;
      });
      const dateTenth = datesA.find(function(el) {
        return datesO[el] >= 10;
      });
      const dateHundreth = datesA.find(function(el) {
        return datesO[el] >= 100;
      });

      // console.log(location, dateFirst, dateTenth, dateHundreth);
      locationMeta[location] = {
        dateFirst,
        dateTenth,
        dateHundreth
      }
    });

    // moment
    const output = [[
      'date',
      'location',
      'total_cases',
      'days_since_first',
      'days_since_tenth',
      'days_since_hundreth',
      'life_expectancy',
      'dalys',
      'population',
      'age_young',
      'age_working',
      'age_eldery',
      'mobility',
      'population_density',
    ].join(',')];
    output.push(
      ...cases.map(c => {
        const { location, date, total_cases } = c;
        const { dateFirst, dateTenth, dateHundreth } = locationMeta[location];
        const m_date = moment(date);

        const m_dateFirst = moment(dateFirst);
        const m_dateTenth = moment(dateTenth);
        const m_dateHundreth = moment(dateHundreth);

        if (m_dateHundreth === undefined) {
          return ['SKIP'];
        }

        const days_since_first = dateFirst !== undefined ? m_date.diff(m_dateFirst, 'days') : 0;
        const days_since_tenth = dateTenth !== undefined ? m_date.diff(m_dateTenth, 'days') : 0;
        const days_since_hundreth = dateHundreth !== undefined ? m_date.diff(m_dateHundreth, 'days') : 0;

        // console.log(location,date,dateFirst,dateTenth,dateHundreth);
        // console.log(location,date,total_cases,days_since_first,days_since_tenth,days_since_hundreth);
        if (
          isNaN(lifeExp[location]) ||
          isNaN(dalysMax[location]) ||
          isNaN(popMax[location]) ||
          isNaN(youngMax[location]) ||
          isNaN(workingMax[location]) ||
          isNaN(elderlyMax[location]) ||
          isNaN(densityMax[location])
        ) {
          return ['SKIP'];
        }

        let mobility;
        const dateSplit = date.split('-');
        const currentDate = new Date(dateSplit[0], dateSplit[1], dateSplit[2]);

        // mobility
        const mobilityByLocation = groupedMobility.find(m => m[0] === location);
        if (Array.isArray(mobilityByLocation) && mobilityByLocation.length === 2) {
          const dates = mobilityByLocation[1].map(d => d.date);

          if (dates.includes(date)) {
            const mob = mobilityByLocation[1].find(d => d.date === date);
            mobility = mob.retail_and_recreation_percent_change_from_baseline;
          } else {

            const beforedates = dates.filter(function(d) {
              const s = d.split('-');
              const c = new Date(s[0], s[1], s[2]);
              return c - currentDate < 0;
            });

            const afterdates = dates.filter(function(d) {
              const s = d.split('-');
              const c = new Date(s[0], s[1], s[2]);
              return c - currentDate > 0;
            });

            if (beforedates.length > 0) {
              const searchDate = beforedates.pop();
              const mob = mobilityByLocation[1].find(d => d.date === searchDate);
              mobility = mob.retail_and_recreation_percent_change_from_baseline;
            } else if (afterdates.length > 0) {
              const searchDate = afterdates.shift();
              const mob = mobilityByLocation[1].find(d => d.date === searchDate);
              mobility = mob.retail_and_recreation_percent_change_from_baseline;
            } else {
              console.log('IMPOSSIBLE');
            }

          }
        }

        if (mobility === undefined) {
          return ['SKIP'];
        }

        return [
          date,
          location,
          total_cases,
          days_since_first >= 0 ? days_since_first : 0,
          days_since_tenth >= 0 ? days_since_tenth : 0,
          days_since_hundreth >= 0 ? days_since_hundreth : 0,
          lifeExp[location],
          dalysMax[location],
          popMax[location],
          youngMax[location],
          workingMax[location],
          elderlyMax[location],
          mobility,
          densityMax[location],
        ].join(',');
      }).filter(d => d[0] !== 'SKIP')
    );

    // write the CSV file
    fs.writeFile(`./data/covid19-feature.csv`, output.join('\n'), 'utf8', (err) => {
      if (err) return console.log(err);
      console.log('Done.');
    })

  } catch (error) {
    console.log('error reading file');
    console.log(error)
  }
})();
