/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */



var data, sortOn, subSortOn, selectArr, axisLabels, customScrollTo;  




function adjustLayout(n){
    var clubEl = d3.select("#gv__clubList");

    var offsetHeight = document.getElementById('filterArea').offsetHeight;

    clubEl.style("margin-top",offsetHeight+"px")
}


export default function scattergridFee(a, s, ss, t, rowWidth, scrollFn){
  var width = rowWidth > 620 ? 620 : 300; //set a maxW
  var height = rowWidth > 620 ? 120 : 120;

  customScrollTo = scrollFn;
  
  var margin = { top: 30, right: 60, bottom: 72, left: 60}, width = width - margin.left - margin.right, height = height + margin.top + margin.bottom;
          sortOn = s;
          subSortOn = ss;

          data = a;
          var targetDiv = t;
          selectArr = [];

            _.each (data, function(item){
                selectArr.push(item[sortOn]);
             })

          selectArr = _.uniqBy(selectArr).sort().reverse();

          var widthUnit = width/selectArr.length;
          
         // height = 240;
          axisLabels = selectArr; //bale out the axis labels heregetAxisLabels()


            var cyPositioner = height/selectArr.length;
            var tempArr = [];

            _.each(selectArr, function(item,i){
                var tempObj = {};
                tempObj[sortOn] = item;
                tempObj.cy = cyPositioner*(selectArr.length-i);
                tempArr.push(tempObj)
            });

          selectArr = tempArr;  
          
         // addNavList (data,sortOn); 


          // var minDate = d3.min(data, function (d) { return d.d3Date; });
          // var maxDate = d3.max(data, function (d) { return d.d3Date; });

          // console.log(minXDate, maxDate)

          var x = d3.time.scale().domain([ new Date('2016-06-15'), new Date('2016-08-31') ]).rangeRound([0, width]);

          

    //       var x = d3.scale.log()
    // .domain([.0124123, 1230.4])
    // .range([0, width]);

          var y = d3.scale.linear().domain([d3.min(data, function (d) { return d.displayCost; }), d3.max(data, function (d) { return d.displayCost; })]).range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis().scale(x).ticks(d3.time.months).tickSize(30, 0, 0).orient("bottom");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])

          var yAxis = d3.svg.axis().scale(y).ticks(5).tickSize(width+12, 0, 0).orient("right");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])   

          var svg = d3.select('#'+targetDiv).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
              .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

            svg.append("g")
                // .attr("class", "x axis")
                // .attr("transform", "translate(-1," + height + ")")
                // .call(xAxis)
             // .selectAll("text")
             //    .attr("x", 0 )
             //    .attr("y", 0 )
                // .attr("transform", "rotate(90)")
                //.style("text-anchor", "start")
              //   .attr("class", "label")
              //   .attr("x", width)
              //   .attr("y", -6)
              //   
              //   .text("Date");

            // svg.append("g")
            //     .attr("class", "y axis")

               


            // <g class="strikerate-label" transform="translate(62,72)">
            // <text class="strikerate-label" dx="10" dy="-5">
            // <tspan>More goals</tspan>
            // <tspan x="10" dy="14">per game</tspan></text>
            // <line x1="0.5" x2="0.5" y1="-10" y2="15" stroke="#bebebe" marker-start="url(#markerArrowTop)"></line>
            // <circle r="5" cy="40" stroke="#bebebe" fill="transparent"></circle>
            // <text class="strikerate-label" dx="10" dy="44">
            // <tspan>Amount of goals</tspan></text>
            // </g>


                //.call(yAxis)
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

              

        
        // add circles

        var max_r = d3.max(data.map(function (d) { return d.value; }));
        var r = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.value; })]).range([6, 30]);

        svg.selectAll(".loading").remove();

        svg.append("g")
          .attr("class", "non-highlight-circles"); 

        svg.append("g")
          .attr("class", "highlight-circles");  
        

        d3.select('#'+targetDiv+' .non-highlight-circles')
          .selectAll('circle')
          .data(data.filter(function(d, i){ return d[sortOn]!= subSortOn; })) // condition here
          .enter().append("circle")
          .attr("class", function(d) { return getDotClass(d) })
          
          .attr("id",function (d) { return "dot_"+d.ind; })
          .attr("cx", function (d) { return x(d.d3Date); })
          .attr("cy", function(d) { return y(d.displayCost); })
          
          .attr("r", function (d) { return r(d.value); })
          .on("click", function(d,i){ dotClick(d,d.ind) });
          // .attr("cy", height)
          // .transition().duration(1000).attr("cy", function(d) { return y(d.displayCost); }) 


        d3.select('#'+targetDiv+' .highlight-circles')
          .selectAll('circle')
          .data(data.filter(function(d, i){ return d[sortOn]== subSortOn; })) // condition here
          .enter().append("circle")
          .attr("class", function(d) { return getDotClass(d) })
          
          .attr("id",function (d) { return "dot_"+d.ind; })
          .attr("cx", function (d) { return x(d.d3Date); })
          .attr("cy", function(d) { return y(d.displayCost);} )
          .attr("r", function (d) { return r(d.value); })
          .on("click", function(d,i){ dotClick(d,d.ind) });
          // .attr("cy", height)
          // .transition().duration(1000).attr("cy", function(d) { return y(d.displayCost); })   

          // svg.selectAll("circle")
          //   .data(data)
          //   .enter()
          //   .append("circle")
          //   .attr("class", function(d) { return getDotClass(d)})
          //   
          //   .attr("id",function (d,i) { return "dot_"+i; })
          //   .attr("cx", function (d) { return x(d.date); })
            
          //   .attr("r", function (d) { return r(d.value); })
          //   .on("click", function(d,i){ dotClick(d,i) })
          //   .attr("cy", height)
          //   .transition().duration(1000).attr("cy", function(d) { return y(d.displayCost); });     
        //add axis

        var dateLabel = svg.append('g')
              .attr('class','strikerate-label')
              .attr("transform", "translate( "+(width)+" , "+(height+margin.bottom)+" )");

            var dateText = dateLabel.append('text')
              .attr('class','strikerate-label')
              .attr('dx',-70)
              .attr('dy',-5)

            dateText.append('tspan')
              .text('Date of signing')

            // dateText.append('tspan')
            //   .text(' ')
            //   .attr('x',10)
            //   .attr('dy',14)

            dateLabel.append('line')
              .attr('x1','-30')
              .attr('x2','-30')
              .attr('y1','0')
              .attr('y2','35')
              .attr('stroke','#bebebe')
              .attr('marker-start','url(#markerArrowTop)')
              .attr('transform','rotate(90)')

            // strikerateLabel.append('circle')
            //   .attr('r',5)
            //   .attr('cy',40)
            //   .attr('stroke','#bebebe')
            //   .attr('fill','transparent')

            // var circleText = strikerateLabel.append('text')
            //   .attr('class','strikerate-label')
            //   .attr('dx',10)
            //   .attr('dy',44)

            // circleText.append('tspan')
            //   .text('Cost of player')   


          var strikerateLabel = svg.append('g')
              .attr('class','strikerate-label')
              .attr("transform", "translate( -35 , 0 )");

            var strikeText = strikerateLabel.append('text')
              .attr('class','strikerate-label')
              .attr('dx',10)
              .attr('dy',-5)

            strikeText.append('tspan')
              .text('£')

            strikeText.append('tspan')
              .text(' ')
              .attr('x',10)
              .attr('dy',14)

            strikerateLabel.append('line')
              .attr('x1',0.5)
              .attr('x2',0.5)
              .attr('y1',-10)
              .attr('y2',15)
              .attr('stroke','#bebebe')
              .attr('marker-start','url(#markerArrowTop)')

            strikerateLabel.append('circle')
              .attr('r',5)
              .attr('cy',40)
              .attr('stroke','#bebebe')
              .attr('fill','transparent')

            var circleText = strikerateLabel.append('text')
              .attr('class','strikerate-label')
              .attr('dx',10)
              .attr('dy',44)

            circleText.append('tspan')
              .text('Cost of player')  

        function getCircPos(d){
            var t = 1;
              _.each(selectArr, function(item,i){                
                  if (d[sortOn] == item[sortOn]){ t = i };
              })
            return t;  
        }            

        function dotClick(d,i){

            var ddEl = document.getElementsByClassName('gv-select');
            d3.selectAll(".highlight").classed("highlight", false);

            _.each(data, function(item,i){
              if(item[sortOn] == d[sortOn]){
                updateDots(item[sortOn]);
                setSelectedIndex(ddEl, item[sortOn]);
                ddEl.selected = item[sortOn];
              }
                
            })
        } 

        //adjustLayout(height)
} 

function getDotClass(d){
  var newClass;
    if (d.sell){  newClass = "dot sell"  } 
    if (d.buy){  newClass = "dot buy";  }
    if (d[sortOn] == subSortOn) {  newClass = newClass+"-hl"; }

  return newClass;  
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
              if(item[sortOn] == s){
                
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

function addDropDown(data, sortOn){
        data.sort(compareObj)
        var htmlStr = "<div class='chart__dropdown-container'><div class='styled-select'><select class='gv-select'>";

        _.each(selectArr, function(item){
              htmlStr += "<option value='"+item[sortOn]+"'>"+item[sortOn]+"</option>"
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
    if (a[sortOn] < b[sortOn])
      return -1;
    if (a[sortOn] > b[sortOn])
      return 1;
    return 0;
}


function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}







       


