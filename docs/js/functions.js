function addFeatureLayer(_idx, _feature) {


  let id = "point-" + String(_idx)
  let c = '#000000';

  console.log('colo9r', id, c);

  let geojson = {
    "type": "FeatureCollection",
    "features": [
      _feature
    ]
  }

  map.addSource('feature-' + String(_idx), {
    'type': 'geojson',
    'data': geojson
  });



  map.addLayer({
    'id': id,
    'type': 'circle',
    'source': 'feature-' + String(_idx),

    'paint': {
      'circle-radius': 6,
      'circle-color': '#B42222'
    }
    // 'filter': ['==', '$properties', 'LineString']
  });

  // map.setPaintProperty(id, "line-color", c)






}


function generateDatetimeString(_feature) {

    // Set up datetime string
    let datetime = new Date(2019, _feature.properties.Month, _feature.properties.Day)
      .toString().split(' ')
      .slice(0, 4).join(' ');

    if (_feature.properties.Time) {
      datetime = _feature.properties.Time + ' ' + datetime;
    }


    return datetime;
}


function addFeatureCard(_idx, _feature) {
  console.log('Card', _feature)


}


function addTr(_key, _value) {
  return `<tr>
    <th scope="row">${_key}</th>
    <td>${_value}</td>
  </tr>`
}



/*
fitText jQuery plugin, for scaling airport codes
@param {float} kompressor: scaling factor
@param {object} options: optional pixel values:
  minFontSize
  maxFontSize
(Attaches a method to the jquery object.)
*/
(function($) {
  // Directly from https://github.com/davatron5000/FitText.js
  $.fn.fitText = function(kompressor, options) {

    // Setup options
    var compressor = kompressor || 1,
      settings = $.extend({
        'minFontSize': Number.NEGATIVE_INFINITY,
        'maxFontSize': Number.POSITIVE_INFINITY
      }, options);

    return this.each(function() {

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function() {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})(jQuery);
