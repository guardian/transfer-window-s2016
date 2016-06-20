//utils
import lodash from 'lodash'
var _ = lodash;

	export function checkForNumber(numIn){
	    isNaN(numIn) ? numIn = 0 : numIn = numIn;
	    numIn = Number(numIn);
	    return numIn;
	}


	export function getDisplayCost(numIn){
	    isNaN(numIn) ? numIn = 0 : numIn = numIn;
	    numIn = Number(numIn);
	    numIn = numIn/1000000;
	    numIn == 0 ? numIn = numIn - Math.ceil((Math.random() * 10)) :  numIn = numIn;
	    console.log(numIn)
	    return numIn;
	}

	export function getAgeGroup(objIn){
      var ageGroup;
      var ageIn = parseInt(objIn.age);
         if (ageIn < 20){ ageGroup = "19 years old and younger" }
         else if(ageIn >= 19 && ageIn <= 25){ ageGroup = "20-25 years old" }  
         else if(ageIn >= 26 && ageIn <= 30){ ageGroup = "26-30 years old" } 
         if (ageIn > 30){ ageGroup = "31 years old and over" }
         	
      return ageGroup;

	}

	export function getUniqueObjects(dataset,strIn){

	  var tempArr = [];
	  var tempStr = "";
	  var tempCount;

	  var datasetSorted = _.sortBy(dataset, strIn);

	       var leaguesArray = _.countBy(dataset, function(obj){
	              
	                  var newObj = {};
	                  newObj[strIn] = obj[strIn];
	                  newObj["price"] = checkForNumber(obj.price);
	                  tempArr.push(newObj);  
	              
	        });

	   return tempArr;

	}



