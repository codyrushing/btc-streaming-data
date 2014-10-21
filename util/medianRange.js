var _ = require("lodash");

/* 
takes an array, and returns a representative median array of values
@param arr (array) : data from which to pull range values
@param rangeSize (integer) : size of range that we want to return
@param getValue (function) : function that we use to determine how to sort the array
*/

module.exports = function(arr, rangeSize, getValue){
	var i,
		medianPoint,
		medianPointInterval,
		initialValue,
		finalValue,
		prevIndex,
		diff,
		iDiff,
		medianRange = [];

	// sort by date
	arr = _.sortBy(arr, getValue);

	if(arr.length < rangeSize){
		// if we have less than the desired # of data points, just return what we have
		medianRange = arr;
	} else {
		// get n number or representative data points			
		prevIndex = arr.length-1;
		initialValue = getValue(arr[0]);
		finalValue = getValue(arr[prevIndex]);

		medianPointInterval = (finalValue - initialValue) / (rangeSize+1);
		
		for (i=rangeSize; i>0; i--){
			// define our median points
			medianPoint = (medianPointInterval * i) + initialValue;
			diff = Infinity;
			// loop through arr backwards, starting at prevIndex, finding the data point closest to our median point
			for(prevIndex; prevIndex>-1; prevIndex--){
				iDiff = Math.abs( medianPoint - getValue(arr[prevIndex]) );
				if(iDiff > diff){
					// this means we have passed the closest item and are now getting further away from medianPoint
					// so it is safe to conclude that the previous item in the loop was our closest point
					medianRange.unshift(arr[prevIndex+1]);
					break;
				}
				diff = iDiff;
			}
		}
	}
	return medianRange;
};