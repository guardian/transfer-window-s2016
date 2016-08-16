import reqwest from 'reqwest'
import ractive from 'ractive'
import lodash from 'lodash'
import d3 from 'd3'
import iframeMessenger from './lib/iframeMessenger'
import customScrollTo from './lib/customScrollTo'

import { getUniqueObjects, getAgeGroup, checkForNumber, getDisplayCost , getFormattedFee } from './lib/utils'
import mainHTML from './text/main.html!text'
import share from './lib/share'
// import scatterplot from './lib/scatterplot'
import navlist from './lib/navList'

import clublistPrint from './lib/clublistPrint'

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

var Ractive = ractive;
var _ = lodash;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

//define globals
var dataURL2016 = 'https://interactive.guim.co.uk/docsdata-test/1VW0QYe6WqmvxIQ2MoDUaFIbztySJxLQJ9UUIGSYSaNg.json'
var dataURL2015 = 'https://interactive.guim.co.uk/docsdata-test/1OilCanhD6Xb3uN7fl-UvuRaCFpTuTgEk6CcBbr4OFYg.json'
var dataURL2014 = 'https://interactive.guim.co.uk/docsdata-test/1YwSeSd_eNMFnzgPmXmwa-UfKCk6lMFG0Qd-1KSKtW48.json'

var allTransfers;

var leaguesArray, nationalitiesArray, clubD3Data, leagueD3Data, nationD3Data, ageD3Data, rowWidth;
var globalSortOn;

var arrTransfersByClubYear = [];     

var timeFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');

var highestPrice = 0;

var yearsDone = [];

//Add 1 of 'Hull City', 'Sheffield Wednesday',

export function init(el, context, config, mediator) {

    globalSortOn = 'premClub'; //initView

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
            url: dataURL2014,
            type: 'json',
            crossOrigin: true,
            success: (resp) => initData(resp,'2014')
            //initData(resp)
        }); 

    reqwest({
            url: dataURL2015,
            type: 'json',
            crossOrigin: true,
            success: (resp) => initData(resp,'2015')
        }); 

    reqwest({
            url: dataURL2016,
            type: 'json',
            crossOrigin: true,
            success: (resp) => initData(resp,'2016')
        }); 



function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function logData(r, yy){

    var tempArr = buildArray(r)

    _.each(tempArr, function(item){
        //console.log(item)
    })

}



function initData(r, yy){

    var tempArr = buildArray(r,yy)

    //var yearsArray = _.uniq(tempArr,'d3Year')
    //console.log(yearsArray)
    // var yearLabels = _.uniqBy(clubArr, 'd3Year');
    //console.log(yearLabels)

    var clubArr = _.groupBy(tempArr,'premClub') 

    var highPriceCheck = d3.max(tempArr, function (d) { return d.cost; })

    if (highPriceCheck > highestPrice ){ highestPrice = highPriceCheck }


    //buildDataView(allTransfers, 940);

        _.each(isoArr , function(team,i){

                    var arrays = {
                    Array2014: [],
                    Array2015: [],
                    Array2016: []
                };

                _.each(clubArr, function(a){
                    if(a[0].premClub == team.premClub){
                        arrays['Array' + yy] = a; //update array if there are transfers - Middlesbrough, Hull, Bournemouth etc. need an empty array for seasons outside prem
                    }

                })  
            team['transfers_'+ yy ] = arrays['Array' + yy];
            
        })
         

    var navList =  new navlist(clubArr, globalSortOn, customScrollTo)

    yearsDone.push(yy)

    if (yearsDone.length == 3){
       buildListView(clubArr ,tempArr, customScrollTo, yy, isoArr, highestPrice) //loop finished data ready
    }
     


}

function buildArray(r,yy){

    var tempArr = []

    allTransfers = r.sheets.rawData;

        _.each(allTransfers, function(item, i){  
                var jsDate = new Date(item.date)
                item.d3Date = getD3Date(item.date);
                item.cost = checkForNumber(item.price);
                item.year = yy;

                item.ageGroup = getAgeGroup(item);   
                
                item.formattedFee = getFormattedFee(item.price);
                // item.rDate = randomDate(new Date(2016, 5, 1), new Date(2016, 8, 1));
                item.value = checkForNumber(item.price)+1000000;

                if(item.newleague == "Premier League (England)" && item.previousleague != "Premier League (England)"){ 
                    item.buy=true; 
                    item.premClub = item.to;
                    tempArr.push(item); 
                }

                if(item.previousleague == "Premier League (England)" && item.newleague != "Premier League (England)"){ 
                    item.sell=true; 
                    item.premClub = item.from;
                    tempArr.push(item);
                }

                if(item.newleague == "Premier League (England)" && item.previousleague == "Premier League (England)"){ 

                    var itemOne = {}; 
                    var itemTwo = {};

                    var sellClub = item.from; var buyClub = item.to;
                    
                    itemOne.buy=false;
                    itemOne.sell=true;                    
                    itemOne.inout = "OUT";
                    
                    itemTwo.buy=true;
                    itemTwo.sell=false;                    
                    itemTwo.inout = "IN";

                    itemOne.age = itemTwo.age = item.age;
                    itemOne.ageGroup = itemTwo.ageGroup = item.ageGroup;
                    itemOne.cost = itemTwo.cost = item.cost;
                    itemOne.d3Date = itemTwo.d3Date = item.d3Date;
                    itemOne.date = itemTwo.date = item.date;

                    itemOne.formattedFee = itemTwo.formattedFee = item.formattedFee;
                    itemOne.imageGridURL = itemTwo.imageGridURL = item.imageGridURL;
                   
                    itemOne.nationality = itemTwo.nationality = item.nationality;
                    itemOne.newleague = itemTwo.newleague = item.newleague;
                    itemOne.playername = itemTwo.playername = item.playername;
                    itemOne.position = itemTwo.position = item.position;
                    itemOne.previousleague = itemTwo.previousleague = item.previousleague;
                    itemOne.price = itemTwo.price = item.price;
                    itemOne.value = itemTwo.value = item.value;
                    itemOne.premClub = sellClub; 
                    itemTwo.premClub = buyClub; 

                    itemOne.from = itemTwo.from = item.from;
                    itemOne.to = itemTwo.to = item.to;
                    
                    tempArr.push(itemOne);
                    tempArr.push(itemTwo);

                    // console.log(sellClub,'---------->',buyClub)
                    // console.log(itemOne.playername, itemOne.premClub,"---------->",itemTwo.playername, itemTwo.premClub); 

                }

        }) 


    tempArr.sort(function(a, b){
        if(a[globalSortOn] < b[globalSortOn]) return -1;
        if(a[globalSortOn] > b[globalSortOn]) return 1;
        return 0;
    })   

    tempArr = _.uniqWith(tempArr, _.isEqual); // remove duplicate objects

    _.each(tempArr, function(item,i){
        item.ind = i;
        item.displayCost = getDisplayCost(item.price);
        item.timeDate = timeFormat.parse(item.d3Date);

        _.each(isoArr, function (o){
            if (o.premClub == item.premClub){ item.premClubShort = o.iso }
        })


    }) 

    var checkedArr = [];

    _.each(tempArr, function(item,i){
        item.d3Year = yy;
        _.each(isoArr, function (o){
                o.formattedName = stripSpace(item.premClub)
            if (o.premClub == item.premClub){ checkedArr.push(item) }
        })
    }) 


    return checkedArr;
}


function getD3Date(d){
    var a = d.split("/");

    var t = a[2]+'-'+a[1]+'-'+a[0]+'T12:00:00';
    
    return t; // DD/MM/YYYY Month - 1 to map against array 0-11

}


function getMonday( date ) {
    var day = date.getDay() || 7;  
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
}    


function buildListView(obj,allTransfers,customScrollTo,yy,isoArr, highestPrice){ 
    //get 2015 transfers into all transfersArr   

        var listview = new clublistPrint(obj, allTransfers, globalSortOn,customScrollTo, yy, isoArr, highestPrice);


    
}

function getZeroValueObjects(arrIn, sortStr){
// check for zero values in previous leagues and nationalitites - theses will be bundled to OTHERS
        var tempArr = [];
        var names = _.map(arrIn, sortStr);    
        var uniqleaguesArray = _.uniq(names); //, values

          _.each(uniqleaguesArray, function(one){
                    var newObj = {}
                    var tempNum = 0

                  _.each(arrIn, function(two){
                        if(one === two[sortStr]){
                              tempNum = tempNum + checkForNumber(two.price);
                              newObj[sortStr]= two[sortStr];
                              newObj["price"] = tempNum;
                            }           
                    });
                  tempArr.push (newObj);
              });
               
    return tempArr;
}


function roundDisplayNum(num,decimals) {clublistPrint
    var sign="£";
    num = (num/1000000)
    var newNum = num.toFixed(1);
    num = (newNum*1)+0;
    return (num);
}

// var elSticky = document.getElementById('filterAreaBG');
// var elStickyTop = elSticky.getBoundingClientRect().top - document.body.getBoundingClientRect().top;

// window.addEventListener('scroll', function(){

//     console.log('scroll',document.documentElement.scrollTop)
//     if (document.documentElement.scrollTop > elStickyTop){
//         elSticky.style.position = 'fixed';
//         elSticky.style.top = '100px';
//     }
//     else
//     {
//         elSticky.style.position = 'static';
//         elSticky.style.top = 'auto';
//     }
// });



iframeMessenger.enableAutoResize();

}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}



