define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        bootstrap           = require('bootstrap'),

        HTML                = require('text!html/Home.html'),

        template = _.template(HTML);

    return Backbone.View.extend({

        render: function () {

            var self = this;
            self.undelegateEvents();
            this.$el.html(template());

            self.animateBG2();

            var myEfficientFn = _.debounce(self.animateBG2, 100);
            $(window).resize(myEfficientFn);

            return this;
        },
        animateBG2: function(){
            $("header > svg").remove();

            // var width = $( window ).width(),
            var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            // var width = parseInt($("header").css("width"), 10),
                // height = parseInt($("header").css("height"), 10)+40,
                height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)+500,
                radius = 50;

                  // console.log();
                  console.log(window.innerHeight);

            var sampler = poissonDiscSampler(width + radius * 2, height + radius * 2, radius),
                samples = [],
                sample;

            while (sample = sampler()) samples.push([sample[0] - radius, sample[1] - radius]);

            var voronoi = d3.geom.voronoi().clipExtent([[-1, -1], [width + 1, height + 1]]);

            var svg = d3.select("header").append("svg")
                // .attr("opacity",0)
                .attr("width", width)
                .attr("height", height);


            svg.selectAll("path")
                .data(voronoi.triangles(samples).map(d3.geom.polygon))
                .enter().append("path")
                .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
                // .on("mouseover", function() {
                //     console.log("suh");
                //   d3.select(this).attr('fill', 'rgb(162, 110, 215)')
                // })
                .style("fill", function(d) { return color(d.centroid()); })
                .style("stroke", function(d) { return color(d.centroid()); });

            function color(d) {
                var dx = d[0] - width / 2,
                dy = d[1] - height / 2;
                return d3.lab(100 - (dx * dx + dy * dy) / 5000, dx / 10, dy / 5);
            }

              // Based on https://www.jasondavies.com/poisson-disc/
            function poissonDiscSampler(width, height, radius) {
                var k = 30, // maximum number of samples before rejection
                radius2 = radius * radius,
                R = 3 * radius2,
                cellSize = radius * Math.SQRT1_2,
                gridWidth = Math.ceil(width / cellSize),
                gridHeight = Math.ceil(height / cellSize),
                grid = new Array(gridWidth * gridHeight),
                queue = [],
                queueSize = 0,
                sampleSize = 0;

                return function() {
                    if (!sampleSize) return sample(Math.random() * width, Math.random() * height);

                    // Pick a random existing sample and remove it from the queue.
                    while (queueSize) {
                        var i = Math.random() * queueSize | 0,
                        s = queue[i];

                        // Make a new candidate between [radius, 2 * radius] from the existing sample.
                        for (var j = 0; j < k; ++j) {

                            var a = 2 * Math.PI * Math.random(),
                                r = Math.sqrt(Math.random() * R + radius2),
                                x = s[0] + r * Math.cos(a),
                                y = s[1] + r * Math.sin(a);

                            // Reject candidates that are outside the allowed extent,
                            // or closer than 2 * radius to any existing sample.
                            if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) return sample(x, y);
                            }

                        queue[i] = queue[--queueSize];
                        queue.length = queueSize;
                    }
                };

                function far(x, y) {
                    var i = x / cellSize | 0,
                    j = y / cellSize | 0,
                    i0 = Math.max(i - 2, 0),
                    j0 = Math.max(j - 2, 0),
                    i1 = Math.min(i + 3, gridWidth),
                    j1 = Math.min(j + 3, gridHeight);

                    for (j = j0; j < j1; ++j) {
                    var o = j * gridWidth;
                    for (i = i0; i < i1; ++i) {
                        if (s = grid[o + i]) {
                            var s,
                            dx = s[0] - x,
                            dy = s[1] - y;
                            if (dx * dx + dy * dy < radius2) return false;
                            }
                        }   
                    }

                    return true;
                }

                function sample(x, y) {
                    var s = [x, y];

                    queue.push(s);
                    grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
                    ++sampleSize;
                    ++queueSize;
                    return s;
                }   
            }

            // console.log($("path"));



            var $path = $("path"),
                amtOfPaths= $path.length;

            
            var t = d3.transition()
                .duration(11750);
            // goWhite();
            setTimeout(goWhite, 200);

            function goWhite(){
                d3.selectAll("path")
                    .transition()
                    .duration(8000)
                    .style("opacity",".3");
                    // .style("fill","rgb(200, 200, 200)");
                setTimeout(goBlue, 8000);
            }

            function goBlue(){
                d3.selectAll("path")
                    .transition()
                    .duration(8000)
                    .style("opacity","1");
                    // .style("fill","rgb(50, 10, 255)");
                setTimeout(goWhite, 8000);
            }
            



            // setInterval(function(){
                // $path[Math.floor(Math.random()*amtOfPaths)].animate({
                //     opacity: 0.25
                // }, 500);    


                    // .transition(t)
                    //     .style("fill", "rgb(50, 10, 255)")
                    // .transition(t)
                    //     .style("fill", "rgb(255, 255, 255)");


                // .transition(1000)
                // .duration(2500)
                // .style("fill", "rgb(255, 255, 255)");


                // var ranNum = Math.floor(Math.random()*amtOfPaths);
                // $path[ranNum].style("opacity",0.25);
                // console.log($path[ranNum]);
                // }, 500);
            // },500);

            
        },
        animateBG: function(){
            //JS to create random color grid
            console.log("yoyo its ya boi animateBG here");

            var grid = $('#grid');
            var s = 50;  //space between blocks
            var n = 2;  //shadow range (space between shadow waves)
            var h = ($( window ).height() / 2)/35;//amount of vertical boxes
            // var l = 30;  //grid length
            var l = Math.floor(grid.width() / 50)+1;  //grid length

            grid.empty();
            

            //random colors 
            var rndRed = function() {
                return Math.ceil(Math.random() * 30+10);
            };
            var rndGreen = function() {
                // return Math.ceil(Math.random() * 225+30);
                return Math.ceil(Math.random() * 30+10);
            };
            var rndBlue = function() {
                return Math.ceil(Math.random() * 115+140);
            };
            for (var i = 0; i < h; i++) {
                for (var j = 0; j < l; j++) {
                    var r = rndRed();
                    var g = rndGreen();
                    var b = rndBlue();
                    var a = Math.random()*0.5+0.3;
                    var style = {
                        'top': i * (s + n) + 'px',
                        'left': j * (s + n) + 'px',
                        'background': 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')',
                        'background-image': 'linear-gradient(top, hsla(255, 255%, 255%, .95), transparent)',
                        'animation-delay': ((i + 1) + (j + 1)) * 110 + 'ms'
                    };
                    var block = $('<div />').addClass('block').css(style);
                    grid.append(block);
                }
            }
        }

    });

});