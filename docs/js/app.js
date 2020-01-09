mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';

var map = new mapboxgl.Map({
  container: 'main-map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [109.368491, 17.481626],
  zoom: 3.8,
  bounds: [
    [-113.98230924795782, -34.714924653073524],
    [157.7975025264243, 67.02992322784661]
  ]
});

map.addControl(
  new mapboxgl.NavigationControl(),
  'top-left'
);

map.addControl(
  new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
  }),
  'bottom-left'
);

var color = d3.schemeCategory10;
var colors = {
  byAttackType: [
    'match',
    ['get', 'Attack Type'],
    '侵扰',
    color[0],
    '偷盗',
    color[1],
    '劫持',
    color[2],
    '抢劫',
    color[3],
    '绑架',
    color[4],
    '袭击',
    color[5],
    '袭击、绑架',
    color[6],
    '袭击类型',
    color[7],
    /* other */
    '#ccc'
  ],
  byWaters: [
    'match',
    ['get', 'Waters'],
    '国际海域',
    color[0],
    '水域',
    color[1],
    '港区',
    color[2],
    '领海',
    color[3],
    /* other */
    '#ccc'
  ]
}

var keys = [
  "Ship Type",
  "IMO",
  "Waters",
  "Coordinates",
  "Region",
  "Position",
  "Attack Type",
  "Weapon Type",
  "Info"
]

var colors

map.on('load', function() {
  console.log('loaded')
  $.getJSON("./data/china-reported-piracy-attacks.json", function(geojson) {


    map.addSource('piracy-incidents-source', {
      'type': 'geojson',
      'data': geojson
    });



    map.addLayer({
      'id': 'piracy-incidents',
      'type': 'circle',
      'source': 'piracy-incidents-source',

      'paint': {
        'circle-radius': {
          stops: [
            [1, 2],
            [8, 5],
            [11, 18],
            [16, 40]
          ]
        },
        'circle-color': 'red',

        // [
        //   'match',
        //   ['get', 'Attack Type'],
        //   '侵扰',
        //   color[0],
        //   '偷盗',
        //   color[1],
        //   '劫持',
        //   color[2],
        //   '抢劫',
        //   color[3],
        //   '绑架',
        //   color[4],
        //   '袭击',
        //   color[5],
        //   '袭击、绑架',
        //   color[6],
        //   '袭击类型',
        //   color[7],
        //   /* other */
        //   '#FFC300'
        // ],
        'circle-opacity': 0.5,
        'circle-stroke-width': 0.2
      }
      // 'filter': ['==', '$properties', 'LineString']
    });


    map.on('click', 'piracy-incidents', function(e) {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties['Vessel Name'])
        .addTo(map);
    });

    var accordion = d3.select('#incidents-accordion')
      .selectAll('.card')
      .data(geojson.features)
      .enter();



    var cards = accordion.append('div')
      .classed('card', true);

    var headers = cards.append('div')
      .classed('card-header', true)
      .attr('id', function(d, i) {
        console.log(d);
        return 'incident-' + d.properties['No.'];
      })
      .attr('data-toggle', 'collapse')
      .attr('data-target', function(d) {
        return '#collapse-' + d.properties['No.'];
      })
      .attr('aria-expanded', 'true')
      .attr('aria-controls', function(d) {
        return 'collapse-' + d.properties['No.'];
      })
      .on('mouseenter', function(d) {
        console.log(d);
      })
      .append('p')
      .classed('mb-0', true)
      .text(generateDatetimeString);

    headers.append('h4')
      .classed('display-5', true)
      .text(function(d) {
        return d.properties['Vessel Name'] ? d.properties['Vessel Name'] : "Unnamed Ship"
      })

    cards.append('div')
      .classed('collapse', true)
      .attr('id', function(d) {
        return 'collapse-' + d.properties['No.'];
      })
      .append('div')
      .classed('card-body', true)
      .html(function(d) {

        var tblString = `<table class="table"><tbody>
            <col width="35%">
            <col width="65%">`;
        for (k of keys) {
          if (d.properties[k]) {
            tblString += addTr(k, d.properties[k]);
          } else if (k == 'Coordinates') {
            tblString += addTr('Coordinates',
              '[' + d.properties['Longitude'] + ', ' +
              d.properties['Latitude'] + ']');
          }
        }

        tblString += `</tbody></table>`;
        return tblString;
      });


  });
});
