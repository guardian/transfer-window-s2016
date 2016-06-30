/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */



var data, sort, selectArr, axisLabels, customScrollTo;  

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

function adjustLayout(n){
    var clubEl = d3.select("#gv__clubList");

    var offsetHeight = document.getElementById('filterArea').offsetHeight;

    clubEl.style("margin-top",offsetHeight+"px")
}


export default function scattergridFee(a, s, t, rowWidth, scrollFn){
  var width = rowWidth > 620 ? 620 : rowWidth; //set a maxW
  var height = rowWidth > 620 ? 120 : 60;

  customScrollTo = scrollFn;
  
  var margin = { top: 30, right: 60, bottom: 72, left: 0}, width = width - margin.left - margin.right, height = height + margin.top + margin.bottom;

          sort = s;
          data = a;
          var targetDiv = t;
          selectArr = [];

            _.each (data, function(item){
                selectArr.push(item[sort]);
             })

          selectArr = _.uniqBy(selectArr).sort().reverse();

          var widthUnit = width/selectArr.length;
          console.log(selectArr.length)
          height = 90;
          axisLabels = selectArr; //bale out the axis labels heregetAxisLabels()


            var cyPositioner = height/selectArr.length;
            var tempArr = [];

            _.each(selectArr, function(item,i){
                var tempObj = {};
                tempObj[sort] = item;
                tempObj.cy = cyPositioner*(selectArr.length-i);
                tempArr.push(tempObj)
            });

          selectArr = tempArr;  
          
          addDropDown (data,sort); 

          var x = d3.scale.linear().domain([0, selectArr.length]).range([width, 0]);

    //       var x = d3.scale.log()
    // .domain([.0124123, 1230.4])
    // .range([0, width]);

          var y = d3.scale.linear().domain([d3.min(data, function (d) { return d.displayCost; }), d3.max(data, function (d) { return d.displayCost; })]).range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis().scale(x).ticks(axisLabels.length-1).tickSize(-(height), 6, 0).tickFormat(function (d, i) { return axisLabels[i];  }).orient("bottom"); //axisLabels[i][]

          var yAxis = d3.svg.axis().scale(y).ticks(5).tickSize(width+12, 0, 0).orient("right");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])   

          var svg = d3.select('#'+targetDiv).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
              .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(-1," + height + ")")
                .call(xAxis)
             .selectAll("text")
                .attr("x", (widthUnit/2) - 2 )
                .attr("y", 0 )
                .attr("transform", "rotate(90)")
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

            _.each(data, function(item,i){
              if(item[sort] == d[sort]){
                
                updateDots(item[sort]);

                setSelectedIndex(ddEl, item[sort]);

                ddEl.selected = item[sort];
              }
                
            })
        } 

        adjustLayout(height)
} 

function getAxisLabels(a){
  
    var reformattedArray = a.map(function(obj){ 
       var rObj = {};
       rObj.longName = obj;
       rObj.shortName = get3Letter(obj);
       return rObj;
    });
  
    return reformattedArray;

}

function get3Letter(v){
    var tempArr = v.split(" ");
    var tempStr = "";

    if(tempArr.length  == 1){ tempStr = tempArr[0].slice(0,3) }
    if(tempArr[0]=='Stoke' || tempArr[0]=='Swansea'){ tempStr = tempArr[0].slice(0,3) } 
    if(tempArr.length  == 2 && (tempArr[0]!='Stoke' || tempArr[0]!='Swansea')){ tempStr = tempArr[0].slice(0,1) + tempArr[1].slice(0,1)  }  
    if(tempArr.length  > 2){ tempStr = tempArr[0].slice(0,1) + tempArr[1].slice(0,1) + tempArr[2].slice(0,1) }      

    return tempStr.toUpperCase();

}

function updateDots(s){
  d3.selectAll(".highlight").classed("highlight", false);
     _.each(data, function(item,i){
              if(item[sort] == s){
                
                d3.select("#dot_"+i).classed("highlight",true)
              }
            
        })
     //console.log(scrollTo)
     customScrollTo(document.getElementById("listEntry_"+stripSpace(s)));

}

function getRadius(n){
        n < 1 ? n = 0 : n = n;
        n = n+5;
        return n;
}


function setSelectedIndex(s, v) {
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


function stripSpace(s){
      s = s.split(" ").join("_");
      return s;
  }





       


