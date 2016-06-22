/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 * This bit of code was shared originally at https://gist.github.com/benjchristensen/2657838
 */
var data, sort;  

export default function scattergrid(a, s){
    var w = 940,
    h = 300,
    pad = 20,
    left_pad = 100,
    Data_url = a;
 
var svg = d3.select("#punchcard")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
 
var x = d3.scale.linear().domain([0, 23]).range([left_pad, w-pad]),
    y = d3.scale.linear().domain([0, 6]).range([pad, h-pad*2]);
 
var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(24)
        .tickFormat(function (d, i) {
            var m = (d &gt; 12) ? "p" : "a";
            return (d%12 == 0) ? 12+m :  d%12+m;
        }),
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(7)
        .tickFormat(function (d, i) {
            return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
        });
 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
    .call(xAxis);
 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+(left_pad-pad)+", 0)")
    .call(yAxis);
 
svg.append("text")
    .attr("class", "loading")
    .text("Loading ...")
    .attr("x", function () { return w/2; })
    .attr("y", function () { return h/2-5; });
 
d3.json(Data_url, function (punchcard_data) {
    var max_r = d3.max(punchcard_data.map(
                       function (d) { return d[2]; })),
        r = d3.scale.linear()
            .domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
            .range([0, 12]);
 
    svg.selectAll(".loading").remove();
 
    svg.selectAll("circle")
        .data(punchcard_data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { return x(d[1]); })
        .attr("cy", function (d) { return y(d[0]); })
        .transition()
        .duration(800)
        .attr("r", function (d) { return r(d[2]); });
});
                

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

       


