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
        s+="<div class='dig-slice__inner__left'>"

        s+="</div>"

        s+="<div class='dig-slice__inner__main'>"
        s+="<div class='gv-stats-wrapper'>" //graph header
        s+="<img src='https://sport.guim.co.uk/football/crests/120/"+item.badgeRef+".png' width='auto' height='34px' style='display:inline-block; margin-right:12px;'>"
        s+="<div style='display:inline-block'><span class='dig-section-title-sub' style='display:inline-block;'>"+key+"</span>"
        s+="<div style='width:100%' class='gv-stats-holder'><span id='clubStatSpend_"+stripSpace(key)+"'  class='fill-spend'>ADD</span> <span id='clubStatSold_"+stripSpace(key)+"' class='fill-sell'>ADD</span></div>"
        
        s+="</div>" //end graph header
        s+="</div>" 
        s+= addChartHTML( key );    //addPlayerList removed    
        
        s+="</div>"
        s+="</div>"
        s+="</div>"
         //<span id='clubStatSpend_"+stripSpace(key)+"'></span>
     } );

     return s;

}



function formatPrice(s){
    var v = s;

    if(!isNaN(v)){ v = s/1000000; v = "£"+v+"m"}

    return v;
}

function getFigures(a){
    
    var sell = 0;
    var buy = 0;
    var outputSell = false; 
    var outputBuy = false;
    var sellStr, buyStr;

    _.each(a, function(o){
        if(o.buy && !o.sell){
            buy+=o.cost;
            outputBuy = true;

        }    
        if(o.sell && !o.buy){
            sell+=o.cost;
            outputSell = true;
        } 

    })

   buyStr =  buy > 0 ? "<ul class='player-list'><li class='player-list__item'><span class='player-list__heading'  style='font-weight:600'>IN ("+buy/1000000+"m):</span></li>" : "<ul class='player-list'><li class='player-list__item'><span class='player-list__heading'  style='font-weight:600'>IN :</span></li>";
   sellStr =  sell > 0 ? "<ul class='player-list'><li class='player-list__item'><span class='player-list__heading' style='font-weight:600'>OUT ("+sell/1000000+"m):</span></li>" : "<ul class='player-list'><li class='player-list__item'><span class='player-list__heading'  style='font-weight:600'>OUT :</span></li>";

   if(!outputBuy){buyStr = " "}
   if(!outputSell){sellStr = " "}


    return [buyStr, sellStr];
}


function addChartHTML(k){
    return "<div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2016'> </div><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2015'> </div><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2014'> </div>"; // no player list
}

function getPlayerList(a, k, yy){
    var moneyFigures = getFigures(a);

    var graphStr = " ";
    var buyS = moneyFigures[0];
    var sellS = moneyFigures[1];

    _.each(a, function(o){
        
        if(o.buy && !o.sell){
            // buyS += "<span>";
            buyS += "<li class='player-list__item'>"; //style='border-top-width: 8px; border-top-style: solid; border-top-color: rgba(77, 198, 221, 0.5);'
            buyS += o.playername +", ";
            buyS += formatPrice(o.price);
            buyS += ";</li>" 
        }

        if(o.sell && !o.buy){
            // sellS += "<span>";
            sellS += "<li class='player-list__item'>"; // style='border-top-width: 8px; border-top-style: solid; border-top-color: rgba(77, 198, 221, 0.5);'
            sellS += o.playername +", ";
            sellS += formatPrice(o.price);
            sellS += ";</li>" 
        }    
    });


    buyS += "</ul>"; sellS += "</ul>"; 

    // return "<div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"'></div><div style='margin-bottom:20px'>"+graphStr+buyS+sellS+"</div>";

    return "<div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2016'> </div><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2015'> </div><div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"_2014'></div>"; // no player list
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
