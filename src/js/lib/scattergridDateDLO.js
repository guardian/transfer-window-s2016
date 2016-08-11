/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */


var data, sortOn, subSortOn, selectArr, axisLabels, customScrollTo, width, height, maxRadius, rScale , xScale, yScale, baseLineHeight, quadtree, quadroot;  

var sellNeutral = '#666'; var buyNeutral = '#AAA'; 
var sellSolid = "rgba(72,79,83, 0.75)";  var buySolid = "rgba(75,198,223,0.75)";  // #484f53

var biggestFirst = true; //should largest circles be added first?

function adjustLayout(n){
    var clubEl = d3.select("#gv__clubList");

    var offsetHeight = document.getElementById('filterArea').offsetHeight;

    clubEl.style("margin-top",offsetHeight+"px")
}


export default function scattergridFee(a, s, ss, t, rowWidth, scrollFn, maxFee){
  
  var margin = { top: 30, right: 10, bottom: 72, left: 0}, sideMargins = (margin.left+margin.right), width = width - margin.left - margin.right;
  width = rowWidth > 620 ? 620 : 300; //set a maxW
  height = rowWidth > 620 ? 66 : 66;

  height+=(margin.top+margin.bottom);

  baseLineHeight = height/2;

  customScrollTo = scrollFn;
  
  
          sortOn = s;
          subSortOn = ss;

          data = a;


          var clubsShortArray = data.map(function(obj){ 
             var rObj = obj.premClubShort;
             return rObj;
          });

          clubsShortArray =  _.uniqBy(clubsShortArray).sort().reverse();

          var targetDiv = t;

          selectArr = [];

            _.each (data, function(item){
                selectArr.push(item[sortOn]);
             })

          selectArr = _.uniqBy(selectArr).sort().reverse();

          var widthUnit = width/selectArr.length;
          
         // height = 240;
          axisLabels = selectArr; //bale out the axis labels here getAxisLabels()


            var cyPositioner = height/selectArr.length;
            var tempArr = [];

            _.each(selectArr, function(item,i){
                var tempObj = {};
                tempObj[sortOn] = item;
                tempObj.cy = cyPositioner*((selectArr.length-i)-1);
                tempArr.push(tempObj)
            });

          selectArr = tempArr;  
          
          var minDisplayCost = d3.min(data, function (d) { return d.displayCost; });

          var maxDisplayCost = d3.max(data, function (d) { return d.displayCost; });

          xScale = d3.time.scale().domain([ new Date('2016-04-30'), new Date('2016-09-05') ]).rangeRound([sideMargins, width]);

          yScale = d3.scale.linear().domain([d3.min(data, function (d) { return d.displayCost; }), d3.max(data, function (d) { return d.displayCost; })]).range([height, 0]);
          

         quadtree = d3.geom.quadtree()
              .x(function(d) { return xScale(d.x); }) 
              .y(0) //constant, they are all on the same line
              .extent([[xScale(-1),0],[xScale(2),0]]);
              //extent sets the domain for the tree
              //using the format [[minX,minY],[maxX, maxY]]
              //optional if you're adding all the data at once

         quadroot = quadtree([]);
                    //create an empty adjacency tree; 
                    //the function returns the root node.

          var y = d3.scale.ordinal().domain(clubsShortArray).rangePoints([height, 0]);

          //(d3.scale.pow().exponent(yScale)

          var xAxis = d3.svg.axis().scale(xScale).ticks(d3.time.months).tickSize( height,0,  0).orient("top");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])

          var yAxis = d3.svg.axis().scale(y).ticks(clubsShortArray.length).tickSize(width, 0).orient("left");  //.domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])   

          var svg = d3.select('#'+targetDiv).append("svg").attr("width", width + margin.left + margin.right).attr("height", height);
              // .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

          var colorScaleSell = d3.scale.linear().domain([0,maxDisplayCost])
              .range(["hsl(-35,18%,47%)","hsl(35,15%,49%)"]).interpolate(d3.interpolateHsl); 

          var colorScaleBuy = d3.scale.linear().domain([0,maxDisplayCost])
              .range(["hsl(189,86%,77%)", "hsl(189,66%,87%)"]).interpolate(d3.interpolateHsl); 

          svg.append("text")
              .attr("class", "loading")
              .text("Loading ...")
              .attr("x", function () { return width/2; })
              .attr("y", function () { return height/2-5; }); 

          svg.append("g")
             .attr("class", "non-highlight-circles"); 

          svg.append("g")
                .attr("class", "x axis")
                .attr("transform", function () { return ss == "Arsenal" ? "translate(0, "+(height+20)+" )" : "translate(0, "+height+" )"; })
                .call(xAxis);

          if(ss != "Arsenal"){      
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate("+(width-margin.left)+",0)")
                .call(yAxis);
              }  
          
                //.attr("class", "label")
                // .attr("y", height-margin.top)
                
                //.attr("dy", ".71em")
                //.style("text-anchor", "start");

            svg.selectAll(".tick")

                .each(function (d) {
                    if ( d < 0 ) {
                        this.remove();
                    }
                    if ( d === 0){

                      var zeroArea = d3.select(this);
                   
                      // this.attr("class", "tick solid_stroke")
                    }
                }); 

          

        svg.append("g")
              .attr("class", "highlight-circles")
              .attr("transform", "translate(0 ,"+(height/2)+" )");

        // add circles


        maxRadius = 0;
        var r = d3.scale.linear().domain([0, maxFee]).range([3, 21]);

        rScale = d3.scale.sqrt()  
              //make radius proportional to square root of data r
              .domain([0,maxFee])
              .range([3,30]);

        svg.selectAll(".loading").remove();

        d3.select('#'+targetDiv+' .highlight-circles').selectAll('circle')
          .data(data.filter(function(d, i){ return d[sortOn] == subSortOn; }).sort( biggestFirst ? function(a,b){return b.r - a.r;} : function(a,b){return a.r - b.r;} )) // condition here

          .enter().append("circle")
            .attr("r", function (d) { d.r = rScale(d.value); maxRadius = Math.max(d.r,maxRadius); return d.r; })
          .each(function(d, i) {
              var scaledX = xScale(d.d3Date); 
              var scaledY = yScale(d.displayCost)

              d.x = scaledX;

              d3.select(this)
                .attr("cx", scaledX)
                .attr("cy", calculateOffset(maxRadius)) //calculateOffset(maxRadius)
                .attr("id",function (d) { return "dot_"+d.ind; })
                .style("fill", function(d){ return getFill(d) })
                .style("cursor","pointer");

                // 
              quadroot.add(d);

          }).on("click", function(d,e){  dotClick(d,event) })
        

        if(ss == "Arsenal"){
            var dateLabel = svg.append('g')
              .attr('class','strikerate-label')
              .attr("transform", "translate( "+(width)+" , 0)");

            var dateText = dateLabel.append('text')
              .attr('class','strikerate-label')
              .attr('dx', 0-120)
              .attr('dy',baseLineHeight-12)

            dateText.append('tspan')
              .text('Date of signing')

            dateLabel.append('line')
              .attr('x1',baseLineHeight)
              .attr('x2',baseLineHeight)
              .attr('y1','0')
              .attr('y2',width)
              .attr('marker-start','url(#markerArrowTop)')
              .attr('transform','rotate(90)')  
          }  
        

          var strikerateLabel = svg.append('g')
              .attr('class','strikerate-label')
              .attr("transform", "translate( "+((0-margin.left)+6)+" , "+((height+margin.top)-margin.bottom)+" )");

            strikerateLabel.append('circle')
              .attr('r',5)
              .attr('cy',58)
              .attr('fill', buySolid)

            strikerateLabel.append('circle')
              .attr('r',5)
              .attr('cy',76)
              .attr('fill', sellSolid)  //colorScaleSell(Number(colorScaleSell.length/2))

            var circleTextTwo = strikerateLabel.append('text')
              .attr('class','strikerate-label')
              .attr('dx',10)
              .attr('dy',62)

            circleTextTwo.append('tspan')
              .text('Player in');    

            var circleTextThree = strikerateLabel.append('text')
              .attr('class','strikerate-label')
              .attr('dx',10)
              .attr('dy',80)

            circleTextThree.append('tspan')
              .text('Player out');

            var tooltipContainer= svg.append('g')
              .attr('class','strikerate-label')
              .style("display", "none");

            var tipBG = tooltipContainer.append('rect')
                .attr('x',0)
                .attr('y',0)
                .attr('width',90)
                .attr('height',60)
                .attr('fill','#EFEFEF')


            var titleText = tooltipContainer.append('text')
              .attr('class','strikerate-label')
              .attr('dx',10)
              .attr('dy',20)
              .text('Title here')

            var feeText = tooltipContainer.append('text')
              .attr('class','strikerate-label')
              .attr('dx',10)
              .attr('dy',40)
              .text('Title here')         

        function dotClick(d,e){
            var xPos = e.target["r"].animVal.value < (width+margin.left+margin.right)/2  ? 0 - margin.left : width - 120;
            titleText.text(d.playername); feeText.text(d.formattedFee)
            console.log(d);
            tooltipContainer.attr("transform", "translate( "+ xPos +" , "+ (e.target.cy.animVal.value-margin.top) +" )").style("display","block");
            
        } 

        function getFill(d){
          var c;

          if (d.sell){ c = sellSolid }
          if (d.buy) { c = buySolid }

          // if (d.sell && d.displayCost<1){  c = colorScaleSell(1)   } 
          // if (d.buy && d.displayCost<1){  c = colorScaleBuy(1)  }
          // if (d.sell && d.displayCost>0){  c = colorScaleSell(d.displayCost)  } 
          // if (d.buy && d.displayCost>0){  c = colorScaleBuy(d.displayCost)  }

          return c;  
        }


        function findNeighbours(root, scaledX, scaledR, maxR) {

          var padding = 4;

          //console.log("scaledR and scaledX arent't here", scaledR)

          var neighbours = [];
          //console.log("Neighbours of " + scaledX + ", radius " + scaledR);
          
          root.visit(function(node, x1, y1, x2, y2) {
            //console.log("visiting (" + x1 + "," +x2+")");
          var p = node.point; 
          if (p) {  //this node stores a data point value
              var overlap, x2=xScale(p.x), r2=rScale(p.r);        
              if (x2 < scaledX) {
                  //the point is to the left of x
                  overlap = (x2+r2 + padding >= scaledX-scaledR);
                  /*console.log("left:" + x2 + ", radius " + r2 
                              + (overlap?" overlap": " clear"));//*/
              }      
              else {
                  //the point is to the right
                  overlap = (scaledX + scaledR + padding >= x2-r2);
                  /*console.log("right:" + x2 + ", radius " + r2 
                              + (overlap?" overlap": " clear"));//*/
              }
              if (overlap) neighbours.push(p);
          }
         
          return (x1-maxR > scaledX + scaledR + padding) 
                  && (x2+maxR < scaledX - scaledR - padding) ;
            //Returns true if none of the points in this 
            //section of the tree can overlap the point being
            //compared; a true return value tells the `visit()` method
            //not to bother searching the child sections of this tree
        });
          
          return neighbours;
      }

      function calculateOffset(maxR){

          var padding = 4;

          return function(d) {
              var neighbours = findNeighbours(quadroot, xScale(d.x), rScale(d.r), maxR);


              var n=neighbours.length;
              

              _.each(neighbours, function (neighbour){
                console.log(neighbour);
              })
              var upperEnd = 0, lowerEnd = 0;      
              
              if (n){
                  //for every circle in the neighbour array
                  // calculate how much farther above
                  //or below this one has to be to not overlap;
                  //keep track of the max values
                  var j=n, occupied=new Array(n);
                  while (j--) { 
                      var p = neighbours[j];
                      var hypoteneuse = rScale(d.r)+rScale(p.r)+padding; 
                      //length of line between center points, if only 
                      // "padding" space in between circles
                      
                      var base = xScale(d.x) - xScale(p.x); 
                      // horizontal offset between centres
                      
                      var vertical = Math.sqrt(Math.pow(hypoteneuse,2) -
                          Math.pow(base, 2));
                      //Pythagorean theorem
                      
                      occupied[j]=[p.offset+vertical, p.offset-vertical];
                      //max and min of the zone occupied
                      //by this circle at x=xScale(d.x)
                  }
                  occupied = occupied.sort(
                      function(a,b){
                          return a[0] - b[0];
                      });
                  //sort by the max value of the occupied block
                  //console.log(occupied);
                  lowerEnd = upperEnd = 1/0;//infinity
                      
                  j=n;
                  while (j--){
                      //working from the end of the "occupied" array,
                      //i.e. the circle with highest positive blocking
                      //value:
                      
                      if (lowerEnd > occupied[j][0]) {  
                          //then there is space beyond this neighbour  
                          //inside of all previous compared neighbours
                          upperEnd = Math.min(lowerEnd,
                                              occupied[j][0]);
                          lowerEnd = occupied[j][1];
                      }
                      else {
                          lowerEnd = Math.min(lowerEnd,
                                              occupied[j][1]);
                      }
                  //console.log("at " + formatPercent(d.x) + ": "
                    //          + upperEnd + "," + lowerEnd);
                  }
              }
                  
                  //assign this circle the offset that is smaller
                  //in magnitude:

    
              return d.offset = 
                      (Math.abs(upperEnd)<Math.abs(lowerEnd)) ? upperEnd : lowerEnd;
          };
      }

        //adjustLayout(height)
} 




function getDotClass(d){

  var newClass;

    if (d.sell && d.displayCost<1){  newClass = "dot sell-noFee"  } 
    if (d.buy && d.displayCost<1){  newClass = "dot buy-noFee";  }
    if (d.sell && d.displayCost>0){  newClass = "dot sell"  } 
    if (d.buy && d.displayCost>0){  newClass = "dot buy";  }

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










function packCircles(t, a){
      //D3 program to fit circles of different sizes along a 
      //horizontal dimension, shifting them up and down
      //vertically only as much as is necessary to make
      //them all fit without overlap.
      //By Amelia Bellamy-Royds, in response to 
      //http://stackoverflow.com/questions/20912081/d3-js-circle-packing-along-a-line
      //inspired by
      //http://www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html
      //Freely released for any purpose under Creative Commons Attribution licence: http://creativecommons.org/licenses/by/3.0/
      //Author name and link to this page is sufficient attribution.
      
      
  //create data array//
  var svg = d3.select('#'+t).append("svg")

  var data2 = JSON.parse(dataStrikerate).map(function(pl){
    pl.x = pl.rate_good;
    pl.r = pl.goals
    pl.simpleName = pl.name.trim().replace(/[^a-zA-Z 0-9.]+/g,'').replace(/ /g, '_').replace(/-/g, '');
    
    var pattern = svg.select('defs').append('pattern')
      .attr('id','image-' + pl.simpleName)
      .attr('x',"0%")
      .attr('y',"0%")
      .attr('width','100%')
      .attr('height','100%')
      .attr('viewBox','0 0 260 260')
      // viewBox="0 0 512 512"

    // <image x="0%" y="0%" width="512" height="512" xlink:href="https://cdn3.iconfinder.com/data/icons/people-professions/512/Baby-512.png"></image>
    pattern.append('svg:image')
      .attr('x','0%')
      .attr('y','0%')
      .attr('width','260')
      .attr('height','260')
      .attr('xlink:href','https://interactive.guim.co.uk/2016/06/euros-player-pictures/' + pl.country + '/' + pl.simpleName + '.jpg')

    return pl
  });

  
      
  //Set up SVG and axis//  
  // el.style.backgroundColor = "#eee" 
  
  svg.attr('width','100%')
  var digits = /(\d*)/;
  var margin = 70; //space in pixels from edges of SVG
  var padding = 4; //space in pixels between circles
  var maxRadius = 50;
  var biggestFirst = true; //should largest circles be added first?

  var width = window.getComputedStyle(svg[0][0])["width"];
      width = digits.exec(width)[0];
  var height = 720;

  if(Number(width) < 440){
    margin = 60
    maxRadius = 36;
    padding = 1
  }
  svg.attr('height',height)

  var strikerateLabel = svg.append('g')
    .attr('class','strikerate-label')
    .attr("transform", "translate(" + width/10 + "," + height/10 + ")");

  var strikeText = strikerateLabel.append('text')
    .attr('class','strikerate-label')
    .attr('dx',10)
    .attr('dy',-5)

  strikeText.append('tspan')
    .text('More goals')

  strikeText.append('tspan')
    .text('per game')
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
    .text('Amount of goals')


  var nameContainer = svg.append('g')
    .attr('class','strikerateBox')


      
  var baselineHeight = (Number(width))/2;

  var xScale = d3.scale.linear()
          .domain([0.26,0.54])
          .range([margin,height-margin]);



  var rScale = d3.scale.sqrt()
          .domain([10,67])
          .range([10,maxRadius]);
      
  var formatPercent = d3.format(".0%");
      
  var bubbleLine = svg.append("g")
          .attr("class", "bubbles")
          .attr("transform", 
                "translate(" + baselineHeight + ",0)");
      
      bubbleLine.append("line")
          .attr("x1", xScale.range()[0])
          .attr("x2", xScale.range()[1]);
  //________________//
      
  //Create Quadtree to manage data conflicts & define functions//
      
  var quadtree = d3.geom.quadtree()
          .x(function(d) { return xScale(d.x); }) 
          .y(0) //constant, they are all on the same line
          .extent([[xScale(-1),0],[xScale(2),0]]);
      //extent sets the domain for the tree
      //using the format [[minX,minY],[maxX, maxY]]
      //optional if you're adding all the data at once

  var quadroot = quadtree([]);
            //create an empty adjacency tree; 
            //the function returns the root node.

  var maxR = 0;
  var bubblez = bubbleLine.selectAll("circle")
      .data(data2.sort(
          biggestFirst?
              function(a,b){return b.r - a.r;} :
              function(a,b){return a.r - b.r;}
          ))          
      .enter()
      .append("circle")
        .attr("r", function(d){
            var r=rScale(d.r);
            maxR = Math.max(r,maxR);
            return r;})
        // .attr('fill','url(#image-Zlatan_Ibrahimovic)')
        .attr('fill',function(d){
          return 'url(#image-' + d.simpleName + ')'
        })
        .each(function(d, i) {
            //for each circle, calculate it's position
            //then add it to the quadtree
            //so the following circles will avoid it.
            
            //console.log("Bubble " + i);
            var scaledX = xScale(d.x);            
            d3.select(this)
                .attr("cy", height - scaledX)
                .attr("cx", calculateOffset(maxR));
            quadroot.add(d);
        });

    bubblez.on('mouseenter',function(d,e,i){
      nameContainer.html(d.name + '<span>(scored ' + d.goals + ' goals in ' + d.caps + ' matches)</span>');
      var offset = this.getBoundingClientRect();
      nameContainer
        .attr('style','transform: translateY(' + offset.top + "px)")
    })

    bubblez.on('click',function(d,e,i){
      nameContainer.html(d.name + '<span>(scored ' + d.goals + ' goals in ' + d.caps + ' matches)</span>');
      var offset = this.getBoundingClientRect();
      nameContainer
        .attr('style','transform: translateY(' + offset.top + "px)")
    })
      
  // Find the all nodes in the tree that overlap a given circle.
  // quadroot is the root node of the tree, scaledX and scaledR
  //are the position and dimensions of the circle on screen
  //maxR is the (scaled) maximum radius of dots that have
  //already been positioned.
  //This will be most efficient if you add the circles
  //starting with the smallest.  
  function findNeighbours(root, scaledX, scaledR, maxR) {

      var neighbours = [];
      //console.log("Neighbours of " + scaledX + ", radius " + scaledR);
      
    root.visit(function(node, x1, y1, x2, y2) {
        //console.log("visiting (" + x1 + "," +x2+")");
      var p = node.point; 
      if (p) {  //this node stores a data point value
          var overlap, x2=xScale(p.x), r2=rScale(p.r);        
          if (x2 < scaledX) {
              //the point is to the left of x
              overlap = (x2+r2 + padding >= scaledX-scaledR);
              /*console.log("left:" + x2 + ", radius " + r2 
                          + (overlap?" overlap": " clear"));//*/
          }      
          else {
              //the point is to the right
              overlap = (scaledX + scaledR + padding >= x2-r2);
              /*console.log("right:" + x2 + ", radius " + r2 
                          + (overlap?" overlap": " clear"));//*/
          }
          if (overlap) neighbours.push(p);
      }
     
      return (x1-maxR > scaledX + scaledR + padding) 
              && (x2+maxR < scaledX - scaledR - padding) ;
        //Returns true if none of the points in this 
        //section of the tree can overlap the point being
        //compared; a true return value tells the `visit()` method
        //not to bother searching the child sections of this tree
    });
      
      return neighbours;
  }

  function calculateOffset(maxR){
      return function(d) {
          var neighbours = findNeighbours(quadroot, 
                                     xScale(d.x),
                                     rScale(d.r),
                                     maxR);
          var n=neighbours.length;
          //console.log(j + " neighbours");
          var upperEnd = 0, lowerEnd = 0;      
          
          if (n){
              //for every circle in the neighbour array
              // calculate how much farther above
              //or below this one has to be to not overlap;
              //keep track of the max values
              var j=n, occupied=new Array(n);
              while (j--) { 
                  var p = neighbours[j];
                  var hypoteneuse = rScale(d.r)+rScale(p.r)+padding; 
                  //length of line between center points, if only 
                  // "padding" space in between circles
                  
                  var base = xScale(d.x) - xScale(p.x); 
                  // horizontal offset between centres
                  
                  var vertical = Math.sqrt(Math.pow(hypoteneuse,2) -
                      Math.pow(base, 2));
                  //Pythagorean theorem
                  
                  occupied[j]=[p.offset+vertical, 
                               p.offset-vertical];
                  //max and min of the zone occupied
                  //by this circle at x=xScale(d.x)
              }
              occupied = occupied.sort(
                  function(a,b){
                      return a[0] - b[0];
                  });
              //sort by the max value of the occupied block
              //console.log(occupied);
              lowerEnd = upperEnd = 1/0;//infinity
                  
              j=n;
              while (j--){
                  //working from the end of the "occupied" array,
                  //i.e. the circle with highest positive blocking
                  //value:
                  
                  if (lowerEnd > occupied[j][0]) {  
                      //then there is space beyond this neighbour  
                      //inside of all previous compared neighbours
                      upperEnd = Math.min(lowerEnd,
                                          occupied[j][0]);
                      lowerEnd = occupied[j][1];
                  }
                  else {
                      lowerEnd = Math.min(lowerEnd,
                                          occupied[j][1]);
                  }
              //console.log("at " + formatPercent(d.x) + ": "
                //          + upperEnd + "," + lowerEnd);
              }
          }
              
              //assign this circle the offset that is smaller
              //in magnitude:
          return d.offset = 
                  (Math.abs(upperEnd)<Math.abs(lowerEnd))?
                          upperEnd : lowerEnd;
      };
    }
      
      //Create circles!/
}
