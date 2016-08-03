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
    { premClub:'Arsenal', iso:'ARS'},
    { premClub:'Aston Villa', iso:'AV'},  
    { premClub:'Burnley', iso:'BUR'}, 
    { premClub:'Bournemouth', iso:'BOU'}, 
    { premClub:'Chelsea', iso:'CHE'}, 
    { premClub:'Crystal Palace', iso:'PAL'}, 
    { premClub:'Everton', iso:'EVE'}, 
    { premClub:'Hull City', iso:'HUL'}, 
    { premClub:'Leicester City', iso:'LEI'}, 
    { premClub:'Liverpool', iso:'LIV'}, 
    { premClub:'Manchester City', iso:'MCY'}, 
    { premClub:'Manchester United', iso:'MUN'}, 
    { premClub:'Middlesbrough', iso:'MID'}, 
    { premClub:'Newcastle United', iso:'NEW'}, 
    { premClub:'Norwich City', iso:'NOR'}, 
    { premClub:'Stoke City', iso:'STO'},  
    { premClub:'Southampton', iso:'SOT'}, 
    { premClub:'Sunderland', iso:'SUN'}, 
    { premClub:'Swansea City', iso:'SWA'}, 
    { premClub:'Tottenham Hotspur', iso:'TOT'}, 
    { premClub:'West Bromwich Albion', iso:'WBA'}, 
    { premClub:'Watford', iso:'WAT'},  
    { premClub:'West Ham United', iso:'WHU'}
 ];

var Ractive = ractive;
var _ = lodash;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

//define globals
var dataURL = 'https://interactive.guim.co.uk/docsdata/1VW0QYe6WqmvxIQ2MoDUaFIbztySJxLQJ9UUIGSYSaNg.json' 
var allTransfers;

var leaguesArray, nationalitiesArray, clubD3Data, leagueD3Data, nationD3Data, ageD3Data, rowWidth;
var globalSortOn;

//Add 1 of 'Hull City', 'Sheffield Wednesday',

export function init(el, context, config, mediator) {

    globalSortOn = 'premClub'; //initView

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
            url: dataURL,
            type: 'json',
            crossOrigin: true,
            success: (resp) => initData(resp)
        }); 



function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function initData(r){
    
    allTransfers = r.sheets.rawData;

    var tempArr = []

        _.each(allTransfers, function(item, i){  
                item.d3Date = getD3Date(item.date);
                item.cost = checkForNumber(item.price);

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
        _.each(isoArr, function (o){
            if (o.premClub == item.premClub){ item.premClubShort = o.iso }
        })

    }) 

    var clubArr = _.groupBy(tempArr,'premClub') 

    //buildDataView(allTransfers, 940);

    var navList =  new navlist(clubArr, globalSortOn, customScrollTo)

    buildListView(clubArr,tempArr, customScrollTo) 
  
}

function getD3Date(d){
    var a = d.split("/");


    return(new Date(a[2],(a[1]-1),a[0])) // DD/MM/YY Month - 1


}


function getMonday( date ) {
    var day = date.getDay() || 7;  
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
}    


function buildListView(obj,allTransfers){ 
    var listview = new clublistPrint(obj, allTransfers, globalSortOn);
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


function roundDisplayNum(num,decimals) {
    var sign="£";
    num = (num/1000000)
    var newNum = num.toFixed(1);
    num = (newNum*1)+0;
    return (num);
}

var elSticky = document.getElementById('filterAreaBG');
var elStickyTop = elSticky.getBoundingClientRect().top - document.body.getBoundingClientRect().top;

window.addEventListener('scroll', function(){

    console.log('scroll',document.documentElement.scrollTop)
    if (document.documentElement.scrollTop > elStickyTop){
        elSticky.style.position = 'fixed';
        elSticky.style.top = '100px';
    }
    else
    {
        elSticky.style.position = 'static';
        elSticky.style.top = 'auto';
    }
});





}

