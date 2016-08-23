import scattergridFee from './scatterChart' 

var customScrollTo;


export default function clublistPrint(obj, allTransfers, globalSortOn, scrollFn, yy, isoArr, highestPrice) {

    customScrollTo = scrollFn;

    var el = document.getElementById('gv__clubList');

    var htmlStr = "<div>";
    htmlStr += constructInnerHtml(isoArr)
    htmlStr += "</div>"
    

    el.innerHTML = htmlStr;


    addScatterGrids(isoArr, globalSortOn, highestPrice)


}

function constructInnerHtml(isoArr){
    var s= "";


    // use _.forOwn to iterate through object
     _.each(isoArr, function(item) { 

        var key = item.premClub;
        s+="<div class='dig-slice' id='listEntry_"+stripSpace(key)+"'>"
        s+="<div class='dig-slice__inner'>"


        s+="<div class='dig-slice__inner__main'>"
        s+="<div class='gv-flex-4 no-margin'>"
        s+="<div class='gv-stats-wrapper'>" //graph header
        // s+="<img src='https://sport.guim.co.uk/football/crests/120/"+item.badgeRef+".png' width='auto' height='34px' style='display:inline-block; margin-right:12px;'>"
        s+="<div style='display:inline-block'><span class='dig-section-title-sub' style='display:inline-block;'>"+key+"</span>"

        //s+= key=="Arsenal" ? "<div style='width:100%' class='gv-stats-holder'>Players in <span id='clubStatSpend_"+stripSpace(key)+"'  class='fill-spend'> </span>, players out <span id='clubStatSold_"+stripSpace(key)+"' class='fill-sell'>ADD</span></div>" : "<div style='width:100%' class='gv-stats-holder'>In <span id='clubStatSpend_"+stripSpace(key)+"'  class='fill-spend'> </span>, out <span id='clubStatSold_"+stripSpace(key)+"' class='fill-sell'>ADD</span></div>";
        s+= "<div style='width:100%' class='gv-stats-holder'>Total 2014–2016: players in <span id='clubStatSpend_"+stripSpace(key)+"'  class='fill-spend'> </span>, players out <span id='clubStatSold_"+stripSpace(key)+"' class='fill-sell'>ADD</span></div>"
        s+="</div>" //end graph header
        s+="</div>" 
        s+= addDetails ( key, item.playerPic );
        s+= "<div class='scatter-grids-wrapper'>"
        s+= addChartHTML( key );    //addPlayerList removed    
        s+= "</div>"
        s+="</div>"
        
        s+="<div class='gv-flex-4 back-top-holder'>" 
        s+="<div class='gv-back-top-button'><span><svg height='14' width='21' xmlns='http://www.w3.org/2000/svg'>"
        s+="<path d='M0.5,7 L5.75,2.5 L5.75,14 L7.25,14 L7.25,2.5 L12.5,7 L13,6 L7.25,0 L5.75,6e-17 L0,6 L0.5,7 L0.5,7 Z' fill='#BBB'></path></svg></span><span><a href='#' class='dig-back-to-top js-back-to-top'>Back to top</a></span></div>"
        s+="</div>"

        s+="</div>"
        
        s+="</div>"

         

         s+="</div>"
         //<span id='clubStatSpend_"+stripSpace(key)+"'></span>
     } );

     return s;

}


// s+= "<div class='dig-slice__inner'>"
// s+= "<div class='dig-slice__inner__left'>"
// s+= "</div>"
    

// s+= "<div class='dig-slice__inner__main gv-flex-4' id='listEntry_"+stripSpace(key)+"'>"
// s+="<div class='gv-stats-wrapper'>" //graph header
// s+="<img src='https://sport.guim.co.uk/football/crests/120/"+item.badgeRef+".png' width='auto' height='34px' style='display:inline-block; margin-right:12px;'>"
// s+="<div style='display:inline-block'><span class='dig-section-title-sub' style='display:inline-block;'>"+key+"</span>"
// s+="<div style='width:100%' class='gv-stats-holder'><span id='clubStatSpend_"+stripSpace(key)+"'  class='fill-spend'> </span> <span id='clubStatSold_"+stripSpace(key)+"' class='fill-sell'>ADD</span></div>"
// s+="</div>" //end graph header
// s+= addChartHTML( key );        
// s+= "</div>"
// s+= "</div>"

function addDetails(key, playerPic){
    var s = "<div class='gv-flex-3'>";
    s+= "<div class='gv-player-pic' id='playerPic_"+stripSpace(key)+"' style='background-image:url("+playerPic+")' > </div>"; //background:url(https://interactive.guim.co.uk/2016/06/euros-player-pictures/England/Wayne_Rooney.jpg
    s+= "<div id='clubDetails_"+stripSpace(key)+"'></div>";

    s+=" </div>";

  return s;  
}


function formatPrice(s){
    var v = s;

    if(!isNaN(v)){ v = s/1000000; v = "£"+v+"m"}

    return v;
}

function addChartHTML(k){
    return "<div class='gv-flex-4'><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2016'> </div><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2015'> </div><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2014'> </div></div>"; // no player list
}


function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}

function addScatterGrids(a, globalSortOn, highestPrice){

    //var maxBuy = _.maxBy(allTransfers, function(item) { return item.cost; });

    var scatterGrid = new scattergridFee(a, globalSortOn, highestPrice);
        
        // (a, s, t, rowWidth, scrollFn)
  

}
