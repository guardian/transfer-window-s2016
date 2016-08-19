/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */

import swoopyArrow from './swoopyArrow';

var data, sortOn, subSortOn, selectArr, axisLabels, customScrollTo, width, height, xScale, yScale;

var sellNeutral = '#666'; var buyNeutral = '#AAA'; 
var sellSolid = "rgba(0,86,137, 0.75)";  var buySolid = "rgba(75,198,223,0.75)";  // #484f53

var windowYear;

var yearsArr = [ "2016", "2015", "2014" ];

var newArr, allSeasonsArr = [];

var starManBubbles = [];

var spendingTotalsArr = [];


 function getCircleClass(d){
          var c;

          if (d.sell){ c = 'fill-sell' }
          if (d.buy) { c = 'fill-spend' } // fill-sell //fill-spend

          // if (d.sell && d.displayCost<1){  c = colorScaleSell(1)   } 
          // if (d.buy && d.displayCost<1){  c = colorScaleBuy(1)  }
          // if (d.sell && d.displayCost>0){  c = colorScaleSell(d.displayCost)  } 
          // if (d.buy && d.displayCost>0){  c = colorScaleBuy(d.displayCost)  }

          return c;  
}




export default function scatterChart(a, s, highestPrice){




  _.each(a, function(obj){
    var tempObj = {}
      tempObj.premClub = obj.premClub;
      tempObj.totalSales = 0;
      tempObj.totalPurchases = 0;
      tempObj.starMan = obj.starMan;

      spendingTotalsArr.push(tempObj)
  })




    

      // _.each(yearsArr, function(yy){

      //   newArr = [];
           
      //       _.each(a, function(item){
                
      //           var tempObj = {}
                  
      //             tempObj.ss = item.premClub;
      //             tempObj.yy = yy;
      //             tempObj.targetClip = ("scatterGrid_"+stripSpace(tempObj.ss)+"_"+yy);
      //               if(yy == "2014"){ tempObj.transfersArr = item.transfers_2014; }
      //               else if(yy == "2015"){ tempObj.transfersArr = item.transfers_2015; }
      //               else if(yy == "2016"){ tempObj.transfersArr = item.transfers_2016; }                  
                  
      //           if(tempObj.transfersArr){ newArr.push(tempObj) }   // console.log(yy,tempArr);
                  
      //         }) 
            
            
      //      console.log(yy, newArr.length)

      // })
      
  _.each(yearsArr, function(year){ // << problem here
     
     _.each(a, function(item){


            var tempObj = {};
            tempObj.ss = item.premClub;
            tempObj.copyStr = item.copyStr;
            tempObj.yy = year;
            tempObj.targetClip = ("scatterGrid_"+stripSpace(tempObj.ss)+"_"+year);
            tempObj.salesFigure = 0;
            tempObj.purchaseFigure = 0;
            if(year == "2016" && item.starMan){ tempObj.starMan = item.starMan; }
            if(year == "2014"){ tempObj.transfersArr = item.transfers_2014; }
            else if(year == "2015"){ tempObj.transfersArr = item.transfers_2015; }
            else if(year == "2016"){ tempObj.transfersArr = item.transfers_2016; } 

            _.each(tempObj.transfersArr, function(obj){
                if(obj.buy && !isNaN(obj.cost)){ tempObj.purchaseFigure+=obj.cost };
                if(obj.sell && !isNaN(obj.cost)){ tempObj.salesFigure += obj.cost };
                if(year == "2016" && obj.playername == tempObj.starMan){ obj.starMan = tempObj.starMan; }
                
            })
            addTotals(tempObj)
            addCopy(tempObj)
            packCircles(tempObj, s, tempObj.ss, tempObj.targetClip, year, highestPrice)



     })

  })




      // packCircles(newArr,)

}

function addTotals(tempObj){
  _.each(spendingTotalsArr,function(clubObj){
        if(clubObj.premClub == tempObj.ss){ 
              clubObj.totalPurchases += tempObj.purchaseFigure;
              clubObj.totalSales += tempObj.salesFigure;
        }
  })
  _.each(spendingTotalsArr,function(item){
      var n = item.totalPurchases/1000000;
      var p = item.totalSales/1000000;
      d3.select("#clubStatSpend_"+stripSpace(item.premClub)).html(n);

      
      d3.select("#clubStatSold_"+stripSpace(item.premClub)).html(p);

  })
    
}
var lipsum =" forage meggings marfa pabst portland. Waistcoat +1 gochujang pork belly, neutra health goth deep v cardigan bespoke mumblecore schlitz. Cardigan offal microdosing artisan thundercats flexitarian pop-up meggings.";

function addCopy(tempObj){
   d3.select("#clubDetails_"+stripSpace(tempObj.ss)).html(tempObj.copyStr)


   // d3.select("#playerPic_"+stripSpace(tempObj.ss))
   //  .style("background","url('https://interactive.guim.co.uk/2016/06/euros-player-pictures/England/Wayne_Rooney.jpg')")
}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}

function packCircles(obj, s, ss, t, yy, highestPrice) {

    var a = obj.transfersArr;

    //console.log("adding to --- #"+t)
    
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
    var margin = {Top:10, Right: 20, Bottom:10, Left: 40} ;
    var marginSides = margin.Right + margin.Left;
 
    var width = 290; 
    var height = 160; 

    var timeFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
    
    var svg = d3.select("#"+t).append("svg").attr("width", width).attr("height", height + margin.Top);
    
    var digits = /(\d*)/;


    //space in pixels from edges of SVG

    

    // var width = window.getComputedStyle(svg[0][0])["width"];
    //     width = digits.exec(width)[0];    

      

    
    // var height = window.getComputedStyle(svg[0][0])["height"];
    //     height = Math.min(digits.exec(height)[0], width);
        
    var baselineHeight = (margin.Top + height)/2;

    var normPriceScale = d3.scale.linear() // << PROBLEM FOUND - This is returning NaN
          .domain([ 0 , highestPrice ])
          .range([0,1]);

    yScale = d3.scale.linear()
        .domain([0, 1])
        .range([margin.Top, height-margin.Top]);


    xScale = d3.scale.linear()
        .domain([0,1])
        .range([margin.Left, width-margin.Right]);

    var startDate = timeFormat.parse(yy+'-04-20T12:00:00');
    var endDate = timeFormat.parse(yy+'-09-01T12:00:00');


    //yy+'-09-01T12:00:00';


    var dateScale = d3.time.scale.utc()  
          .domain([ startDate , endDate ])
          .range([margin.Left, width-margin.Right]);

    var normDateScale = d3.time.scale.utc() // << PROBLEM FOUND - This is returning NaN
          .domain([ startDate , endDate ])
          .range([0,1]);            

    var data = [];

    var data2 = a;
        
        _.each(data2, function (d){
            d.radius = Number(d.value/1000000) 

        });

        _.each(data2, function(d){

            var tempObj = {}

            tempObj.dataObj = d;
            tempObj.x = normDateScale(d.timeDate),  // < problem here???
            tempObj.y = normPriceScale(d.cost), // < problem here???
            tempObj.r = d.radius;
            
            tempObj.buy = d.buy;
            tempObj.sell = d.sell;
            tempObj.starMan = d.starMan ? true : false;

            data.push(tempObj)

        })

                  //x for x-position
                  //r for radius; value will be proportional to area  
                  //________________//
                      
                  //Set up SVG and axis//   
                  
                  
                  var padding = 1; //space in pixels between circles
                  var minRadius = 4, maxRadius = 11;
                  var biggestFirst = true; //should largest circles be added first?
                  var baseLineHeight = height/2;
                  

                  var rScale = d3.scale.sqrt()  
                          //make radius proportional to square root of data r
                          .domain([1,maxRadius])
                          .range([minRadius,maxRadius]);
                      
                  var formatPercent = d3.format(".0%");

                  var xAxis = d3.svg.axis()
                      .scale(dateScale) // << problem here ??
                      .orient("top")
                      .ticks(d3.time.months, 1)
                      .tickSize( height, 0,  0).orient("top")
                      .tickFormat(d3.time.format("%b"));
                      
                  svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform",  "translate(0, "+(height+20)+" )") //PICK OUT FIRST ENTRY -function () { return ss == "Arsenal" ? "translate(0, "+(height+20)+" )" : "translate(0, "+height+" )"; }
                      .call(xAxis);                      
                 
                      var dateLabel = svg.append('g')
                        .attr('class','strikerate-label')
                        .attr("transform", "translate( 0 , 0)");
                         

                      var dateText = dateLabel.append('text')
                        .attr('class','strikerate-label neutral-txt')
                        .attr('dx', 0)
                        .attr('dy',17)
                        .style('font-weight','600')
 
                      dateText.append('tspan')
                        .text(yy)

                      var spentText = dateLabel.append('text')
                        .attr('class','strikerate-label buy')
                        .attr('dx', 0)
                        .attr('dy',34)

                      spentText.append('tspan')
                        .text("m")  

                      var soldText = dateLabel.append('text')
                        .attr('class','strikerate-label sell')
                        .attr('dx', 0)
                        .attr('dy',51)

                      soldText.append('tspan')
                        .text("m")

                      // var divider = dateLabel.append('line')
                      //   .attr('x1',0)
                      //   .attr('x2',0)
                      //   .attr('y1',2)
                      //   .attr('y2',68)  

                      // dateLabel.append('line')
                      //   .attr('x1',baseLineHeight)
                      //   .attr('x2',baseLineHeight)
                      //   .attr('y1','0')
                      //   .attr('y2',width)
                      //   .attr('marker-start','url(#markerArrowTop)')
                      //   .attr('transform','rotate(90)')  
                        

                  var threads = svg.append("g")
                      .attr("class", "threads");

                      
                  var bubbleLine = svg.append("g")
                          .attr("class", "bubbles")
                          .attr("transform", 
                                "translate(0," + baselineHeight + ")");
                      
                      bubbleLine.append("line")
                          .attr("x1", xScale.range[0])
                          .attr("x2", xScale.range[1]);
                  //________________//
                      

                  var nameContainer = svg.append('g')
                            .attr('class','strikerateBox')
                            .style('pointer-events','none')
                            .style("display","none");
                  var rectangle = nameContainer.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", width/2)
                            .attr("height", 54)
                            .style("fill","rgba(255,255,255,0.7)")
                            // .style("stroke","#EEE")
                            // .style("stroke-width","1px")
                            .style("shape-rendering","crisp-edges");

                  var plName = nameContainer.append('text')
                        .attr('class','strikerate-title')
                        .attr('dx', 3)
                        .attr('dy', 17)

                      plName.append('tspan')
                        .text(' ')

                  var plFee = nameContainer.append('text')
                        .attr('class','strikerate-fee')
                        .attr('dx', 3)
                        .attr('dy', 35)

                      plFee.append('tspan')
                        .text(' ')

                  var plDetails = nameContainer.append('text')
                        .attr('class','strikerate-fee')
                        .attr('dx', 3)
                        .attr('dy', 51)

                      plDetails.append('tspan')
                        .text(' ')
      

                   //Create Quadtree to manage data conflicts & define functions//   
                  var quadtree = d3.geom.quadtree()
                          .x(function(d) {return xScale(d.x); }) 
                          .y(0) //constant, they are all on the same line
                          .extent([[xScale(0),0],[xScale(1),0]]);  //<< problem could be here ???
                      //extent sets the domain for the tree
                      //using the format [[minX,minY],[maxX, maxY]]
                      //optional if you're adding all the data at once
                      // console.log([[xScale(-1),0],[xScale(2),0]])


                  var quadroot = quadtree([]);
                            //create an empty adjacency tree; 
                            //the function returns the root node.
                      
                  // Find the all nodes in the tree that overlap a given circle.
                  // quadroot is the root node of the tree, scaledX and scaledR
                  //are the position and dimensions of the circle on screen
                  //maxR is the (scaled) maximum radius of dots that have
                  //already been positioned.
                  //This will be most efficient if you add the circles
                  //starting with the smallest.  


                  d3.selectAll('g.tick')
                        .filter(function(d){ var m = d.getMonth(); return m==8;  } ) //words = text.text().split(/\s+/)return d=='Sep';

                          .select('line') //grab the tick line
                          // .attr('marker-end','url(#markerArrowTop)')
                          .style('stroke-dasharray','none')
                          .style('stroke-width', 1); //or style directly with attributes or inline styles 

                  d3.selectAll('g.tick')
                        .filter(function(d){ var m = d.getMonth(); return m==8;  } ) //words = text.text().split(/\s+/)return d=='Sep';

                          .select('text').text("window closed")
                            //grab the tick line
                          .attr('x',0-(height*0.75))
                          .attr('y', -6)
                          .attr('transform','rotate(90)')
                          .style('text-anchor','start');


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
                                  
                                  occupied[j]=[p.offset + vertical, 
                                               p.offset - vertical];
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
                  
                  

                      //Create circles!//
                  var maxR = 0;
                  var sellNum = 0;
                  var spendNum = 0;

                  bubbleLine.selectAll("circle")
                      .data(data.sort(
                          biggestFirst?
                              function(a,b){return b.r - a.r;} :
                              function(a,b){return a.r - b.r;}
                          ))          
                      .enter()
                          .append("circle")
                          .attr("r", function(d){
                              var r = rScale(d.r);
                              maxR = Math.max(r,maxR);
                              return r;})


                          .each(function(d, i) { 


                            if(d.sell){ sellNum+=d.dataObj.cost}
                            if(d.buy){ spendNum+=d.dataObj.cost}

                              //for each circle, calculate it's position
                              //then add it to the quadtree
                              //so the following circles will avoid it.
                              
                              //console.log("Bubble " + i);

                              var scaledX = xScale(d.x);  
                              var offSetY = calculateOffset(maxR);

                              var currBubble = d3.select(this)
                                  .attr("cx", scaledX)
                                  
                                  // .transition().delay(300*i).duration(250)
                                  .attr("cy", offSetY)
                                  //.attr("cy", d.y)
                                  .attr("class", function(d){ return getCircleClass(d) })
                                  .style("fill-opacity","0.6")
                                  .on("mouseenter", function(d,e,i){  
                                      // nameContainer.html(d.playername + '<span>(from ' + d.to + ' goals in ' + d.from + ' matches)'+ d.formattedFee+'</span>');
                                     
                                      var newName = d.dataObj.playername; 
                                      var newFee = d.dataObj.formattedFee; 

                                      var newX = scaledX > width/2 ? width/2 : scaledX;
                                      var newY = currBubble.attr('cy') < 0 ? height*0.6 : 0;

                                      
                                      var detailTxt = d.dataObj.buy ? 'from '+ d.dataObj.from : 'to '+d.dataObj.to;

                                      if (detailTxt == 'to ' || detailTxt == 'from '){ detailTxt = " "}; 

                                      nameContainer
                                            // .transition().delay(100).duration(1000)
                                            .attr('style','transform: translate( ' + newX +'px, '+newY+'px )');
                                            plName.text(newName);
                                            plFee.text(newFee);
                                            plDetails.text(detailTxt)
                                              // .call(textWrap, 100);

                                   })
                                  .on("mouseleave", function(){
                                     nameContainer
                                            .attr('style','display : none ');
                                  });

                             //if(d.starMan){  annotate(d, currBubble) }     

                              // function annotate(d){

                              //   var xCoord = (d.x * width)
                              //   var yCoord = (d.y * height)
                              //   console.log(bubble.attr('cx'))

                              //   console.log("["+xCoord+"],["+yCoord+"] --- ["+(d.x * width)+"],["+(d.y * height+"]")

                              //   svg.append("path")
                                
                              //   var swoopy = swoopyArrow()
                              //       .angle(Math.PI/4)
                              //       .x(function(d) { return d[0]; })
                              //       .y(function(d) { return d[1]; });

                              //     svg.append("path")
                              //       .attr('marker-end', 'url(#markerArrowTop)') 
                              //       .datum([[0,0],[xCoord,xCoord]])                                  
                              //       //.datum([ [ xCoord, yCoord ] , [ 0, height ]])
                              //       .attr('fill','none')
                              //       .attr('stroke','black')
                              //       .attr("d", swoopy);
                              // }


                              quadroot.add(d);
                              
                              // bubbleLine.append("text")
                              //     .attr("x", scaledX)
                              //     .attr("y", d.offset)
                              //     .text(i);
                              
                              //add a drop line from the centre of this
                              //circle to the axis

                              // threads.append("line").datum(d)
                              //     .attr({x1:scaledX, x2:scaledX, y2:margin})
                              //     .attr("y1", margin)
                              //     .style("stroke-width",1)
                              //     .transition().delay(300*i).duration(250)
                              //     .attr("y1", (baselineHeight+d.offset));
                          });
                          
                         //
                         
                          spentText.text(a.length>0 ? spendNum/1000000 : "Not in Premier League").attr("class" , a.length>0 ? "strikerate-label buy" : "strikerate-label"); 
                          soldText.text(a.length>0 ? sellNum/1000000 : " ")
                          //

                          //console.log(ss, yy, a)

                          
                            
       
}


function textWrap(text, width) {

  console.log(text)
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}








