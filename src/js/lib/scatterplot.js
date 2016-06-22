/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */
var data, sort;  

export default function scatterplot(a, s ){
          sort = s;
          data = a;
          var targetDiv='graphHolder'
          addDropDown (data,sort);
          
          var margin = {top: 20, right: 24, bottom: 30, left: 24},
              width = 640 - margin.left - margin.right,
              height = 360 - margin.top - margin.bottom;

          var x = d3.time.scale().domain([ new Date('2016-05-01'), d3.time.day.offset(new Date('2015-0-01'), 1)]).rangeRound([0, width - margin.left - margin.right]);

          var y = d3.scale.linear().domain([-10, 25]).range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis()
              .scale(x).ticks(6)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y).ticks(5).tickSize(width, 0, 0)
              .orient("right");

          var svg = d3.select('#'+targetDiv).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)

            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(d3.extent(data, function(d,i) { return (new Date(d.date)); }));
            //y.domain(d3.extent(data, function(d) { return d.displayCost; })).nice();

            svg.append("g").append("rect")
              .attr("width", width)
              .attr("height",height)
              .attr("fill","#EFEFEF")

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              // .append("text")
              //   .attr("class", "label")
              //   .attr("x", width)
              //   .attr("y", -6)
              //   .style("text-anchor", "end")
              //   .text("Date");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("class", "label")
                .attr("y", -18)
                .attr("x", width+18)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("£m")

            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("id", function(d,i) { return "dot_"+i; })
                .attr("r", function(d) { return getRadius(d.displayCost); })
                .attr("class", "dot")
                .on("click", function(d,i){ dotClick(d,i) })
                .attr("cx", function(d) { return x(new Date(d.date)); })
                .attr("cy", height)
                .transition().duration(1000).attr("cy", function(d) { return y(d.displayCost); });
                
                // .on("mouseover", function(d) {
                //     if(d3.select(this).style("fill-opacity") != 0){
                //         svg.transition()        
                //             .duration(200)      
                //             .style("fill-opacity", 1);      
                //         // div .html(d.datetime.substring(0,10) )  
                //         //     .style("left", (d3.event.pageX + 5) + "px")     
                //         //     .style("top", (d3.event.pageY - 24) + "px");    
                //         }
                //     })
                //.on("mouseover", function(d){console.log(d)})
                 //return color(d.premClub)

                // var legend = svg.selectAll(".legend")
                //     .data(color.domain())
                //   .enter().append("g")
                //     .attr("class", "legend")
                //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                // legend.append("rect")
                //     .attr("x", width - 18)
                //     .attr("width", 18)
                //     .attr("height", 18)
                //     .style("fill", color);

                // legend.append("text")
                //     .attr("x", width - 24)
                //     .attr("y", 9)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "end")
                //     .text(function(d) { return d; });
   

    function dotClick(d,i){
        var ddEl = document.getElementsByClassName('gv-select');
        d3.selectAll(".dot").classed("highlight", false);

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
  d3.selectAll(".dot").classed("highlight", false);
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
        var selectArr = [];

        _.each (data, function(item){
            selectArr.push(item[sort]);
        })

        selectArr = _.uniqBy(selectArr).sort();

        console.log(selectArr)

        _.each(selectArr, function(item){
              htmlStr += "<option value='"+item+"'>"+item+"</option>"
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

       


