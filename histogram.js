export function histogram(movieName) {
    // Select svg
   	var selected = sessionStorage.getItem("selectedMovie");
   	var interval = parseInt(sessionStorage.getItem("selectedInterval"));
   	var intervalEnd = interval + 5;


    var svg = d3.select('svg');
    var div = d3.select('div');
    
    var svgWidth = parseInt(svg.style("width"));
    var svgHeight = parseInt(svg.style("height"));
    var divWidth = parseInt(div.style("width"));
    var divHeight = parseInt(div.style("height"));

    console.log(svgWidth)
    console.log(svgHeight)

    // Load tarantino wordcount dataset
    var wordDate = d3.csv('tarantino.csv').then(function(dataset) {
        
        var movieTitles = [...new Set(dataset.map(item => item.movie))];
        var titleObjArr = []
        movieTitles.forEach(element => titleObjArr.push({title: element}))
        console.log(titleObjArr);

        var backButton = d3.select('button')
            .style('position', 'absolute')
            .style('left', '' + (divWidth / 6) + 'px')
            .style('top', '' + (divHeight / 6) + 'px')
            .on('click', function() {
                window.location.href = 'index.html';
            })
            .text('Back');

        var selector = d3.select('body')
            .append("select")
            .attr("id", "filmselector")
            .selectAll("option")
            .data(titleObjArr)
            .enter().append("option")
            .text(function(d) {
                return d.title;
            })
            .attr("value", function(d) {
                return d.title;
            })
        
        var selectedMovie = selected;
        var curMovie = dataset.filter(function(element) {
            return element.movie == selectedMovie
        });

        var curMinutes = -1;
        var prevMinutes = -1;
        var count = 1;
    
        for (let i = 0; i < curMovie.length; i++) {
            curMinutes = curMovie[i].minutes
            if (curMinutes == prevMinutes) {
                count++;
            } else {
                count = 1;
            }
            console.log(count)
            curMovie[i].occurNum = count
            console.log(curMovie[i].occurNum)
            prevMinutes = curMinutes
        }
    
        console.log(curMovie)
    
        var xDomain = d3.extent(curMovie, function(d) {
            return +d.minutes
        })
    
        var xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([svgWidth / 4, svgWidth * .75]);

        var yDomain = d3.extent(curMovie, function(d) {
            return +d.occurNum
        })
    
        console.log(yDomain)
    
        var yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([svgHeight * (2 / 3), svgHeight * (1 / 3)]);
    
        var xAxis = d3.axisBottom(xScale)
    
        var yAxis = d3.axisLeft(yScale)
    
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + (svgHeight * (2 / 3) + 10) + ')')
            .call(xAxis)
        
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + (svgWidth / 4 - 10) + ', 0)')
            .call(yAxis)

        svg.append("rect")
            .attr("x", (svgWidth * (7/8)) - 20)
            .attr("y", (svgHeight / 8) - 7)
            .attr("width", 7)
            .attr("height", 7)
            .style("fill", "white")
        
        svg.append("rect")
            .attr("x", (svgWidth * (7/8)) - 20)
            .attr("y", (svgHeight / 8) + 13)
            .attr("width", 7)
            .attr("height", 7)
            .style("fill", "red")

        svg.append('text')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (svgWidth * (7/8)) + ',' + (svgHeight / 8) + ')')
            .text('Word')
            .attr('font-family', 'Arial')
            .attr('font-size', '12')
            .style("fill", "white");

        svg.append('text')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (svgWidth * (7/8)) + ',' + ((svgHeight / 8) + 20) + ')')
            .text('Death')
            .attr('font-family', 'Arial')
            .attr('font-size', '12')
            .style("fill", "white")
            .style('fill', 'white')

        svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(' + (svgWidth / 2) + ',' + (svgHeight / 4) + ')')
            .text('Tarantino Vulgarity Histogram')
            .attr('font-family', 'Arial')
            .attr('font-size', '16')
            .attr('font-weight', 'bold')
            .style('text-align', 'center')
            .style('fill', 'white')
            .style('text-anchor', 'middle')

        svg.append('text')
            .attr('class', 'x label')
            .attr('transform', 'translate(' + (svgWidth / 2) + ',' + (svgHeight * (2 / 3) + 50) + ')')
            .text('Minutes into Film')
            .attr('font-family', 'Arial')
            .attr('font-size', '12')
            .style('fill', 'white')
            .style('text-anchor', 'middle')

        svg.append('text')
            .attr('class', 'y label')
            .attr('transform', 'translate(' + ((svgWidth / 4) - 50) + ',' + (svgHeight /2) + ') rotate(270)')
            .text('Vulgarity Count')
            .attr('font-family', 'Arial')
            .attr('font-size', '12')
            .style('fill', 'white')
            .style('text-anchor', 'middle')

    	var toolTip = d3.select('body').append('div')
    			.attr('class', 'tooltip-profanity')
    			.style('opacity', 0);

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
            		console.log(d.minutes);
            		return 1;
            	} else {
            		return 0.1;
            	}
            });

            
        svg.selectAll("g.y.axis")
            .call(yAxis)

        svg.selectAll("g.x.axis")
            .call(xAxis);

        d3.select("#filmselector")
            .on("change", function(d) {
                selectedMovie = this.value;
                update();
            })

        
        function update() {
            var curMovie = dataset.filter(function(element) {
                return element.movie == selectedMovie
            })
        
            var curMinutes = -1;
            var prevMinutes = -1;
            var count = 1;
        
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
            
            var xDomain = d3.extent(curMovie, function(d) {
            return +d.minutes
            })

            var xScale = d3.scaleLinear()
                .domain(xDomain)
                .range([svgWidth / 4, svgWidth * .75]);

            var yDomain = d3.extent(curMovie, function(d) {
                return +d.occurNum
            })

            console.log(yDomain)

            var yScale = d3.scaleLinear()
                .domain(yDomain)
                .range([svgHeight * (2 / 3), svgHeight * (1 / 3)]);

            var xAxis = d3.axisBottom(xScale)

            var yAxis = d3.axisLeft(yScale)
        
            svg.selectAll("g.y.axis")
                .call(yAxis)

            svg.selectAll("g.x.axis")
                .call(xAxis);

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

            circle.exit().remove();

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

            circle.transition()
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
            });


        }
    })

}
histogram();
