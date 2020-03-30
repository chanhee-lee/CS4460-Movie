var movieArr = [];
var movieIntervalData = [];
const MINUTE = 5; 

export function radii(movieMap) {
    
    // Select svg
    var svg = d3.select('svg');
 	// Load tarantino wordcount dataset
    var wordDate = d3.csv('tarantino.csv').then(function(dataset) {
    	// Setup movie arrays 
        movieMap.forEach(element => movieArr.push(element))
        movieMap.forEach(element => {
        	// Calculate in interval 
        	var intervalData = [];
        	for (var i = 0; i < 180; i += 5) {
        		// Get profanity in interval 
        		var start = i; 
        		var end = i+5; 
        		var counter = 0;
        		// Oh god this is so inefficient so if there's time we'll find a better way to do this 
        		for (var j = 0; j < dataset.length; j++) {
        			if (dataset[j].movie === element.title && dataset[j].minutes >= start && dataset[j].minutes < end) {
        				counter++;
        			}
        		}
        		intervalData.push(counter);
        	}
        	movieIntervalData.push({"title": element.title, "intervalData": intervalData});
        })

        var color = ["#ff0000", "#ff4400", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#7f00ff"]

        var svg = d3.select('svg');

        var selector = d3.select('body')
            .append("select")
            .attr("id", "filmselector")
            .selectAll("option")
            .data(movieArr)
            .enter().append("option")
            .text(function(d) {
                return d.title;
            })
            .attr("value", function(d) {
                return d.title;
            })   

	  	// For Each Movie: Make circle 
	  	var inner = 10;
	  	var outer = 20;
	  	for (var i = 0; i < movieArr.length; i++) {
		    // Make circles based on data 
		    var arcInterval = new Array(); 	// 
		    for (var j = 0; j < 36; j++) {
		    	arcInterval.push(1);
		    }
			var data = movieIntervalData[i].intervalData;

		    createArc(arcInterval, data, inner, outer, color[i], movieArr[i].duration);
		    inner += 20; 
		    outer += 20;
	  	}
    })	
}

/**
* Creates arc for whichever movie data is passed in 
* arcInterval: Array used to set up the 180 / MINUTE (constant) minute intervals of the chart 
* data: Array of same length as arcInterval. Values contain number of profanity used in each interval.
* 		Used to calculate color affected by intensity 
* innerRadius: Inner radius size of arc
* outerRadius: Outer radius size of arc
*/
function createArc(arcInterval, data, innerRadius, outerRadius, color, movieLength) {
	var svg = d3.select("svg");
    var width = svg.attr("width");
    var height = svg.attr("height");
    var radius = Math.min(width, height) / 4;
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Generate the pie
    var pie = d3.pie();

    // Generate the arcs
    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    //Generate groups
    var arcs = g.selectAll("arc")
                .data(pie(arcInterval))
                .enter()
                .append("g")
                .attr("class", "arc")

    //Draw arc paths (separating intervals)
    arcs.append("path")
        .attr("fill", function(d, i) {
        	console.log(i);
        	return i < movieLength / MINUTE ? getColor(color, 18, data[i]) : "#000000"
        })
        .attr("d", arc);
}

/**
* Gets color based on the ratio between current interval's profanity and total profanity 
* base: Base color 
* total: Total number of profanity in movie 
* current: Number of profanity in current interval 
*/
function getColor(base, total, current) {
	var c = d3.hsl(base);
	c.s = current / total;
	return c; 
}