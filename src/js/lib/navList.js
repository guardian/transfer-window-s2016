var customScrollTo;

export default function navList(obj, sortOn, scrollFn) {

    customScrollTo = scrollFn;
    
        var htmlStr = " ";

         _.forOwn(obj, function(value, key) { 

              htmlStr += "<li class='dig-filters__filter'> <a class='dig-filters__filter__link js-filter' href='#' data_section='"+stripSpace(key)+"'>";
              htmlStr += "<span class='dig-filters__filter__link__circle showing-mobile-only' style='color: rgb(149, 28, 85);'>"
              htmlStr += "<svg class='hp-summary__toggle__icon' xmlns='http://www.w3.org/2000/svg' width='30' height='30'>" 
              htmlStr += "<path fill='currentColor' d='m 21,15 -5.25,4.5 0,-11.5 -1.5,0 0,11.5 L 9,15 l -0.5,1 5.75,6 1.5,0 5.75,-6 -0.5,-1 0,0 z'></path>" 
              htmlStr += "</svg></span>"
              htmlStr += "<span class='dig-filters__filter__link__text'>"+key+"</span>" 
              htmlStr += "</a></li>"
        })
        

        var el = document.getElementById("guNavList").innerHTML = htmlStr;
         //el.innerHTML()

        //var sel = d3.select(".gv-select");

        //addDropListener(sel)
        addNavListeners()
}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}

function addNavListeners(){

  var navLinks = document.getElementsByClassName("dig-filters__filter__link");

  for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click',  function() {
            console.log(this.attributes.data_section.value); //updateDots

            customScrollTo(document.getElementById("listEntry_"+this.attributes.data_section.value));
    });
  }
  
}
