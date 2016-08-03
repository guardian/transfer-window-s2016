/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */
var data, sort, selectArr, yAxisLabels;  

export default function scattergrid(a, s, t, rowWidth, scrollFn){
var w = 780;//document.getElementById("graphHolder").offsetWidth,
var widthUnit = 30;
var margin = {top: 60, right: 150, bottom: 60, left: 150},
              width = w - margin.left - margin.right,
              height = 800 + margin.top + margin.bottom;

          sort = s;
          data = a;
          var targetDiv = t;
          selectArr = [];

            _.each (data, function(item){
                selectArr.push(item[sort]);
            })

          selectArr = _.uniqBy(selectArr).sort().reverse();

          height = widthUnit * selectArr.length;

          yAxisLabels = selectArr; //bale out the axis labels here
            var cyPositioner = height/selectArr.length;
            var tempArr = [];

            _.each(selectArr, function(item,i){
                var tempObj = {};
                tempObj[sort] = item;
                tempObj.cy = cyPositioner*(selectArr.length-i);
               
                // item.cy = i * cyPositioner;
                tempArr.push(tempObj)
            });
          selectArr = tempArr;  
          console.log(tempArr)
          addDropDown (data,sort); 


          var x = d3.time.scale().domain([ new Date('2016-06-01'), new Date('2016-08-31') ]).rangeRound([0, width]);

          var y = d3.scale.linear().domain([0, selectArr.length]).range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis().scale(x).ticks(d3.time.months).tickSize(18, 0, 0).orient("bottom");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])

          var yAxis = d3.svg.axis().scale(y).ticks(selectArr.length).tickSize(-(width), 0, 0).tickFormat(function (d, i) { return yAxisLabels[i]; }).orient("left");  

          
        function dotClick(d,i){
            var ddEl = document.getElementsByClassName('gv-select');
            d3.selectAll(".highlight").classed("highlight", false);

            console.log(d, i);

            _.each(data, function(item,i){
              if(item[sort] == d[sort]){
                console.log(item);
                d3.select("#dot_"+i).classed("highlight",true)

                setSelectedIndex(ddEl, item[sort]);

                ddEl.selected = item[sort];
              }
                
            })
        } 
} 

function updateDots(s){
  d3.selectAll(".sell").classed("highlight", false);
     _.each(data, function(item,i){
              if(item[sort] == s){
                console.log(item[sort], s, ("#dot_"+i));
                d3.select("#dot_"+i).classed("highlight",true)
              }
            
        })

}

function getRadius(n){
        n < 1 ? n = 0 : n = n;
        n = n+5;
        return n;
}


function setSelectedIndex(s, v) {

  console.log(s[0])

    for ( var i = 0; i < s[0].length; i++ ) {

        if ( s[0][i].text == v ) {

            s[0][i].selected = true;

            return;

        }

    }

}

function addDropDown(data,sort){
        var htmlStr = "<div class='chart__dropdown-container'><div class='styled-select'><select class='gv-select'>";

        _.each(selectArr, function(item){
              htmlStr += "<option value='"+item+"'>"+item+"</option>"
        })
        htmlStr+='</select></div></div>'


        //var el = document.getElementById("dropDownSelect").innerHTML = htmlStr;
         //el.innerHTML()

        var sel = d3.select(".gv-select");

        addDropListener(sel)
}

function addDropListener(sel){
        sel.on("change", function() { updateDots(this.value) });
}

       


