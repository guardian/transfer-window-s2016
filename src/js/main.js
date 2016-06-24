import reqwest from 'reqwest'
import lodash from 'lodash'
import d3 from 'd3'

import mainHTML from './text/main.html!text'
import share from './lib/share'
// import scatterplot from './lib/scatterplot'
import scattergrid from './lib/scattergrid'
import { getUniqueObjects, getAgeGroup, checkForNumber, getDisplayCost } from './lib/utils'

var _ = lodash;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

//define globals
var allTransfers;
var starTransfers;
var leaguesArray, nationalitiesArray, clubD3Data, leagueD3Data, nationD3Data, ageD3Data;


// var premClubs= [ 'Arsenal',
// 'Burnley',
// 'Bournemouth',
// 'Chelsea',
// 'Crystal Palace',
// 'Everton',
// 'Hull City',
// 'Leicester City',
// 'Liverpool',
// 'Manchester City',
// 'Manchester United',
// 'Middlesbrough',
// 'Stoke City', 
// 'Southampton',
// 'Sunderland',
// 'Swansea City',
// 'Tottenham Hotspur',
// 'West Bromwich Albion',
// 'Watford', 
// 'West Ham United'
// ];

//Add 1 of 'Hull City', 'Sheffield Wednesday',

export function init(el, context, config, mediator) {

    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    reqwest({
        url: 'https://interactive.guim.co.uk/docsdata/1VW0QYe6WqmvxIQ2MoDUaFIbztySJxLQJ9UUIGSYSaNg.json',
        type: 'json',
        crossOrigin: true,
        success: (resp) => initData(resp)
    });

    [].slice.apply(el.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click',() => shareFn(network));
    });
}


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}



function initData(r){

    allTransfers = r.sheets.Data;
    starTransfers = r.sheets.Star_Men;
    starTransfers = _.filter(starTransfers, function(o) { return o.topbuy=="y"; });

    
        _.each(allTransfers, function(item){                
                item.ageGroup = getAgeGroup(item);                
                if(item.newleague == "Premier League (England)"){ item.buy=true; item.premClub = item.to; }
                if(item.previousleague == "Premier League (England)"){ item.sell=true; item.premClub = item.from;}

                item.cost = checkForNumber(item.price);
                item.displayCost = getDisplayCost(item.price);
                item.date = randomDate(new Date(2016, 5, 1), new Date(2016, 8, 1));
                item.value = checkForNumber(item.price)+1000000;

        }) 

    buildDataView()    

  
}


function getMonday( date ) {
    var day = date.getDay() || 7;  
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
}

      
function buildDataView(){
     var scatterGrid = new scattergrid(allTransfers, 'premClub', 'graphHolder');
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

