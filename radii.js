var movieArr = [];
var movieIntervalData = [];
const MINUTE = 5; 

export function radii(movieMap) {
    // Select svg
    var main = d3.select('#main');
    var svg = d3.select('svg');
 	// Load tarantino wordcount dataset
    var wordDate = d3.csv('tarantino.csv').then(function(dataset) {
    	// Setup movie arrays 
        movieMap.forEach(element => movieArr.push(element))
        movieMap.forEach(element => {
        	// Calculate in interval 
        	var intervalData = [];
        	var intervalWords = [];
        	for (var i = 0; i < 180; i += 5) {
        		// Get profanity in interval 
        		var start = i; 
        		var end = i+5; 
        		var counter = 0;
	        	var wordDict = {};
        		// Oh god this is so inefficient so if there's time we'll find a better way to do this 
        		for (var j = 0; j < dataset.length; j++) {
        			if (dataset[j].movie === element.title && dataset[j].minutes >= start && dataset[j].minutes < end) {
        				counter++;
        				if (dataset[j].word in wordDict === false) {
        					wordDict[dataset[j].word] = 1;
        				} else {
        					wordDict[dataset[j].word] += 1;
        				}
        			}
        		}
        		intervalData.push(counter);
        		intervalWords.push(wordDict);
        	}
        	movieIntervalData.push({"title": element.title, "intervalData": intervalData, "intervalWords": intervalWords});
        })
        console.log(movieIntervalData)

        // Setup Colors for Movies
        var color = ["#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#7f00ff"]

        // Setup Legend 
        // createLegend(main);

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
			var wordData = movieIntervalData[i].intervalWords;

		    createArc(arcInterval, data, wordData, inner, outer, color[i], movieArr[i].duration);
		    inner += 20; 
		    outer += 20;
	  	}
    })	
}

function createLegend(main) {
    main.append("input").attr("type", "checkbox").attr("id", "testing1");
    main.append("label").text("Reservoir Dogs").attr("style","color: #ff0000");
    main.append("input").attr("type", "checkbox").attr("id", "testing2");
    main.append("label").text("Pulp Fiction").attr("style","color: #ffa500");
}

/**
* Creates arc for whichever movie data is passed in 
* arcInterval: Array used to set up the 180 / MINUTE (constant) minute intervals of the chart 
* data: Array of same length as arcInterval. Values contain number of profanity used in each interval.
* 		Used to calculate color affected by intensity 
* innerRadius: Inner radius size of arc
* outerRadius: Outer radius size of arc
*/
function createArc(arcInterval, data, wordData, innerRadius, outerRadius, color, movieLength) {
	var svg = d3.select("svg");
    var width = svg.attr("width");
    var height = svg.attr("height");
    var radius = Math.min(width, height) / 4;
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Generate the pie
    var pie = d3.pie();

    // Generate the arcs
    var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    // Make tooltip
    var toolTip = d3.select('body').append('div')
    			.attr('class', 'tooltip-profanity')
    			.style('opacity', 0);


    //Generate groups
    var arcs = g.selectAll("arc")
                .data(pie(arcInterval))
                .enter()
                .append("g")
                .attr("class", "arc")
                .on('mouseover', function (d, i) {
                	d3.select(this).transition()
                		.duration('50')
                		.attr('opacity', '0.85');
                	if (i >= movieLength / MINUTE) {
                		toolTip.transition()
	                		.duration('50')
	                		.style('opacity', 0);
                	} else {	
	                	toolTip.transition()
	                		.duration('50')
	                		.style('opacity', 1);
	                	if (Object.keys(wordData[i].length !== 0)) {
                			var highestVal = Math.max.apply(null, Object.values(wordData[i]))
		                	var mostUsed = Object.keys(wordData[i]).find(function(a) {
		                		return wordData[i][a] === highestVal;
		                	})
		                	if (mostUsed === '') {
		                		mostUsed = 'Death';
		                	} else if (typeof mostUsed === 'undefined') {
		                		mostUsed = 'N/A';
		                	}
		                	toolTip.html('Most Common Profanity: '.bold() + mostUsed + '<br>'
		                		+ 'Total Profanity: '.bold() + data[i])
		                		.style('left', (d3.event.pageX + 10) + 'px')
		                		.style('top', (d3.event.pageY - 15) + 'px');
		                }
                	}
                })
                .on('mouseout', function (d, i) {
                	d3.select(this).transition()
                		.duration('50')
                		.attr('opacity', '1');
                	toolTip.transition()
                		.duration('50')
                		.style('opacity', 0);
                });

    //Draw arc paths (separating intervals)
    arcs.append("path")
        .attr("fill", function(d, i) {
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