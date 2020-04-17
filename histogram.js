export function histogram(movieName) {
    // Select svg
   	var selected = sessionStorage.getItem("selectedMovie");
   	var interval = parseInt(sessionStorage.getItem("selectedInterval"));
   	var intervalStart = interval - 5;
    var svg = d3.select('svg');

    // Load tarantino wordcount dataset
    var wordDate = d3.csv('tarantino.csv').then(function(dataset) {
        
        var movieTitles = [...new Set(dataset.map(item => item.movie))];
        var titleObjArr = []
        movieTitles.forEach(element => titleObjArr.push({title: element}))
        console.log(titleObjArr)

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
            .range([100,500]);
    
        var yDomain = d3.extent(curMovie, function(d) {
            return +d.occurNum
        })
    
        console.log(yDomain)
    
        var yScale = d3.scaleLinear()
            .domain(yDomain)
            .range([250, 100]);
    
        var xAxis = d3.axisBottom(xScale)
    
        var yAxis = d3.axisLeft(yScale)
    
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, 260)')
            .call(xAxis)
        
        svg.append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(80, 0)')
            .call(yAxis)

        svg.append("rect")
            .attr("x", 550)
            .attr("y", 100)
            .attr("width", 7)
            .attr("height", 7)
            .style("fill", "black")
        
        svg.append("rect")
            .attr("x", 550)
            .attr("y", 120)
            .attr("width", 7)
            .attr("height", 7)
            .style("fill", "red")

        svg.append('text')
            .attr('class', 'legend')
            .attr('transform', 'translate(565,108)')
            .text('Word')
            .attr('font-family', 'Arial')
            .attr('font-size', '12');

        svg.append('text')
            .attr('class', 'legend')
            .attr('transform', 'translate(565,128)')
            .text('Death')
            .attr('font-family', 'Arial')
            .attr('font-size', '12');

        svg.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(190,50)')
            .text('Tarantino Vulgarity Histogram')
            .attr('font-family', 'Arial')
            .attr('font-size', '16')
            .attr('font-weight', 'bold')

        svg.append('text')
            .attr('class', 'x label')
            .attr('transform', 'translate(260,300)')
            .text('Minutes into Film')
            .attr('font-family', 'Arial')
            .attr('font-size', '12');

        svg.append('text')
            .attr('class', 'y label')
            .attr('transform', 'translate(40,215) rotate(270)')
            .text('Vulgarity Count')
            .attr('font-family', 'Arial')
            .attr('font-size', '12');

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
            	if (d.minutes >= intervalStart && d.minutes < interval) {
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
	                		.duration('50')
	                		.style('opacity', 1);
            })
            .on('mouseout', function(d) {
           		if (d.minutes >= intervalStart && d.minutes < interval) {
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
                return (d.type == 'word') ? 'black' : 'red'
            })
            .style('opacity', function(d) {
            	if (d.minutes >= intervalStart && d.minutes < interval) {
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
                .range([100,500]);
        
            var yDomain = d3.extent(curMovie, function(d) {
                return +d.occurNum
            })
        
            console.log(yDomain)
        
            var yScale = d3.scaleLinear()
                .domain(yDomain)
                .range([250, 100]);
        
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
		                		.duration('50')
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
		                		.duration('50')
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
                return (d.type == 'word') ? 'black' : 'red'
            });

        }
    })

}
histogram();
