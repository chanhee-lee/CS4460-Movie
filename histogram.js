export function histogram(movieName) {
    // Select svg
   	var selected = sessionStorage.getItem("selectedMovie");
   	var interval = parseInt(sessionStorage.getItem("selectedInterval"));
   	var intervalEnd = interval + 5;


    var svg = d3.select('svg');
    var div = d3.select('div');
    
    // Get requried dimensions
    var svgWidth = parseInt(svg.style("width"));
    var svgHeight = parseInt(svg.style("height"));
    var divWidth = parseInt(div.style("width"));
    var divHeight = parseInt(div.style("height"));

    // Load tarantino wordcount dataset
    var wordDate = d3.csv('tarantino.csv').then(function(dataset) {
        
        // Saves all the movie titles from the data set to an array
        var movieTitles = [...new Set(dataset.map(item => item.movie))];
        var titleObjArr = []
        movieTitles.forEach(element => titleObjArr.push({title: element}))

        // Creates back button to go back to stackedpie.js
        var backButton = d3.select('button')
            .style('position', 'absolute')
            .style('left', '' + (divWidth / 6) + 'px')
            .style('top', '' + (divHeight / 6) + 'px')
            .on('click', function() {
                window.location.href = 'index.html';
            })
            .text('Back');

        // Movie selector
        var selector = d3.select('select')
            .style('position', 'absolute')
            .style('left', '' + (divWidth * (3/4))+ 'px')
            .style('top', '' + (divHeight / 6) + '200px')
            .selectAll("option")
            .data(titleObjArr)
            .enter().append("option")
            .text(function(d) {
                return d.title;
            })
            .attr("value", function(d) {
                return d.title;
            })
        
        // Filters the dataset to only render the currently selected film
        var selectedMovie = selected;
        var curMovie = dataset.filter(function(element) {
            return element.movie == selectedMovie
        });

        var curMinutes = -1;
        var prevMinutes = -1;
        var count = 1;
    
        // Counts each profanity instance at each minute and adds it to the dataset in order to be used for the histogram
        for (let i = 0; i < curMovie.length; i++) {
            curMinutes = curMovie[i].minutes
            if (curMinutes == prevMinutes) {
                count++;
            } else {
                count = 1;
            }
            curMovie[i].occurNum = count
            prevMinutes = curMinutes
        }

        // Set up axes, title, labels, and legend.
        var xDomain = d3.extent(curMovie, function(d) {
            return +d.minutes
        })
    
        var xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([svgWidth / 4, svgWidth * .75]);

        var yDomain = d3.extent(curMovie, function(d) {
            return +d.occurNum
        })
    
        var yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([svgHeight * (2 / 3), svgHeight * (1 / 3)]);
    
        var xAxis = d3.axisBottom(xScale)
    
        var yAxis = d3.axisLeft(yScale)
    
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (svgHeight * (2 / 3) + 10) + ')')
            .call(xAxis)
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (svgWidth / 4 - 10) + ', 0)')
            .call(yAxis)
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append("rect")
            .attr("x", (svgWidth * (7/8)) - 20)
            .attr("y", (svgHeight / 2) - 7)
            .attr("width", 7)
            .attr("height", 7)
            .style("fill", "white")
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);
        
        svg.append("rect")
            .attr("x", (svgWidth * (7/8)) - 20)
            .attr("y", (svgHeight / 2) + 13)
            .attr("width", 7)
            .attr("height", 7)
            .style("fill", "red")
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append('text')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (svgWidth * (7/8)) + ',' + (svgHeight / 2) + ')')
            .text('Word')
            .style("font", "0.75rem Lucida Sans Unicode, sans-serif")
            .style("fill", "white")
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append('text')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (svgWidth * (7/8)) + ',' + ((svgHeight / 2) + 20) + ')')
            .text('Death')
            .style("font", "0.75rem Lucida Sans Unicode, sans-serif")
            .style("fill", "white")
            .style('fill', 'white')
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(' + (svgWidth / 2) + ',' + (svgHeight / 4) + ')')
            .text('Profanity Use in ' + selectedMovie)
            .style("font", "1.5rem Lucida Sans Unicode, sans-serif")
            .attr('font-weight', 'bold')
            .style('text-align', 'center')
            .style('fill', 'white')
            .style('text-anchor', 'middle')
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append('text')
            .attr('class', 'x label')
            .attr('transform', 'translate(' + (svgWidth / 2) + ',' + (svgHeight * (2 / 3) + 60) + ')')
            .text('Minutes into Film')
            .style("font", "1.0rem Lucida Sans Unicode, sans-serif")
            .style('fill', 'white')
            .style('text-anchor', 'middle')
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        svg.append('text')
            .attr('class', 'y label')
            .attr('transform', 'translate(' + ((svgWidth / 4) - 50) + ',' + (svgHeight /2) + ') rotate(270)')
            .text('Profanity Count')
            .style("font", "1.0rem Lucida Sans Unicode, sans-serif")
            .style('fill', 'white')
            .style('text-anchor', 'middle')
            .style('opacity', 0)
            .transition()
            .duration(2200)
            .style('opacity', 1);

        // Add tooltips
    	var toolTip = d3.select('body').append('div')
    			.attr('class', 'tooltip-profanity')
    			.style('opacity', 0);

        // Draw first visualization for selected interval from stackedpie visualization.
        var circle = svg.selectAll('circle')
            .data(curMovie)
            .enter()
            .append('circle')
            .attr('cx', 320)
        	.attr('cy', 160)
            .attr('r', '0px')
            .on('mouseover', function(d) {
            	if (d.minutes < intervalEnd && d.minutes >= interval) {
            		d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 0.5);
            	} else {
            		d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 1);
            	}
            	if (d.type == 'death') {
            		var content = 'death';
            	} else {
            		var content = d.word;
            	}
	            toolTip.html(content)
	                		.style('left', (d3.event.pageX + 10) + 'px')
	                		.style('top', (d3.event.pageY - 15) + 'px');
            	toolTip.transition()
	                		.duration('800')
	                		.style('opacity', 1);
            })
            .on('mouseout', function(d) {
           		if (d.minutes < intervalEnd && d.minutes >= interval) {
           			d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 1);
           		} else {
           			d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 0.1);
           		}
            	toolTip.transition()
	                		.duration('50')
	                		.style('opacity', 0);
            })
            .transition()
            .duration(1000)
            .attr('cx', function(d) {
                return xScale(d.minutes)
            })
            .attr('cy', function(d) {
                return yScale(d.occurNum)
            })
            .attr('r', '3px')
            .attr('fill', function(d) {
                return (d.type == 'word') ? 'white' : 'red'
            })
            .style('opacity', function(d) {
            	if (d.minutes < intervalEnd && d.minutes >= interval) {
            		return 1;
            	} else {
            		return 0.1;
            	}
            });

        // Render x and y axes

        svg.selectAll("g.y.axis")
            .call(yAxis)

        svg.selectAll("g.x.axis")
            .call(xAxis);

        // Call update() to update the visualization based on selected movie.
        d3.select("#dropdown")
            .on("change", function(d) {
                selectedMovie = this.value;
                update();
            })

        // Updates the visualization with appropriate data and axes based on selected movie.
        function update() {
            var curMovie = dataset.filter(function(element) {
                return element.movie == selectedMovie
            })
        
            var curMinutes = -1;
            var prevMinutes = -1;
            var count = 1;
        
            // Counts profanity instances to stack dots on top of each other in histogram
            for (let i = 0; i < curMovie.length; i++) {
                curMinutes = curMovie[i].minutes
                if (curMinutes == prevMinutes) {
                    count++;
                } else {
                    count = 1;
                }
                curMovie[i].occurNum = count
                prevMinutes = curMinutes
            }
            
            // create x and y scales based on the runtime and max profanity instances per movie
            var xDomain = d3.extent(curMovie, function(d) {
            return +d.minutes
            })

            var xScale = d3.scaleLinear()
                .domain(xDomain)
                .range([svgWidth / 4, svgWidth * .75]);

            var yDomain = d3.extent(curMovie, function(d) {
                return +d.occurNum
            })

            var yScale = d3.scaleLinear()
                .domain(yDomain)
                .range([svgHeight * (2 / 3), svgHeight * (1 / 3)]);

            var xAxis = d3.axisBottom(xScale)

            var yAxis = d3.axisLeft(yScale)
        
            svg.selectAll("g.y.axis")
                .call(yAxis)

            svg.selectAll("g.x.axis")
                .call(xAxis);


            // Dynamically updates title based on selected movie
            svg.select(".title")
                .style('opacity', 0)
                .text('Profanity Use in ' + selectedMovie)
                .transition()
                .duration(1200)
                .style('opacity', 1);

            // Draw the circles which represent each word / death
            var circle = svg.selectAll('circle')
                .data(curMovie)
                .style('opacity', 1)
                .on('mouseover', function(d) {
            		d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 0.5);
	            	if (d.type == 'death') {
	            		var content = 'death';
	            	} else {
	            		var content = d.word;
	            	}
		            toolTip.html(content)
		                		.style('left', (d3.event.pageX + 10) + 'px')
		                		.style('top', (d3.event.pageY - 15) + 'px');
	            	toolTip.transition()
		                		.duration('800')
		                		.style('opacity', 1);
		        })
	            .on('mouseout', function(d) {
           			d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 1);
	            	toolTip.transition()
		                		.duration('50')
		                		.style('opacity', 0);
	            });

            // Remove circles that are no longer needed upon switching film
            circle.exit().remove();

            // Separates new circles from old circles. New circles transition from the center while old circles transition from previous position.
            var enter = circle.enter().append('circle')
            	.attr('cx', 320)
            	.attr('cy', 160)
                .attr('r', '0px')
                .on('mouseover', function(d) {
            		d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 0.5);
	            	if (d.type == 'death') {
	            		var content = 'death';
	            	} else {
	            		var content = d.word;
	            	}
		            toolTip.html(content)
		                		.style('left', (d3.event.pageX + 10) + 'px')
		                		.style('top', (d3.event.pageY - 15) + 'px');
	            	toolTip.transition()
		                		.duration('800')
		                		.style('opacity', 1);
		        })
	            .on('mouseout', function(d) {
           			d3.select(this).transition()
                		.duration('50')
                		.style('opacity', 1);
	            	toolTip.transition()
		                		.duration('50')
		                		.style('opacity', 0);
	            });

            circle = circle.merge(enter);

            // Add nice transition for when data updates
            circle.transition()
            .duration(1200)
            .attr('cx', function(d) {
                return xScale(d.minutes)
            })
            .attr('cy', function(d) {
                return yScale(d.occurNum)
            })
            .attr('r', '3px')
            .attr('fill', function(d) {
                    return (d.type == 'word') ? 'white' : 'red'
            });
        }
    })
}

histogram();
