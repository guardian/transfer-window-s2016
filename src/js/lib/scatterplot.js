/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */
  

export default function scatterplot(data, sort){

         addDropDown (data,sort);
          

          var margin = {top: 20, right: 24, bottom: 30, left: 24},
              width = 640 - margin.left - margin.right,
              height = 360 - margin.top - margin.bottom;

          var x = d3.time.scale().domain([ new Date('2016-05-01'), d3.time.day.offset(new Date('2015-0-01'), 1)]).rangeRound([0, width - margin.left - margin.right]);

          var y = d3.scale.linear()
              .range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis()
              .scale(x).ticks(6)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y).ticks(5).tickSize(width, 0, 0)
              .orient("right");

          var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)

            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            x.domain(d3.extent(data, function(d,i) { return (new Date(d.date)); }));
            y.domain(d3.extent(data, function(d) { return d.displayCost; })).nice();

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

        d3.selectAll(".dot").classed("highlight", false);

        console.log(d, i);

        _.each(data, function(item,i){
          if(item[sort] == d[sort]){
            console.log(item);
            d3.select("#dot_"+i).classed("highlight",true)
          }
            
        })
    } 
} 



function getRadius(n){
        n < 1 ? n = 0 : n = n;
        n = n+5;
        return n;
}


function addDropDown(data,sort){
        var htmlStr = "<select class='chart__dropdown'>";
        var selectArr = [];

        _.each (data, function(item){
            selectArr.push(item[sort]);
        })

        selectArr = _.uniqBy(selectArr).sort();

        console.log(selectArr)

        _.each(selectArr, function(item){
              htmlStr += "<option value='"+item+"'>"+item+"</option>"
        })
        htmlStr+='</select>'


        var el = document.getElementById("chart").innerHTML = htmlStr;
         //el.innerHTML()

        var dropEl = document.getElementsByClassName("chart__dropdown");

        //addDropListener(dropEl)
}

function addDropListener(sel){
        function getSelectedOption(sel) {
        var opt;
        for ( var i = 0, len = sel.options.length; i < len; i++ ) {
            opt = sel.options[i];
            if ( opt.selected === true ) {
                break;
            }
        }
        return opt;
    }
}

       


