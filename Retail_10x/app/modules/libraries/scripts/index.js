var locations = new Backbone.Collection([
  {
    name: 'Banglore',
    radius: 0,
    yeild: 60,
    country: 'India',
    fillKey: 'IND',
    significance: 'First potential fusion/boosted weapon test by India; first deployable fission weapon test by India',
    date: '1998-05-11',
    latitude: 12.97,
    longitude: 77.59
  },
  {
    name: 'Pune',
    radius: 0,
    yeild: 1,
    country: 'India',
    fillKey: 'IND',
    significance: 'First potential fusion/boosted weapon test by India; first deployable fission weapon test by India',
    date: '1991-11-04',
    latitude: 18.5204,
    longitude: 73.8567
  },
  {
    name: 'Trinity',
    radius: 0,
    yeild: 198,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1945-07-16',
    latitude: 33.4038,
    longitude: -106.2831
  },
  {
    name: 'New York',
    radius: 0,
    yeild: 91,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 40.7128,
    longitude: -73.0059
  },

  {
    name: 'Washington',
    radius: 0,
    yeild: 91,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 47.7128,
    longitude: -122.0059
  },

  {
    name: 'Colorado',
    radius: 0,
    yeild: 91,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 39.7128,
    longitude: -105.0059
  },

  {
    name: 'Tennessee',
    radius: 0,
    yeild: 91,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 35.5928,
    longitude: -83.8259
  },

  {
    name: 'California',
    radius: 0,
    yeild: 545,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 39.13,
    longitude: -121.60
  },

  {
    name: 'Los Angeles',
    radius: 0,
    yeild: 545,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 34.13,
    longitude: -118.60
  },

  {
    name: 'san diego ',
    radius: 0,
    yeild: 545,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 32.777,
    longitude: -117.07
  },

  {
    name: 'Hawaii',
    radius: 0,
    yeild: 845,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 19.777,
    longitude: -155.07
  },

  {
    name: 'Alaska',
    radius: 0,
    yeild: 845,
    country: 'USA',
    fillKey: 'USA',
    significance: 'First fission device test, first plutonium implosion detonation ',
    date: '1995-07-16',
    latitude: 60.777,
    longitude: -150.57
  },
]);

//prep the data
var yields = locations.pluck('yeild');

var min = d3.min(yields);
var max = d3.max(yields);

var scale = d3.scale.pow()
  .domain([min, max])
  .range([22, 45]);

locations.each(function (val, idx) {
  locations.at(idx).set('radius', scale(val.get('yeild')));
});

$("#container1").datamap({
  scope: 'usa',
  bubbles: locations.toJSON(),
  bubble_config: {
    popupTemplate: _.template([
      '<div class="hoverinfo"><strong><%= data.name %></strong>',
      '<br/>Payload: <%= data.yeild %> kilotons',
      '<br/>Country: <%= data.country %>',
      '<br/>Date: <%= data.date %>',
      '</div>'].join(''))
  },
  geography_config: {
    popupOnHover: false,
    highlightOnHover: false
  },
  fills: {
    'USA': '#7FFF00',
    'RUS': '#9467bd',
    'PRK': '#ff7f0e',
    'PRC': '#2ca02c',
    'IND': '#EDDC4E',
    'GBR': '#8c564b',
    'FRA': '#d62728',
    'PAK': '#7f7f7f',
    'AUS': '#7f7f8f',
    defaultFill: '#dddddd'
  },
  data: {
    'RUS': {fillKey: 'RUS'},
    'PRK': {fillKey: 'PRK'},
    'CHN': {fillKey: 'PRC'},
    'IND': {fillKey: 'IND'},
    'GBR': {fillKey: 'GBR'},
    'FRA': {fillKey: 'FRA'},
    'PAK': {fillKey: 'PAK'},
    'USA': {fillKey: 'USA'},
    'AUS': {fillKey: 'AUS'},
  }
});
