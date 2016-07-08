import reqwest from 'reqwest'
import ractive from 'ractive'
import lodash from 'lodash'
import d3 from 'd3'
import iframeMessenger from './lib/iframeMessenger'
import customScrollTo from './lib/customScrollTo'

import { getUniqueObjects, getAgeGroup, checkForNumber, getDisplayCost } from './lib/utils'
import mainHTML from './text/main.html!text'
import share from './lib/share'
// import scatterplot from './lib/scatterplot'
import navlist from './lib/navList'

import clublistPrint from './lib/clublistPrint'


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
    console.log(r.sheets)

    
        _.each(allTransfers, function(item, i){  
                


                item.d3Date = getD3Date(item.date);
                console.log(item.d3Date);
                item.cost = checkForNumber(item.price);              
                item.ageGroup = getAgeGroup(item);   

                if(item.newleague == "Premier League (England)"){ item.buy=true; item.premClub = item.to; }
                if(item.previousleague == "Premier League (England)"){ item.sell=true; item.premClub = item.from;}
                item.ind = i;
                
                item.displayCost = getDisplayCost(item.price);
                item.rDate = randomDate(new Date(2016, 5, 1), new Date(2016, 8, 1));
                item.value = checkForNumber(item.price)+1000000;

        }) 

    allTransfers.sort(function(a, b){
        if(a[globalSortOn] < b[globalSortOn]) return -1;
        if(a[globalSortOn] > b[globalSortOn]) return 1;
        return 0;
    })    

    var clubArr = _.groupBy(allTransfers,'premClub') 

    //buildDataView(allTransfers, 940);

    var navList =  new navlist(clubArr, globalSortOn, customScrollTo)

    buildListView(clubArr,allTransfers, customScrollTo) 
  
}

function getD3Date(d){
    var a = d.split("/");


    return(new Date(a[2],a[1],a[0]))


}


function getMonday( date ) {
    var day = date.getDay() || 7;  
    if( day !== 1 ) 
        date.setHours(-24 * (day - 1)); 
    return date;
}

      


function buildListView(obj,allTransfers){
 
    console.log(obj)
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

