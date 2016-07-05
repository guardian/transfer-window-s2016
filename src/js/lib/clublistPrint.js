import scattergridFee from './scattergridDate'
var customScrollTo;

export default function clublistPrint(obj, allTransfers, globalSortOn, scrollFn) {

    customScrollTo = scrollFn;

    var el = document.getElementById('gv__clubList');


    var htmlStr = "<div>";
    htmlStr += constructInnerHtml(obj)
    htmlStr += "</div>"
    

    el.innerHTML = htmlStr;

    addScatterGrids(obj, allTransfers, globalSortOn);
}

function constructInnerHtml(o){
    var s= "";


    // use _.forOwn to iterate through object
     _.forOwn(o, function(value, key) { 

        s+="<div class='dig-slice' id='listEntry_"+stripSpace(key)+"'>"
        s+="<div class='dig-slice__inner'>"
        s+="<div class='dig-slice__inner__left'>"
        s+="<h2 class='dig-section-title-sub'>"+key+"</h2>"
        s+="<a class='dig-back-to-top js-back-to-top' href='#'><span><svg height='14' width='15' xmlns='http://www.w3.org/2000/svg'>"
        s+="<path d='M0.5,7 L5.75,2.5 L5.75,14 L7.25,14 L7.25,2.5 L12.5,7 L13,6 L7.25,0 L5.75,6e-17 L0,6 L0.5,7 L0.5,7 Z' fill='#333'></path></svg></span> <span>Back to top</span></a>"
        s+="</div>"
        s+="<div class='dig-slice__inner__main'>"
            s += getPlayerList(value, key);        
        s+="</div>"
        s+="</div>"
        s+="</div>"
         
     } );

     return s;
 

}

function getPlayerList(a, k){
    var graphStr = "<div id='scatterGrid_"+stripSpace(k)+"'></div>"
    var buyS = "<ul class='player-list'><li class='player-list__item'><span class='player-list__heading'>IN</span></li>";
    var sellS = "<ul class='player-list'><li class='player-list__item'><span class='player-list__heading'>OUT</span></li>";

    _.each(a, function(o){
        
        if(o.buy && !o.sell){
            // buyS += "<span>";
            buyS += "<li class='player-list__item'>"; //style='border-top-width: 8px; border-top-style: solid; border-top-color: rgba(77, 198, 221, 0.5);'
            buyS += o.playername +", ";
            buyS += o.price;
            buyS += "</li>" 
        }

        if(o.sell && !o.buy){
            // sellS += "<span>";
            sellS += "<li class='player-list__item'>"; // style='border-top-width: 8px; border-top-style: solid; border-top-color: rgba(77, 198, 221, 0.5);'
            sellS += o.playername +", ";
            sellS += o.price;
            sellS += "</li>" 
        }    
    });

    buyS += "</ul>"; sellS += ""; 

    return "<div class='dig-slice__inner'>"+graphStr+buyS+sellS+"</div>";
}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}

function buildDataView(arr, rowWidth){
     


}

function addScatterGrids(o, allTransfers, globalSortOn){
    var rowWidth = 920;
    _.forOwn(o, function(value, key) {        
        var scatterGrid = new scattergridFee( allTransfers, globalSortOn, key, 'scatterGrid_'+stripSpace(key), rowWidth, customScrollTo);
                    // (a, s, t, rowWidth, scrollFn)

    })    

}
