/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */

var root;          

export default function treemap(dataIn){

            _.each(dataIn.values, function(item){
              //console.log(item.values)
            });

        //     _.each(allTransfers, function(item){                
        //         item.ageGroup = getAgeGroup(item);                
        //         if(item.newleague == "Premier League (England)"){ item.buy=true; item.premClub = item.to; }
        //         if(item.previousleague == "Premier League (England)"){ item.sell=true; item.premClub = item.from;}
        //         item.cost = checkForNumber(item.price);
        //         item.value = checkForNumber(item.price)+1000000;
        // }) 

            // root = dataIn.values[1];

            root = dataIn;

            var margin = {top: 20, right: 0, bottom: 0, left: 0},
                width = 960,
                height = 500 - margin.top - margin.bottom,
                formatNumber = d3.format(",d"),
                transTime = 0,
                transitioning;

            var x = d3.scale.linear()
                .domain([0, width])
                .range([0, width]);

            var y = d3.scale.linear()
                .domain([0, height])
                .range([0, height]);

            var treemap = d3.layout.treemap()
                .children(function(d, depth) {  return depth ? null : d._children; }) //console.log(d.playername);
                .sort(function(a, b) { return a.value - b.value; })
                .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
                .round(false);

            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.bottom + margin.top)
                .style("margin-left", -margin.left + "px")
                .style("margin.right", -margin.right + "px")
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("shape-rendering", "crispEdges");

            var grandparent = svg.append("g")
                .attr("class", "grandparent");

            grandparent.append("rect")
                .attr("y", -margin.top)
                .attr("width", width)
                .attr("height", margin.top);

            grandparent.append("text")
                .attr("x", 6)
                .attr("y", 6 - margin.top)
                .attr("dy", ".75em");

              initialize(root);
              accumulate(root);
              layout(root);

              display(root);

              function initialize(root) {
                root.x = root.y = 0;
                root.dx = width;
                root.dy = height;
                root.depth = 0;
              }

              // Aggregate the values for internal nodes. This is normally done by the
              // treemap layout, but not here because of our custom implementation.
              // We also take a snapshot of the original children (_children) to avoid
              // the children being overwritten when when layout is computed.
              function accumulate(d) {

                return (d._children = d.values) ? d.value = d.values.reduce(function(p, v) { return p + accumulate(v); }, 0) : d.value;
              }

              // Compute the treemap layout recursively such that each group of siblings
              // uses the same size (1×1) rather than the dimensions of the parent cell.
              // This optimizes the layout for the current zoom state. Note that a wrapper
              // object is created for the parent node for each group of siblings so that
              // the parent’s dimensions are not discarded as we recurse. Since each group
              // of sibling was laid out in 1×1, we must rescale to fit using absolute
              // coordinates. This lets us use a viewport to zoom.

              function layout(d) {

                  switch(d._children==undefined) {
                        case false:
                            treemap.nodes({ _children: d._children });
                                d._children.forEach(function(c) {
                                    c.x = d.x + c.x * d.dx;
                                    c.y = d.y + c.y * d.dy;                    
                                    c.dx *= d.dx;
                                    c.dy *= d.dy;
                                    c.parent = d;
                                    layout(c);
                                })
                            // console.log("children")
                            break;
                        case true:
                            // console.log("no children")
                            break;
                        default:
                            // console.log("no children")
                    }
                
              }
              
              function checkForChildren(d){
                console.log(d._children.length);

                return d._children;
              }

              function display(d) {

                console.log(d)

                grandparent
                    .datum(d.parent)
                    .on("click",  transition )
                  .select("text")
                    .text("back to "+d.key);

                var g1 = svg.insert("g", ".grandparent")
                    .datum(d)
                    .attr("class", "depth");

                var g = g1.selectAll("g")
                    .data(d._children)
                  .enter().append("g");

                var nullCheck;   

                g.filter(function(d) {  return checkForChildren(d); }  ) //console.log(d._children.length > 0); 
                    .classed( "children", true )
                    .attr("id", function(d,i) { return "rect_"+i; })
                    .on("click", transition );

                // .on("click", function(d) { 
                //     if(!d.children){
                //       window.open(d.url); 
                //   }
                // })   

                g.selectAll(".child")
                    .data(function(d) { return d._children || [d]; })
                  .enter().append("rect")
                    .attr("class", "child")
                    .call(rect);

                g.append("rect")
                    .attr("class", "parent")
                    .call(rect);

                // g.append("foreignObject")
                //       .call(rect)
                //       /* open new window based on the json's URL value for leaf nodes */
                //       /* Firefox displays this on top */
                //       .on("click", function(d) { 
                //         if(!d._children){
                //           window.open(d.url); 
                //       }
                //     })
                //       .attr("class","foreignobj")
                //       .append("xhtml:div") 
                //       .attr("dy", ".75em")
                //       .html(function(d) { return d.key; })
                //       .attr("class","textdiv")
                //      .call(text);

                g.append("text")
                    .attr("class", "text-name")
                    .attr("dy", ".75em")
                    .attr("id", function(d,i) { return "textName_"+i; })
                    .text(function(d,i) { return d.key; })
                    .call(text);

                g.append("text")
                    .attr("class", "text-value")
                    .attr("dy", "1.2em")
                    .attr("id", function(d,i) { return "textVal_"+i; })
                    .text(function(d) { return roundDisplayNum(d.value); })
                    .call(text);    

                function transition(d) {

                  console.log(d)

                  //console.log(d._children.length);

                  if (transitioning || !d ) return;
                    transitioning = true;
                 

                  var g2 = display(d),
                      t1 = g1.transition().duration(transTime),
                      t2 = g2.transition().duration(transTime);

                      // Update the domain only after entering new elements.
                      x.domain([d.x, d.x + d.dx]);
                      y.domain([d.y, d.y + d.dy]);

                      // Enable anti-aliasing during the transition.
                      svg.style("shape-rendering", null);

                      // Draw child nodes on top of parent nodes.
                      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

                      // Fade-in entering text.
                      g2.selectAll("text").style("fill-opacity", 0);

                      // Transition to the new view.
                      t1.selectAll("text").call(text).style("fill-opacity", 0);
                      t2.selectAll("text").call(text).style("fill-opacity", 1);
                      t1.selectAll("rect").call(rect);
                      t2.selectAll ("rect").call(rect);

                      // Remove the old node when the transition is finished.
                      t1.remove().each("end", function() {
                        svg.style("shape-rendering", "crispEdges");
                        transitioning = false;
                      });
                }

                //use dropdown to move between views
                  d3.select("#dropdownSel").on("change", function() {
                    transTime = 0;
                      if(this.value == 'premClub'){ transition(root._children[0]); }
                      if(this.value == 'nationality'){ transition(root._children[1]); }
                      if(this.value == 'ageGroup'){ transition(root._children[2]); }
                      if(this.value == 'position'){ transition(root._children[3]); }

                    transTime = 750;  

                  });
                transition(root._children[0]);   
                // transTime = 750;
                return g;
              }

              function text(text) {
                text.attr("x", function(d) { return x(d.x) + 6; })
                    .attr("y", function(d) { return y(d.y) + 6; }) //console.log(this); 
                    .style("display","block");
              }

              function rect(rect) {
                rect.attr("x", function(d) { return x(d.x); })
                    .attr("y", function(d) { return y(d.y); })
                    .attr("rx", 6)
                    .attr("rx", 6)
                    .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
                    .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
              }

              function name(d) {
                return d.parent ? name(d.parent) + "." + d.name : d.name; 
              }

              function roundDisplayNum(num,decimals) {
                  var sign="£";
                  num = (num/1000000)
                  var newNum = num.toFixed(1);
                  num = (newNum*1)+0;
                  return (num);
              }



}  

       


