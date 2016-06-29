var Ractive = require('ractive');
// var iframeMessenger = require('./utils/iframeMessenger');

function onrender() {
	console.log('Rendering graphView');
	// iframeMessenger.enableAutoResize();
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../text/graphView.html')
});