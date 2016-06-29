var Ractive = require('ractive');

function onrender() {
	console.log('Rendering clubView');
	// iframeMessenger.enableAutoResize();
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../text/clubView.html')
});


