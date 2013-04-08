function addSampleButton(caption, clickHandler) {
   var btn = document.createElement('input');
   btn.type = 'button';
   btn.value = caption;
   
   if (btn.attachEvent)
      btn.attachEvent('onclick', clickHandler);
   else
      btn.addEventListener('click', clickHandler, false);
   
   // add the button to the Sample UI
   document.getElementById('sample-ui').appendChild(btn);
}

function addSampleUIHtml(html) {
   document.getElementById('sample-ui').innerHTML += html;
}

var ge;

var tour = null;

google.load("earth", "1");

function init() {
   google.earth.createInstance('map3d', initCallback, failureCallback);
   
   addSampleButton('Enter Tour', enterTour);
   addSampleButton('Play', playTour);
   addSampleButton('Pause', pauseTour);
   addSampleButton('Stop/Reset', resetTour);
   addSampleButton('Exit Tour', exitTour);
}

function initCallback(instance) {
   ge = instance;
   ge.getWindow().setVisibility(true);
   
   // add a navigation control
   ge.getNavigationControl().setVisibility(ge.VISIBILITY_HIDE);
   
   // add some layers
   ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, false);
   ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, false);
   ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
   ge.getLayerRoot().enableLayerById(ge.LAYER_TREES, true);
   ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
   
   // create the tour by fetching it out of a KML file
   var href = 'http://www.cs.uleth.ca/~belz3720/tourism/tour2.kmz';
   
   google.earth.fetchKml(ge, href, function(kmlObject) {
	 if (!kmlObject) {
	    // wrap alerts in API callbacks and event handlers
	    // in a setTimeout to prevent deadlock in some browsers
	    setTimeout(function() {
		  alert('Bad or null KML.');
	       }, 0);
	    return;
	 }
	 
	 // Show the entire KML file in the plugin.
	 ge.getFeatures().appendChild(kmlObject);
	 
	 // Walk the DOM looking for a KmlTour
	 walkKmlDom(kmlObject, function() {
	       if (this.getType() == 'KmlTour') {
		  tour = this;
		  return false; // stop the DOM walk here.
	       }
	    });
      });
}

function failureCallback(errorCode) {
}

function enterTour() {
   if (!tour) {
      alert('No tour found!');
      return;
   }
   
   ge.getTourPlayer().setTour(tour);
}

function playTour() {
   ge.getTourPlayer().play();
}

function pauseTour() {
   ge.getTourPlayer().pause();
}

function resetTour() {
   ge.getTourPlayer().reset();
}

function exitTour() {
   // just like setBalloon(null)
   ge.getTourPlayer().setTour(null);
}