var customScrollTo;

export default function navList(obj, sortOn, scrollFn) {

    customScrollTo = scrollFn;
    
        var htmlStr = "<option value='' selected=''>select a club</option>";

         _.forOwn(obj, function(value, key) { 

              htmlStr += "<option value='"+ stripSpace(key)+"'>"+key+"</option>"
              
        })
        

        var el = document.getElementById("dropInner");
        el.innerHTML = htmlStr;
         //el.innerHTML()

        //var sel = d3.select(".gv-select");

        el.onchange=function(){scrollToSel(el.value);};
        //addNavListeners()
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
function scrollToSel(s){

  customScrollTo(document.getElementById("listEntry_"+s));

}



