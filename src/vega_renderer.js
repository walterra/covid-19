import $ from 'jquery';

var supportedKeys = [
  'chart_1',
  'chart_2',
  'chart_2test',
  'chart_3',
  'chart_4',
  'chart_counties_confirmed',
  'chart_counties_death',
  'chart_counties_recovered',
  'chart_counties_confirmed_daily',
  'chart_counties_death_daily',
  'chart_counties_recovered_daily',
];
function loadVega(f, id) {
  if (supportedKeys.indexOf(f) === -1) {
    console.error('unsupported key:', f);
    return;
  }

  $.get('data/'+f+'.json', function( spec ) {
    var opt = {"renderer": "canvas", "actions": false};
    vegaEmbed("#"+id, spec, opt);
  });
}

function loadMetaData() {
  $.get('data/metadata.json', function( metadata ) {
    $('#lastUpdate').text(metadata.lastUpdate);
  });
}

$(document).ready(function(){
  loadMetaData();
  loadVega('chart_1', 'vega_chart_1');
  loadVega('chart_2', 'vega_chart_2');
  loadVega('chart_2test', 'vega_chart_2test');
  loadVega('chart_3', 'vega_chart_3');
  loadVega('chart_4', 'vega_chart_4');
  loadVega('chart_counties_confirmed', 'vega_chart_counties_confirmed');
  loadVega('chart_counties_death', 'vega_chart_counties_death');
  loadVega('chart_counties_recovered', 'vega_chart_counties_recovered');
  loadVega('chart_counties_confirmed_daily', 'vega_chart_counties_confirmed_daily');
  loadVega('chart_counties_death_daily', 'vega_chart_counties_death_daily');
  loadVega('chart_counties_recovered_daily', 'vega_chart_counties_recovered_daily');
});
