/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */
var data, sort, selectArr, axisLabels;  

export default function scattergridFee(a, s, t){
var w = 620; //document.getElementById("graphHolder").offsetWidth;
var widthUnit = 22;
var margin = { top: 60, right: 150, bottom: 60, left: 150}, width = w - margin.left - margin.right, height = 100 + margin.top + margin.bottom;

          sort = s;
          data = a;
          var targetDiv = t;
          selectArr = [];

            _.each (data, function(item){
                selectArr.push(item[sort]);
            })

          selectArr = _.uniqBy(selectArr).sort().reverse();

          height = 180;

          axisLabels = selectArr; //bale out the axis labels here
            var cyPositioner = height/selectArr.length;
            var tempArr = [];

            _.each(selectArr, function(item,i){
                var tempObj = {};
                tempObj[sort] = item;
                tempObj.cy = cyPositioner*(selectArr.length-i);
                tempArr.push(tempObj)
            });

          selectArr = tempArr;  
          console.log(tempArr)
          addDropDown (data,sort); 
          
          

          var x = d3.scale.linear().domain([0, selectArr.length]).range([width, 0]);

    //       var x = d3.scale.log()
    // .domain([.0124123, 1230.4])
    // .range([0, width]);

          var y = d3.scale.linear().domain([d3.min(data, function (d) { return d.displayCost; }), d3.max(data, function (d) { return d.displayCost; })]).range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis().scale(x).ticks(selectArr.length).tickSize(-(height), 6, 0).tickFormat(function (d, i) { return axisLabels[i]; }).orient("bottom");

          var yAxis = d3.svg.axis().scale(y).ticks(5).tickSize(18, 0, 0).orient("left");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])   

          var svg = d3.select('#'+targetDiv).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
              .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

         

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
             .selectAll("text")
                .attr("x", (widthUnit/2)+6)
                .attr("y", widthUnit/2 )
                .attr("transform", "rotate(45)")
                .style("text-anchor", "start")
              //   .attr("class", "label")
              //   .attr("x", width)
              //   .attr("y", -6)
              //   
              //   .text("Date");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              // .append("text")
              //   .attr("class", "label")
              //   .attr("y", -18)
              //   .attr("x", width + 18)
              //   .attr("dy", ".71em")
              //   .style("text-anchor", "start");

            svg.append("text")
              .attr("class", "loading")
              .text("Loading ...")
              .attr("x", function () { return width/2; })
              .attr("y", function () { return height/2-5; }); 


        var max_r = d3.max(data.map(function (d) { return d.value; }));
        var r = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.value; })]).range([3, widthUnit * 0.6]);
 
          svg.selectAll(".loading").remove()

          svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function(d) { return d.sell ? "dot sell" : "dot buy"})
            //.attr("class", function(d) { return "dot"})
            .attr("id",function (d,i) { return "dot_"+i; })
            .attr("cx", function (d) { var tempCircPos = getCircPos(d); return x(tempCircPos); })
            
            .attr("r", function (d) { return r(d.value); })
            .on("click", function(d,i){ dotClick(d,i) })
            .attr("cy", height)
            .transition().duration(1000).attr("cy", function(d) { return y(d.displayCost); });;      
        

        function getCircPos(d){
            var t = 1;
              _.each(selectArr, function(item,i){                
                  if (d[sort] == item[sort]){ t = i };
              })
            return t;  
        }            

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
  d3.selectAll(".highlight").classed("highlight", false);
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
        data.sort(compareObj)
        var htmlStr = "<div class='chart__dropdown-container'><div class='styled-select'><select class='gv-select'>";

        _.each(selectArr, function(item){
              htmlStr += "<option value='"+item[sort]+"'>"+item[sort]+"</option>"
        })
        htmlStr+='</select></div></div>'


        var el = document.getElementById("dropDownSelect").innerHTML = htmlStr;
         //el.innerHTML()

        var sel = d3.select(".gv-select");

        addDropListener(sel)
}

function addDropListener(sel){
        sel.on("change", function() { updateDots(this.value) });
}

function compareObj(a,b) {
  if (a[sort] < b[sort])
    return -1;
  if (a[sort] > b[sort])
    return 1;
  return 0;
}


       


