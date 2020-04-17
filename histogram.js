export function histogram() {
    // Select svg
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
        
        d3.select("#filmselector")
            .on("change", function(d) {
                selectedMovie = this.value;
                update();
            })

        var selectedMovie = "Reservoir Dogs"

        update();
        
        function update() {
            var svgWidth = parseInt(svg.style("width"))
            console.log(svgWidth)
            var svgHeight = parseInt(svg.style("height"))
            console.log(svgHeight)

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
        
            var circle = svg.selectAll('circle')
                .data(curMovie)
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

                circle.enter()
                .append('circle')
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
                
            circle.exit().remove()

            svg.selectAll("g.y.axis")
                .call(yAxis)

            svg.selectAll("g.x.axis")
                .call(xAxis);
        }
    })

}
