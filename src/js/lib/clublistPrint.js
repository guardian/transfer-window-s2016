export default function clublistPrint(obj) {

    var el = document.getElementById('gv__clubList');

    

   

    var htmlStr = "<div>";
    htmlStr += constructInnerHtml(obj)
    htmlStr += "</div>"
    

    el.innerHTML = htmlStr
}

function constructInnerHtml(o){
    var s= "";

    // use _.forOwn to iterate through object
     _.forOwn(o, function(value, key) { 
         s += "<div class='gv__club-list' id=listEntry_"+stripSpace(key)+">"
         s += "<h2>"+ key+"</h2>";
         s += getPlayerList(value, key);
         s+="</div>";
     } );

     return s;
 

}

function getPlayerList(a, k){
    var buyS = "<div class='gv-flex-2'><h4>Bought</h4>";
    var sellS = "<div class='gv-flex-2'><h4>Sold</h4>";
  
    _.each(a, function(o){
        
        if(o.buy && !o.sell){
            buyS += "<span>";
            buyS += o.playername +"</br>";
            buyS += o.price;
            buyS += "</span></br>" 
        }

        if(o.sell && !o.buy){
            sellS += "<span>";
            sellS += o.playername +"</br>";
            sellS += o.price;
            sellS += "</span></br>" 
        }    
    });

    buyS += "</div>"; sellS += "</div>"; 

    return buyS + sellS;
}

function stripSpace(s){
    s = s.split(" ").join("_");
    return s;
}
