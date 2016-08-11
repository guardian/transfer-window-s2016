/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */

var data, sortOn, subSortOn, selectArr, axisLabels, customScrollTo, width, height, xScale, yScale;

var sellNeutral = '#666'; var buyNeutral = '#AAA'; 
var sellSolid = "rgba(72,79,83, 0.75)";  var buySolid = "rgba(75,198,223,0.75)";  // #484f53

var windowYear;

var yearsArr = [ "2016", "2015", "2014" ];

var newArr, allSeasonsArr = [];

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




export default function scatterChart(a, s){

  console.log(a)

    

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
      
  _.each(yearsArr, function(year){
     
     _.each(a, function(item){
            var tempObj = {};
            tempObj.ss = item.premClub;
            tempObj.yy = year;
            tempObj.targetClip = ("scatterGrid_"+stripSpace(tempObj.ss)+"_"+year);

            if(year == "2014"){ tempObj.transfersArr = item.transfers_2014; }
            else if(year == "2015"){ tempObj.transfersArr = item.transfers_2015; }
            else if(year == "2016"){ tempObj.transfersArr = item.transfers_2016; } 

            packCircles(tempObj.transfersArr, s, tempObj.ss, tempObj.targetClip, year)

     })

  })




      // packCircles(newArr,)

}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}

function packCircles(a, s, ss, t, yy) {

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
    var margin = 40;
    var width = 300; 
    var height = 100; 
    
    var svg = d3.select("#"+t).append("svg").attr("width", width).attr("height", height+margin);
    


    var digits = /(\d*)/;
    //space in pixels from edges of SVG

    

    // var width = window.getComputedStyle(svg[0][0])["width"];
    //     width = digits.exec(width)[0];    

      

    height+=margin;
    // var height = window.getComputedStyle(svg[0][0])["height"];
    //     height = Math.min(digits.exec(height)[0], width);
        
    var baselineHeight = (margin + height)/2;

    var xScale = d3.scale.linear()
        .domain([0,1])
        .range([margin, width-margin]);
    var startDate = new Date("'"+yy+"-04-30'")
    var endDate = new Date("'"+yy+"-09-01'");

    var dateScale = d3.time.scale.utc()  
          .domain([ startDate , endDate ])
          .range([margin, width-margin]);

    var normDateScale = d3.time.scale.utc()
          .domain([ new Date("'"+yy+"-04-30'"), new Date("'"+yy+"-09-01'") ])
          .range([0,1]);            

    var data = [];

    var data2 = a;

        _.each(data2, function (d){
            d.radius = Number(d.value/1000000)
        });

        _.each(data2, function(d){
            var tempObj = {}

            tempObj.dataObj = d;
            tempObj.x = normDateScale(d.d3Date), // < problem here???
            tempObj.r = d.radius;
            
            tempObj.buy = d.buy;
            tempObj.sell = d.sell;


            data.push(tempObj)
        })

       

            

                  //x for x-position
                  //r for radius; value will be proportional to area  
                  //________________//
                      
                  //Set up SVG and axis//   
                  
                 
                  var padding = 4; //space in pixels between circles
                  var minRadius = 5, maxRadius = 15;
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
                      .attr("transform", function () { return ss == "Arsenal" ? "translate(0, "+(height+20)+" )" : "translate(0, "+height+" )"; })
                      .call(xAxis);                      
                 
                      var dateLabel = svg.append('g')
                        .attr('class','strikerate-label')
                        .attr("transform", "translate( 0 , 0)");

                      var dateText = dateLabel.append('text')
                        .attr('class','strikerate-label')
                        .attr('dx', 0)
                        .attr('dy',17)
                        .style('font-weight','600')

                      dateText.append('tspan')
                        .text(yy)

                      var spentText = dateLabel.append('text')
                        .attr('class','strikerate-label spent')
                        .attr('dx', 0)
                        .attr('dy',34)
                        .style('fill', '#4bc6df')

                      spentText.append('tspan')
                        .text("m")  

                      var soldText = dateLabel.append('text')
                        .attr('class','strikerate-label sold')
                        .attr('dx', 0)
                        .attr('dy',51)
                        .style('fill', 'rgb(72, 79, 83)')

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
                            .attr("width", 120)
                            .attr("height", 45)
                            .style("fill","#FFF")
                            .style("stroke","#999")
                            .style("stroke-width","1px")
                            .style("shape-rendering","crisp-edges");

                  var plName = nameContainer.append('text')
                        .attr('class','strikerate-title')
                        .attr('dx', 6)
                        .attr('dy', 15)

                      plName.append('tspan')
                        .text(' ')

                  var plFee = nameContainer.append('text')
                        .attr('class','strikerate-fee')
                        .attr('dx', 6)
                        .attr('dy', 36)

                      plFee.append('tspan')
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

                              console.log(d.dataObj.playername, d.x, scaledX)
                              d3.select(this)
                                  .attr("cx", scaledX)
                                  // .attr("cy", -baselineHeight)
                                  // .transition().delay(300*i).duration(250)
                                  .attr("cy", calculateOffset(maxR))
                                  .style("fill", function(d){ return getFill(d) })
                                  .on("mouseenter", function(d,e,i){  
                                      // nameContainer.html(d.playername + '<span>(from ' + d.to + ' goals in ' + d.from + ' matches)'+ d.formattedFee+'</span>');
                                      var offset = this.getBoundingClientRect();
                                      var newName = d.dataObj.playername; 
                                      var newFee = d.dataObj.formattedFee; 

                                      var newX = scaledX > width-120 ? width-120 : scaledX ;

                                      nameContainer
                                            .attr('style','transform: translateX( ' + newX +'px )');
                                            plName.text(newName);
                                            plFee.text(newFee);
                                   })
                                  .on("mouseleave", function(){
                                     nameContainer
                                            .attr('style','display : none ');
                                  });


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
                          spentText.text(spendNum/1000000)
                          soldText.text(sellNum/1000000)
                          //console.log(quadroot)
                            
       
}










