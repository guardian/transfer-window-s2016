const interval = 15, total = 300;

function getOffset(el) {
    return el ? el.offsetTop + getOffset(el.offsetParent) : 0;
}

var animationFrame = window.requestAnimationFrame;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for (var x = 0; x < vendors.length && !animationFrame; ++x) {
    animationFrame = window[vendors[x]+'RequestAnimationFrame'];
}

animationFrame = animationFrame || function (cb) { setTimeout(cb, 13); };

function customScrollTo(el, shim) {

    console.log("scroll to called")
    if(!shim){ shim = 0 }
    var start = window.pageYOffset;
    var end = getOffset(el) + shim;
    var distance = end - start;
    var elapsed = 0;

    animationFrame(function scrollHandler() {
        var t = elapsed / total;
        window.scrollTo(0, Math.floor(start + distance * t * (2 - t)));
        if (elapsed < total) {
            elapsed += interval;
            animationFrame(scrollHandler);
        }
    });
};


module.exports = customScrollTo;