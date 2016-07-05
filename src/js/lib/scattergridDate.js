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
  
  var margin = { top: 30, right: 60, bottom: 72, left: 60}, width = width - margin.left - margin.right, height = height + margin.top + margin.bottom;

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
          height = 240;
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
          
          addNavList (data,sort); 

          var x = d3.time.scale().domain([ new Date('2016-06-01'), new Date('2016-08-31') ]).rangeRound([0, width]);

          

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
                .attr("class", "x axis")
                .attr("transform", "translate(-1," + height + ")")
                .call(xAxis)
             // .selectAll("text")
             //    .attr("x", 0 )
             //    .attr("y", 0 )
                // .attr("transform", "rotate(90)")
                .style("text-anchor", "start")
              //   .attr("class", "label")
              //   .attr("x", width)
              //   .attr("y", -6)
              //   
              //   .text("Date");

            svg.append("g")
                .attr("class", "y axis")


            var strikerateLabel = svg.append('g')
              .attr('class','strikerate-label')
              .attr("transform", "translate( -50 , 0 )");

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


        var max_r = d3.max(data.map(function (d) { return d.value; }));
        var r = d3.scale.linear().domain([0, d3.max(data, function (d) { return d.value; })]).range([3, 30]);
 
          svg.selectAll(".loading").remove()

          svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function(d) { return d.sell ? "dot sell" : "dot buy"})
            //.attr("class", function(d) { return "dot"})
            .attr("id",function (d,i) { return "dot_"+i; })
            .attr("cx", function (d) { return x(d.date); })
            
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

        //adjustLayout(height)
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

function addNavList(data,sortOn){

        data.sort(compareObj)

        console.log(data)
    
        var htmlStr = " ";

        _.each(selectArr, function(item){
              htmlStr += "<li class='dig-filters__filter'> <a class='dig-filters__filter__link js-filter' href='#' data_section='"+stripSpace(item[sortOn])+"'>";
              htmlStr += "<span class='dig-filters__filter__link__circle showing-mobile-only' style='color: rgb(149, 28, 85);'>"
              htmlStr += "<svg class='hp-summary__toggle__icon' xmlns='http://www.w3.org/2000/svg' width='30' height='30'>" 
              htmlStr += "<path fill='currentColor' d='m 21,15 -5.25,4.5 0,-11.5 -1.5,0 0,11.5 L 9,15 l -0.5,1 5.75,6 1.5,0 5.75,-6 -0.5,-1 0,0 z'></path>" 
              htmlStr += "</svg></span>"
              htmlStr += "<span class='dig-filters__filter__link__text'>"+item[sortOn]+"</span>" 
              htmlStr += "</a></li>"
        })
        

        var el = document.getElementById("guNavList").innerHTML = htmlStr;
         //el.innerHTML()

        //var sel = d3.select(".gv-select");

        //addDropListener(sel)
        addNavListeners()
}

function addNavListeners(){

  var navLinks = document.getElementsByClassName("dig-filters__filter__link");

  for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click',  function() {
            updateDots(this.attributes.data_section.value);
  });
  }
  
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







       


