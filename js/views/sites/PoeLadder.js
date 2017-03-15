define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        d3tip               = require('d3tip'),
        bootstrap           = require('bootstrap'),
        poeData             = require('json!../../../data/poeData.json'),
        // ProjectItem           = require('../views/projectItem'),
        HTML                = require('text!html/sites/PoeLadder.html'),
        // projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML);

    return Backbone.View.extend({
        el:'#mainContent',

        
        render: function () {
            var self = this;
            self.undelegateEvents();
            self.$el.html(template());

            var myEfficientFn = _.debounce(self.onResize, 100);
            $(window).resize(myEfficientFn);

            self.onResize();


            $("#myInput").on("keyup",function(e){
                self.doSearch(e);
            });

            // console.log(svgBike);

            if(window.innerWidth <= 600) {
                self.rearrangeForMobile();
            }

            self.drawGraphTest();
            console.log(poeData.entries);

            return this;
        },
        drawGraphTest: function(){

            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 1800 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;
            
            var formatPercent = d3.format(".2s");
            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1, 1);
            
            var y = d3.scale.linear()
                .range([height, 0]);
            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
            
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .tickFormat(formatPercent);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])

                .html(function(d) {

                return "<strong>"+ d.character.name +"</strong>" + "</br>" 
                        + "<strong>Level:</strong> <span style='color:red'>" + d.character.level + "</span>" + "</br>"
                        + "<strong>Class:</strong> <span style='color:red'>" + d.character.class + "</span>" + "</br>"
                        + "<strong>Experience:</strong> <span style='color:red'>" + d.frequency.toLocaleString() + "</span>";
            });
            
            var svg = d3.select("#poeLadder").append("svg")
                .attr('class','simpleBarSVG')
                // .attr("width", width + margin.left + margin.right)
                .attr("width", '100%')
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);
            
            // d3.json("data/poeData.json", function(error, data) {
            d3.xhr("http://api.pathofexile.com/ladders/Hardcore%20Legacy?offset=0&limit=80", function(error, data){

                // console.log(JSON.parse(data.response));

                data = d3.shuffle(JSON.parse(data.response).entries);
            
                data.forEach(function(d) {
                    d.frequency = d.character.experience;
                    // d.letter = d.character.name.slice(0,5) + "..";
                    d.letter = d.rank;
                });
            
                x.domain(data.map(function(d) { return d.letter; }));
                y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
            
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
            
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Experience");
            
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.frequency); })
                    .attr("height", function(d) { return height - y(d.frequency); })
                    .attr("fill", function(d){ return classColor(d.character.class); })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

                d3.select("input#sortVals").on("change", change);
                d3.select("input#sortClass").on("change", sortClass);

                // have class sort trigger that happens after sort
            
                var sortTimeout = setTimeout(function() {
                    d3.select("input#sortVals").property("checked", true).each(change);
                }, 1500);
            
                function change() {

                    clearTimeout(sortTimeout);
            
                    // Copy-on-write since tweens are evaluated after a delay.
                    var x0 = x.domain(data.sort(this.checked
                        ? function(a, b) { return b.frequency - a.frequency; }
                        : function(a, b) { return d3.ascending(a.letter, b.letter); })
                        .map(function(d) { return d.letter; }))
                        .copy();
                
                    svg.selectAll(".bar")
                        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });
                
                    var transition = svg.transition().duration(750),
                        delay = function(d, i) { return i * 50; };
                
                    transition.selectAll(".bar")
                        .delay(delay)
                        .attr("x", function(d) { return x0(d.letter); });
                
                    transition.select(".x.axis")
                        .call(xAxis)
                        .selectAll("g")
                        .delay(delay);
                }

                function sortClass(){
                    var x0 = x.domain(data.sort(this.checked
                        ? function(a, b) { 
                            return d3.ascending(a.character.class, b.character.class); }
                        : function(a, b) { 
                            return d3.ascending(a.letter, b.letter);  })
                        .map(function(d) { return d.letter; }))
                        .copy();

                     svg.selectAll(".bar")
                        .sort(function(a, b) { return x0(a.character.class) - x0(b.character.class); });
                
                    var transition = svg.transition().duration(750),
                        delay = function(d, i) { return i * 50; };
                
                    transition.selectAll(".bar")
                        .delay(delay)
                        .attr("x", function(d) { return x0(d.letter); });
                
                    transition.select(".x.axis")
                        .call(xAxis)
                        .selectAll("g")
                        .delay(delay);
                }

                function classColor(x){
                    var color = "steelblue";

                    switch (x){

                        case "Hierophant":
                            color = "Tomato";
                            break;
                        case "Pathfinder":
                            color = "Navy";
                            break;
                        case "Berserker":
                            color = "Yellow";
                            break;
                        case "Champion":
                            color = "LawnGreen";
                            break;
                        case "Chieftain":
                            color = "DarkRed";
                            break;
                        case "Gladiator":
                            color = "DarkSlateGray";
                            break;
                        case "Guardian":
                            color = "Peru";
                            break;
                        case "Inquisitor":
                            color = "CadetBlue";
                            break;
                        case "Elementalist":
                            color = "Goldenrod";
                            break;
                        case "Assassin":
                            color = "Indigo";
                            break;
                        case "Slayer":
                            color = "Thistle";
                            break;
                        case "Necromancer":
                            color = "Pink";
                            break;
                        case "Raider":
                            color = "MediumSeaGreen";
                            break;
                        case "Juggernaut":
                            color = "MediumVioletRed";
                            break;
                        case "Beserker":
                            color = "DarkOliveGreen";
                            break;
                        case "Trickster":
                            color = "Teal";
                            break;
                        case "Occultist":
                            color = "Aquamarine";
                    }

                    return color;
                
                }
            });

        },
        rearrangeForMobile: function(){
            var featureDiv = $(".featurette");

            _.each(featureDiv,function(feature){
                var col5 = $(feature).find(".col-md-5");

                $(feature).find(".col-md-5").remove();
                $(feature).prepend(col5);
            });
        },
        onResize: function(){
            if(window.innerHeight <= 600) {
                $("#homeContainer").css("padding","4rem 0");
            }
            else{
                $("#homeContainer").css("padding","12rem 0 2rem");
            }
        },
        doSearch: function(e){

            var myFunction = function() {
              // Declare variables 
              var input, filter, table, tr, td, i;
              input = e.target;
              filter = input.value.toUpperCase();
              table = $("#myTable");
              // tr = table.getElementsByTagName("tr");
              tr = $("#myTable").find("tr");

              // Loop through all table rows, and hide those who don't match the search query
              for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[0];
                if (td) {
                  if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                  } else {
                    tr[i].style.display = "none";
                  }
                } 
              }
            }
            myFunction();
        },
        prepData: function(data){
            // console.log("data");
            // console.log(data);


        },
        renderData: function(data){


        },
        renderProjects: function(){

        },
    });
});
