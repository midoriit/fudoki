$(function(){

  var map = L.map('mapdiv', {
    minZoom: 10,
    maxZoom: 14
  });

  // 迅速測図
//  var oldLayer = L.tileLayer(
//    'http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png', {
//       opacity: 0.9,
//       attribution: '<a href="http://www.finds.jp/wsdocs/hawms/index.html" target="_blank">歴史的農業環境WMS配信サービス</a>'
//  });

  // 地理院地図
  var newLayer = L.tileLayer(
    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
       opacity: 0.6,
       attribution: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">国土地理院</a>'
  });

  // レイヤコントロール
//  var baseLayers = {
//    "現代": newLayer,
//    "明治期": oldLayer
//  };
//  L.control.layers(baseLayers).addTo(map);
  newLayer.addTo(map);

  L.control.locate({
    position: 'topright',
    drawCircle: false, 
    follow: false,
    setView: true,
    keepCurrentZoomLevel: true,
    stopFollowingOnDrag: true,
    remainActive: false,
    markerClass: L.circleMarker, // L.circleMarker or L.marker
    circleStyle: {},
    markerStyle: {},
    followCircleStyle: {},
    followMarkerStyle: {},
    icon: 'fa fa-location-arrow',
    iconLoading: 'fa fa-spinner fa-spin',
    showPopup: false,
    locateOptions: {enableHighAccuracy: true}
  }).addTo(map);

  L.control.scale({imperial: false}).addTo(map);

  L.easyButton('fa fa-info fa-lg',
    function() {
      $('#about').modal('show');
    },
    'このサイトについて',
    null, {
      position:  'bottomright'
    }).addTo(map);

  var markerclusters = new L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 20,
    spiderfyDistanceMultiplier: 2,
    iconCreateFunction: function (cluster) {
      return new L.DivIcon({
        html: '<div><span>' + 
              cluster.getChildCount() + 
              '</span></div>',
        className: 'fudoki-marker-cluster',
        iconSize: new L.Point(24, 24)
      });
	},
  });
  map.addLayer(markerclusters);

  $.getJSON( 'data/fudoki.geojson', function(data) {
    var fudokiLayer = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.divIcon({
            className: 'fudoki-div-icon',
            html: feature.properties.label
          })
        }).bindPopup(
          '<strong>' +
          (feature.properties.div1 ? feature.properties.div1 : '') + ' ' +  // 郡
          (feature.properties.div2 ? feature.properties.div2 : '') + ' ' +  // 郷
          (feature.properties.div3 ? feature.properties.div3 : '') + ' ' +  // 庄
//          (feature.properties.div4 ? feature.properties.div4 : '') + ' ' +  // 領
//          (feature.properties.div5 ? 
//            '<div class="remark">' + feature.properties.div5  + '</div>' : '') + ' ' +
//          (feature.properties.pre ? 
//            '<div class="remark">' + feature.properties.pre  + '</div>' : '') + ' ' +
          feature.properties.name + ' ' +
//          (feature.properties.post ? 
//            '<div class="remark">' + feature.properties.post  + '</div>' : '') + ' ' +
          '</strong><hr>' +
          '比定地：' + feature.properties.address + '<br/>' +
          '風土記稿：<a href="' + feature.properties.url + '" target="_blank">' +
          feature.properties.url + '</a>'
        );
      }
    });
    markerclusters.addLayer(fudokiLayer);
    map.fitBounds(markerclusters.getBounds());
  });
});
