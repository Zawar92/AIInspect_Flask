/*
 * 5 ways to customize the Google Maps infowindow
 * 2015 - en.marnoto.com
 * http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
*/

var jsondata = [
       {"NameStore":"DJI Spark","Latitude":"24.8460558","Longitude":"67.0231379"},
       {"NameStore":"DJI Phantom","Latitude":"24.846076","Longitude":"67.023275"},
       {"NameStore":"DJI Inspire","Latitude":"24.8460389","Longitude":"67.0229773"}];

// map center
var center = new google.maps.LatLng(24.8460558, 67.0231379);

// marker position
//var factory = new google.maps.LatLng(24.794475, 67.063042);

function initialize() {
  var mapOptions = {
    center: center,
    zoom: 20,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
    setMarkers(map,jsondata);
}
function setMarkers(map,jsondata){

    var marker, i

for (i = 0; i < 3; i++)
{


var Title = jsondata[i].NameStore;


var latLng = new google.maps.LatLng(jsondata[i].Latitude,jsondata[i].Longitude);//coords[1],coords[0]);




  // InfoWindow content
  var content = store_contents[i];

  // A new Info Window is created and set content
  var infowindow = new google.maps.InfoWindow()
  // marker options
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    Icon: '../static/Smartinspection/js/marker.png',
    animation: google.maps.Animation.DROP,
   // animation: google.maps.Animation.BOUNCE,
    title:Title,
    dealerId: i
  });
//}
  google.maps.event.addListener(marker,'click',(function(marker,content,infowindow){
          return function() {
             infowindow.setContent(content);
             infowindow.open(map,marker);
            // infowindow.iwOuter($('.gm-style-iw'));

              map.setZoom(25);
              map.setCenter(marker.getPosition());
              console.log(marker.dealerId);
				if(marker.dealerId==0)
				{
            window.open('http://10.15.0.125:8080/video')
            //window.parent.location.href= "http:10.15.2.7:8080/video";
					//alert('0');
				}
				else if (marker.dealerId==1)
				{
            window.open("http://10.15.0.125:8080/video",'_blank');
					//alert('1');
					
				}
				else
				{
          window.open("http://10.15.0.125:8080/video",'_blank');
					//alert('2');
					
				}


              //infowindow.close();
          };
      })(marker,content,infowindow));

      // add a click on map event
      google.maps.event.addListener(map, 'click', function(e) {
        // set a marker there, with a small measle icon
        var position = e.latLng;
        polygonLocations.push(position);
        polygonMarkers.push(new google.maps.Marker({
          icon: 'https://maps.gstatic.com/intl/en_ALL/mapfiles/markers2/measle.png',
          position: position,
          map: map
        }));
        // now let's add a polygon
        drawPolygon(polygonLocations);
        
      });
      google.maps.event.addListener(map, 'rightclick', function(e) {
        clearSelection();
      //  alert("hello");
      });

  // *
  // START INFOWINDOW CUSTOMIZE.
  // The google.maps.event.addListener() event expects
  // the creation of the infowindow HTML structure 'domready'
  // and before the opening of the infowindow, defined styles are applied.
  // *
  google.maps.event.addListener(infowindow, 'domready', function() {

    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
    */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground.children(':nth-child(2)').css({'display' : 'none'});

    // Removes white background DIV
    iwBackground.children(':nth-child(4)').css({'display' : 'none'});

    // Moves the infowindow 115px to the right.
    iwOuter.parent().parent().css({left: '115px'});

    // Moves the shadow of the arrow 76px to the left margin.
    iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 85px !important;'});

    // Moves the arrow 76px to the left margin.
    iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 85px !important;'});

    // Changes the desired tail shadow color.
    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({opacity: '1', right: '45px', top: '2px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
    if($('.iw-content').height() < 140){
      $('.iw-bottom-gradient').css({display: 'none'});
    }

    // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });
  });

  // draws a polygon
  function drawPolygon(points) {
    if(points.length < 3) {
      return;
    }
    // first delete the previous polygon
    if(polygon) {
      polygon.setMap(null);
    }
    // @see https://developers.google.com/maps/documentation/javascript/examples/polygon-simple
    polygon = new google.maps.Polygon({
      paths: points,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map
    });
    // display to input
    displaySelectedMarkers(polygon);
  }

  // display the selected markers to input.
  function displaySelectedMarkers(polygon) {
    // empty the input
  //  document.getElementById('selected_markers').value = '';
  //alert('f');
    var storeInfo=[];
    var stroreInfo1=[];
    var l=[];
    var a=0;  // I use this to set a comma between the values, but no comma at the end
    for(var i in locations) {
      // @see https://developers.google.com/maps/documentation/javascript/examples/poly-containsLocation
      if (google.maps.geometry.poly.containsLocation(locations[i], polygon)) {
        //document.getElementById('selected_markers').value += (a++>0 ? ', ' : '') + i ;
        a++;
      // storeInfo=store_Heading;
       // infowindow.setContent(storeInfo);
       // infowindow.open(map);
      //  map.panTo(locations[0]);
      storeInfo=storeInfo+store_contents[i];

        if (i==0)
        {
          alert('testing done');
        }
        else if (i==21)
        {
          l[1]=21;
        }

        if (l[0]==25 && l[1]==21)
        {
            storeInfo1=store_contents1[0];
            infowindow.setContent(storeInfo1);
            infowindow.open(map);
           // map.setZoom(6);
            map.panTo(locations[21]);
           

        }
        
       // var infowindow0=[];

      //  infowindow0[i]= new google.maps.InfoWindow();
        else if (a>=1)
        {
            infowindow.setContent(storeInfo);
            infowindow.open(map);
           // map.setZoom(6);
            map.panTo(locations[i]);
        }
       // marker.setCenter(jsondata[i].Longitude,jsondata[i].Latitude);

        
                
       
        }


    }
   
    
  }


  function clearSelection() {
    if(polygon) {
      polygon.setMap(null);
    }
    for (var i in polygonMarkers) {
      polygonMarkers[i].setMap(null);
    }
    polygonLocations = [];
    //document.getElementById('selected_markers').value = '';
  }
}


}
google.maps.event.addDomListener(window, 'load', initialize);
