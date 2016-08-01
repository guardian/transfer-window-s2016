import scattergridFee from './scattergridDate'
var customScrollTo;

var isoArr = [ 
    { premClub:'Arsenal', iso:'ARS', badgeRef:'1006'}, 
    { premClub:'Bournemouth', iso:'BOU', badgeRef:'23'},
    { premClub:'Burnley', iso:'BUR', badgeRef:'70'}, 
    { premClub:'Chelsea', iso:'CHE', badgeRef:'4'}, 
    { premClub:'Crystal Palace', iso:'CRY', badgeRef:'5'}, 
    { premClub:'Everton', iso:'EVE', badgeRef:'8'}, 
    { premClub:'Hull City', iso:'HUL', badgeRef:'26'}, 
    { premClub:'Leicester City', iso:'LEI', badgeRef:'29'}, 
    { premClub:'Liverpool', iso:'LIV', badgeRef:'9'}, 
    { premClub:'Manchester City', iso:'MCY', badgeRef:'11'}, 
    { premClub:'Manchester United', iso:'MUN', badgeRef:'12'}, 
    { premClub:'Middlesbrough', iso:'MID', badgeRef:'30'}, 
    { premClub:'Southampton', iso:'SOU', badgeRef:'18'}, 
    { premClub:'Stoke City', iso:'STK', badgeRef:'38'}, 
    { premClub:'Sunderland', iso:'SUN', badgeRef:'39'}, 
    { premClub:'Swansea City', iso:'SWA', badgeRef:'65'}, 
    { premClub:'Tottenham Hotspur', iso:'TOT', badgeRef:'19'},
    { premClub:'Watford', iso:'WAT', badgeRef:'41'},  
    { premClub:'West Bromwich Albion', iso:'WBA', badgeRef:'42'}, 
    { premClub:'West Ham United', iso:'WHU', badgeRef:'43'}
];

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
        s+="<div class='dig-slice__inner__left'><img src='https://sport.guim.co.uk/football/crests/120/"+getBadgeRef(key)+".png' width='auto' height='30px' style='display:inline-block; margin-right:12px;'>"
        s+="<span class='dig-section-title-sub' style='display:inline-block;'>"+key+"</span>"
        s+=""
        s+="<br/><a class='dig-back-to-top js-back-to-top' href='#'><span><svg height='14' width='15' xmlns='http://www.w3.org/2000/svg'>"
        s+="<path d='M0.5,7 L5.75,2.5 L5.75,14 L7.25,14 L7.25,2.5 L12.5,7 L13,6 L7.25,0 L5.75,6e-17 L0,6 L0.5,7 L0.5,7 Z' fill='#333'></path></svg></span><span>Back to top</span></a>"
        s+="</div>"
        s+="<div class='dig-slice__inner__main'>"
            s += getPlayerList(value, key);        
        s+="</div>"
        s+="</div>"
        s+="</div>"
         
     } );

     return s;

     function getBadgeRef(k){
        var s = "";

        _.each(isoArr, function(o){
            if(o.premClub==k){ s=o.badgeRef }
        })

        return s;
     }
 

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


function getPlayerList(a, k){
    var moneyFigures = getFigures(a);

    var graphStr = " ";
    console.log(moneyFigures);
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

    return "<div class='scatter-grid-holder' id ='scatterGrid_"+stripSpace(k)+"'></div>"; // no player list
}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}



function addScatterGrids(o, allTransfers, globalSortOn){
    var rowWidth = 920; 
    var maxBuy = _.maxBy(allTransfers, function(item) { return item.cost; });

    console.log(maxBuy.cost);

    _.forOwn(o, function(value, key) { 

        

        var scatterGrid = new scattergridFee( value, globalSortOn, key, 'scatterGrid_'+stripSpace(key), rowWidth, customScrollTo, maxBuy.cost);
        
        // (a, s, t, rowWidth, scrollFn)

    })    

}
