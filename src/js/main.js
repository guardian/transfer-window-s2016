import reqwest from 'reqwest'
import lodash from 'lodash'
import d3 from 'd3'

import mainHTML from './text/main.html!text'
import share from './lib/share'
import treemap from './lib/treemap'
import { getUniqueObjects, getAgeGroup, checkForNumber } from './lib/utils'

var _ = lodash;
var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

//define globals
var allTransfers;
var starTransfers;
var leaguesArray, nationalitiesArray, clubD3Data, leagueD3Data, nationD3Data, ageD3Data;
var premClubs= [ 'Arsenal',
'Burnley',
'Bournemouth',
'Chelsea',
'Crystal Palace',
'Everton',
'Hull City',
'Leicester City',
'Liverpool',
'Manchester City',
'Manchester United',
'Middlesbrough',
'Stoke City', 
'Southampton',
'Sunderland',
'Swansea City',
'Tottenham Hotspur',
'West Bromwich Albion',
'Watford', 
'West Ham United'
];

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


function initData(r){

    allTransfers = r.sheets.Data;
    starTransfers = r.sheets.Star_Men;
    starTransfers = _.filter(starTransfers, function(o) { return o.topbuy=="y"; });

    
        _.each(allTransfers, function(item){                
                item.ageGroup = getAgeGroup(item);                
                if(item.newleague == "Premier League (England)"){ item.buy=true; item.premClub = item.to; }
                if(item.previousleague == "Premier League (England)"){ item.sell=true; item.premClub = item.from;}
                item.cost = checkForNumber(item.price);
                item.value = checkForNumber(item.price)+1000000;
        }) 

    buildNest(['premClub','nationality','ageGroup','position'])
  
}



function buildNest(a){

  var tempArr = [];
  
  var root = {};

  root.key = 'DATA'
    
      // Build an object for each of the sort vars in a

      _.forEach(a, function (s,count){

        var parent = {};

        // var valObj =  _.chain(allTransfers)
        //       .groupBy(s)
        //       .map(function(value, key) {
        //         //console.log(key,value)

        //           return {
        //               key: key,
        //               //areaVal: 1000000,
        //               values: value
        //           }
        //       })
        //   .value();

        // _.forEach(valObj, function(o) { console.log(o); });

          var nested_data = d3.nest()
              .key(function(d)  { return d[s]; })
              //.rollup(function(leaves) { return { leaves, "length": leaves.length, "value": d3.sum(leaves, function(d) {return d.value;})} })
            
              .key(function(d)  { return d.playername; })
              //.value( function(d) {  console.log ("work out her/ something to do with d3 rollup"); return {"areaVal": d3.sum(leaves, function(d) { return parseFloat(d.value); })} })
          .entries(allTransfers);
   

          var valTotal = d3.nest()
              .key(function(d)  { return d[s]; })
              .rollup(function(leaves) { return { leaves, "length": leaves.length, "value": d3.sum(leaves, function(d) {return d.value;})} })
            
              //.key(function(d)  { return d.playername; })
              //.value( function(d) {  console.log ("work out her/ something to do with d3 rollup"); return {"areaVal": d3.sum(leaves, function(d) { return parseFloat(d.value); })} })
          .entries(allTransfers);
          
          console.log(valTotal)

           parent.key = s;
           parent.values = nested_data;
           
          tempArr.push(parent)
          
      })
      
      root.values = tempArr;
      console.log(root)

      var tree = new treemap(root);
      //var tree = new treemap(root);

      // Change the key names and children values from .next and add values for a chosen column to define the size of the blocks

      // DEBUG
      // document.getElementById("rawdata").innerHTML=JSON.stringify(root);

     
      
}




function getZeroValueObjects(arrIn, sortStr){
// check for zero values in previous leagues and nationalitites - theses will be bundled to OTHERS
        var tempArr = [];
        var names = _.map(arrIn, sortStr);    
        var uniqleaguesArray = _.uniq(names);//, values

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

