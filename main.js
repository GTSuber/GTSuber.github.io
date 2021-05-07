//Name: Joshua Suber
//Class: Information Visualization
//Semester: Spring 2021

//global variables 
var selectedOption = 'imdb_score';
var dropdown_attributes = ["imdb_score", "duration", "budget", "gross", "movie_facebook_likes", 
                            "cast_total_facebook_likes", "director_facebook_likes", "facenumber_in_poster"]
var grid;
var div;
var movie_group;
var tooltip;

//load movies dataset
d3.csv('movies.csv', function(dataset) {

  // add the options to the button
  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(dropdown_attributes)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  updateGrid("imdb_score")

  function updateGrid(filter) {
    var gridData = function(d) {
      var data = new Array();
      //movie data 
      var movies = dataset;
      //var attribute = movies.map(function(d) { return d[filter]});
      console.log(selectedOption)
      var imdb = movies.map(function(d) { return d["imdb_score"]});
      var filter_name = filter;
      var movie_filter = movies.map(function(d) { return d[filter]});
      var title = movies.map(function(d) { return d["movie_title"]});
      var content_rating = movies.map(function(d) { return d["content_rating"]});
      var title_year = movies.map(function(d) { return d["title_year"]});
      var country = movies.map(function(d) { return d["country"]});
      var language = movies.map(function(d) { return d["language"]});
      var genre = movies.map(function(d) { return d["genres"]});
      var plot = movies.map(function(d) { return d["plot_keywords"]});
      var director = movies.map(function(d) { return d["director_name"]});
      var actor_one = movies.map(function(d) { return d["actor_1_name"]});
      var actor_two = movies.map(function(d) { return d["actor_2_name"]});
      var actor_three = movies.map(function(d) { return d["actor_3_name"]});

      console.log(imdb);
      var color = updateColor(filter, movie_filter)
      //starting x and y positions
      var xpos = 1;
      var ypos = 1;
      //height and width of the squares 
      var width = 21;
      var height = 21;
      //click
      var click = 0;
      //count 
      var count = 0;
      //iterate for rows 
      for (var row = 0; row < 25; row++) {
        data.push(new Array());

        //iterate for cells/coumns inside rows 
        for (var column = 0; column < 60; column++) {
          data[row].push({
            x: xpos, 
            y: ypos, 
            width: width, 
            height: height,
            click: click,
            imdb: imdb[count],
            highlight: imdb[count],
            highlight_name: filter_name,
            hover: movie_filter[count],
            color: color(movie_filter[count]),
            title: title[count],
            rating: content_rating[count],
            year: title_year[count],
            country: country[count],
            language: language[count],
            genre: genre[count],
            plot: plot[count],
            director: director[count],
            actor_one: actor_one[count],
            actor_two: actor_two[count],
            actor_three: actor_three[count]
            //could add more specific movie info here as well
          })
          //increment the x position (moving it over by 50)
          xpos += width;
          //increment count
          count++;
        }
        //reset the x position after a row is complete 
        xpos = 1;
        //increement the y position for the new row (move it down by 50)
        ypos += height;
      }
      return data;
    }


    //check data
    console.log(gridData);
    //append svg to div 
    grid = d3.select('#viz')
      .append("svg")
      .attr("width", "100%")
      .attr("height", "75%")

    //add tooltip div 
    div = d3.select("#highlight")
      .append("div")
      .style("opacity", 0)

    tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

    //add group for all movie information 
    movie_group = d3.select("#highlight2")
      .append("div")
      .attr("class", "movie_title")
      .style("opacity", 0)

    //make row (referenced Mike Bostock)
    var row = grid.selectAll(".row")
      .data(gridData)
      .enter()
      .append("g")
      .attr('class', "row")

    //make individual cells and columns 
    var column = row.selectAll(".square")
      .data(function(d) {
        return d;
      }) 
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return d.x;
      })
      .attr("y", function(d) {
        return d.y;
      })
      .attr("width", function(d) {
        return d.width;
      })
      .attr("height", function(d) {
        return d.height;
      })
      .style("fill", function(d) {
        return d.color;
      })
      .style("stroke", "#222")
      .on('mouseover', function(d, i) {
        d3.select(this)
            .transition()
            .attr('fill', '#ff0000');
      })
      .on('click', function(d) {
        d.click++;
        if ((d.click) % 2 == 0) { 
          d3.select(this).style("fill", d.color);
          div.transition().duration('50').style("opacity", 0)
          movie_group.transition().duration('50').style("opacity", 0)
          //tooltip disappears 
          tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
          
        }
        if ((d.click) % 2 == 1) {
          d3.select(this).style("fill", "red")
          div.transition().duration('50').style("opacity", 1)
          div.html(d.highlight + '<br/>' + "<b style=" + "font-size:40px" + ">imdb</b>").style("font-size", "60px")
          movie_group.transition().duration('50').style("opacity", 1)
          movie_group.html(d.title + "(" + d.rating + ")" + " | " + d.year + '<br/>' + "From " + d.country + " in " + d.language + '<br/>' + d.genre + '<br/>' + d.plot + '<br/>' + "Director: " + d.director + '<br/>' + "Cast: " + d.actor_one + ", " + d.actor_two + ", " + d.actor_three).style("font-size", "18px")
          //tooltip show 
          tooltip.transition()    
            .duration(200)    
            .style("opacity", .9);    
          tooltip.html(d.highlight_name + ":" + '<br/>' + d.hover)  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px");
        }
      })

  }

  function updateColor(filter, data) {
    return d3.scaleSequential().domain([d3.min(data),d3.max(data)])
      .interpolator(d3.interpolateYlGnBu);
  }


  d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    selectedOption = d3.select(this).property("value")
    console.log(selectedOption)
    // run the updateChart function with this selected option
    grid.remove();
    div.remove();
    movie_group.remove();
    tooltip.remove();
    updateGrid(selectedOption);
  })
})