define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        d3tip               = require('d3tip'),
        highcharts          = require('highcharts'),
        bootstrap           = require('bootstrap'),

        // davesAPI            = require('js/utilities/poeAPI'),

        // poeData             = require('json!../../../data/poeData.json'),
        // poeDB               = require('json!../../../data/jsonDB.json'),
        // d3line              = require('d3linegraph'),
        // d3line = require('js/utilities/d3linegraph'),

        // ProjectItem           = require('../views/projectItem'),
        HTML                = require('text!html/sites/PoeLadder.html'),
        // projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML);

    var searchCharacters = [];
    var classData = [];

    return Backbone.View.extend({
        el:'#mainContent',

        charTableTemplate: _.template("<% _.each(models, function(item) { %>" + 
                                "<tr class='dead<%= item.isdead %>'>" +
                                "<td><%= item.name %></td> " +
                                // "<td><%= item.isdead %></td>" +
                                "<td><%= item.level %></td>" +
                                "<td><%= item.class %></td>" +
                                "<td><%= item.rank %></td>" +
                                // "<td><div class='legendColor'></div></td>" +
                                // "<td class='removeItem' data-name='<%= item.name %>'>Remove</td>" +
                                "<tr/> <% }) %>"),

        initialize: function(){
            var self = this;

            console.log("Running davesAPI...");
            // console.log(davesAPI.testFun());

            var self = this;

            d3.xhr("http://poe.davidzeiser.com/classes.html", function(error, data){

                var data = $.parseJSON(self.convertCSVtoJSON(data.response));

                console.log("data");
                console.log(data);
            });

        },
        
        render: function () {
            // window.onload = function () {


            $(window).scrollTop(0);
            var self = this;
            self.undelegateEvents();
            self.$el.html(template());

            var myEfficientFn = _.debounce(self.onResize, 100);
            $(window).resize(myEfficientFn);

            self.onResize();

            $("#myInput").keypress(function (e) {
                if (e.which == 13 || event.keyCode == 13) {
                    self.characterSearch(e.target.value);
                }
            });
            // console.log(svgBike);

            if(window.innerWidth <= 600) {
                // self.rearrangeForMobile();
            }

            $(window).on("orientationchange",function(){
              self.drawBarGraph("10");
            });

            

            // search stuff
            if(window.location.hash) {
              // Fragment exists

                if(window.location.hash){
                    var hashItems = (window.location.hash).split("#poe/")[1];

                    // hashItems = hashItems.replace('&',' ');

                    if(hashItems){
                        hashItems.toString();
                        hashItems = hashItems.replace(/\+/g, ' ');
                        self.characterSearch(hashItems);
                        $("#myInput").val(hashItems);
                    } 
                }
            }


            self.getDavesClassData();

            // classData = davesAPI.getDavesClassData();

           // setTimeout(function() {
           //      self.setPieButtons();
           //      console.log("classData2");
           //      console.log(classData);
           //  }, 2500);

            


            self.getDavesDeadData();

            self.setBarButtons();
            self.drawBarGraph("25");

            return this;
        },
        setBarButtons: function(){
            var self = this;

            $(".barBtn").click(function(e){
                var amt = e.target.dataset.amt;
                self.drawBarGraph(amt);
            })
        },

        
        prepDeadData:function(data){
            var self = this;
            var donutData = [
                ['Alive',(15000-Number(data))],
                ['Dead',Number(data)]
            ];
            self.drawHalfDonut(donutData);
        },
        drawHalfDonut:function(donutData){
            $('#deadDonut').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                title: {
                    text: '',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 40
                },
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                    // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Dead Donut',
                    innerSize: '50%',
                    data: donutData
                }]
            });
        },
        setPieButtons: function(){
            var self = this;
            
            self.prepPieData(classData, "top100", "#pie100");
            self.prepPieData(classData, "top500", "#pie500");
            self.prepPieData(classData, "top2000", "#pie2000");
            self.prepPieData(classData, "top5000", "#pie5000");
        },
        prepPieData:function(data,tier,selector){
            var self = this;

            var pieData = [];

            _.each(data,function(val,key){
                var piece = {};

                if(val.classname != "") {

                    if(val[tier] != "0"){
                        piece.name = val.classname;
                        piece.y = Number(val[tier]);

                        // console.log("piece");
                        // console.log(piece);

                        // var piece = {
                        //     name: val.classname,
                        //     y: Number(val.top100)
                        // }

                        pieData.push(piece);
                    }
                }
            });

            // console.log("pieData");
            // console.log(pieData);

            // pieData[0].sliced = true;
            // pieData[0].selected = true;

            self.drawPieChart(pieData,selector);
        },
        drawPieChart:function(pieData,selector){
            $(selector).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    headerFormat: "",
                    pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            format: '<b>{point.name}</b>',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Class Name',
                    colorByPoint: true,
                    data: pieData
                }]
            });
        },
        characterSearch: function(data){
        // characterSearch: _.debounce(function(data){
            var self = this;
            // do something
            var namesArray = [];

            searchCharacters = [];

            _.each(data.split(" "),function(val,key){
                if(val.length > 4 ) {
                    namesArray.push(val);
                }
            });

            if(namesArray.length){
                self.getDavesLadderData(namesArray);
            }

        // }, 1000),
        },
        getDavesDeadData: function(){
            var self = this;

            d3.xhr("http://poe.davidzeiser.com/?deadcount=1", function(error, data){

                var data = data.response;

                self.prepDeadData(data);

            });
        },
        getDavesClassData: function(){
            var self = this;

            d3.xhr("http://poe.davidzeiser.com/classes.html", function(error, data){

                var data = $.parseJSON(self.convertCSVtoJSON(data.response));

                classData = data;
                self.setPieButtons();
            });
        },
        getDavesLadderData: function(namesArray){
            var self = this;

            var namesArrayString = namesArray.join("+");
            window.history.pushState('object or string', 'Rip', "#poe/" + namesArrayString);

            var newURL = "http://poe.davidzeiser.com/?names=" + namesArrayString;

            // "http://poe.davidzeiser.com/?names=energypizza+muslims+nitrodubs+obamathejew+shripper"

            d3.xhr(newURL, function(error, data){

                var data = $.parseJSON(self.convertCSVtoJSON(data.response));

                // console.log("getDavesLadderData data:");
                // console.log(data);
                _.each(data,function(v,k){
                    if(v.name == "" || v.name == undefined){
                        data.splice(k,1);
                    }
                })
                // self.drawLineGraph2(data);

                self.prepHighcharts(data,namesArray);

                self.prepTableData(namesArray,data);
                
            });
        },
        prepHighcharts:function(data,namesArray){
            var self = this;

            var lineGraphData = [],
                oneChar = [];

            var mostXP = 0;
            var leastXP = 45000000000;
            var timeEntries = [];

            _.each(data,function(d){
                if(Number(d.exp) > mostXP){ mostXP = Number(d.exp)};

                if(Number(d.exp) < leastXP){ leastXP = Number(d.exp)};

                if(!_.contains(timeEntries,d.date)){
                    timeEntries.push(d.date);
                }
            });

            var lineGraphMetrics = {
                minDate: new Date(_.min(data, function(d){ return Date.parse(d.date); }).date),
                maxDate: new Date(_.max(data, function(d){  return Date.parse(d.date); }).date),
                maxXP: mostXP,
                minXP: leastXP - 5000
            };
            
            _.each(namesArray,function(val,key){
                var oneChar = {
                    name: val,
                    data: []
                };
                _.map(data,function(v,k){
                    if(v.name.toLowerCase() == val.toLowerCase()){

                        var d = v.date;

                        var year = d.split("-")[0];
                        var month = d.split("-")[1];
                        var day = d.split("-")[2].split(" ")[0];
                        var hour = d.split("-")[2].split(" ")[1].split(":")[0]
                        var minute = d.split("-")[2].split(" ")[1].split(":")[1]


                        v.date = Date.UTC(year, month - 1, day, hour, minute);

                        var n = Number(v.exp);
                        v.exp = n;



                        oneChar.data.push([v.date,v.exp]);
                    }
                })
                lineGraphData.push(oneChar);
            });

            var newLineGraphData = []

            var highchartStart = timeEntries[0];

            self.drawHighchart(lineGraphData,highchartStart,lineGraphMetrics);

            // self.drawLineGraph(lineGraphData,lineGraphMetrics);
        },
        drawHighchart: function(lineGraphData,highchartStart,lineGraphMetrics){
            var self = this;

            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                }
            });

            $('#HCcontainer').highcharts({
                chart: {
                    type: 'spline'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e. %b',
                        year: '%b'
                    },
                    title: {
                        text: 'Date'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Experience'
                    },
                    min: lineGraphMetrics.minXP
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b>{point.x: %b %e}<br>',
                    // headerFormat: '<b>{series.name}</b>{point.x:%Y-%m-%d}<br>',
                    pointFormat: 'Experience: {point.y}'
                },

                plotOptions: {
                    spline: {
                        marker: {
                            enabled: true
                        }
                    }
                },

                series: lineGraphData
            });
        },
        prepTableData:function(namesArray,data){

            var self = this;

            var tableData = [],
                lastIndex = 0;

            // console.log(searchCharacters);
            var lowerCaseData = data; 

            lowerCaseData = _.map(lowerCaseData,function(d){ d.name = d.name.toLowerCase(); return d });

            _.each(namesArray,function(val,key){
                lastIndex = _.findLastIndex(lowerCaseData, { name: val.toLowerCase() });

                // console.log("lastIndex");
                // console.log(lastIndex);
                if(lastIndex == -1){
                    return;
                }
                tableData.push(data[lastIndex]);
            });

            // console.log("tableData");
            // console.log(tableData);

            self.makeCharacterTable(tableData);
        },
        makeCharacterTable:function(data){
            var self = this;

            data = _.sortBy(data, function(d){ 
                    return -d.exp; 
            });

            $("tbody#charTable").html( self.charTableTemplate({ models: data}));


            // $("td.removeItem").click(function(e){
            //     var newText = $("#myInput").val().replace(e.target.dataset.name,"");
            //     $("#myInput").val(newText);
            //     self.characterSearch(newText);
            // });

            // var tableRow = $("#charTable > tr > td").filter(function() {
            //     return $(this).text() == data[0].name;
            // }).closest("tr");

            // $(tableRow).find(".legendColor").css("background-color",strokeColor);
        },
        drawBarGraph: function(amount){

            $("#poeLadder").empty();

            var url = "http://api.pathofexile.com/ladders/Hardcore%20Legacy?offset=0&limit=" + amount;

            var realWidth = Number($("#poeLadder").css("width").split("px")[0]);

            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                // width = 1800 - margin.left - margin.right,
                width = realWidth - margin.left - margin.right,
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
                // .attr("width", '100%')
                // .attr("preserveAspectRatio", "xMinYMin meet")
                // .attr("viewBox", "0 0 "+width+" "+height)
                //class to make it responsive
                .classed("svg-content-responsive", true)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);
            
            // d3.json("data/poeData.json", function(error, data) {
            d3.xhr(url, function(error, data){

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

                d3.select("button#sortVals").on("click", change);
                d3.select("button#sortClass").on("click", sortClass);

                // have class sort trigger that happens after sort
            
                var sortTimeout = setTimeout(function() {
                    d3.select("input#sortVals").property("checked", true).each(change);
                }, 1500);
            
                function change() {

                    clearTimeout(sortTimeout);
            
                    // Copy-on-write since tweens are evaluated after a delay.
                    var x0 = x.domain(data.sort( function(a, b) { 
                            return d3.ascending(a.letter, b.letter); 
                        })
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
                    var x0 = x.domain(data.sort(function(a, b) { 
                            return d3.ascending(a.character.class, b.character.class); 
                        })
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

        onResize: function(){
            var self = this;

            // self.drawBarGraph("10");

            if(window.innerHeight <= 600) {
                $("#homeContainer").css("padding","4rem 0");
            }
            else{
                $("#homeContainer").css("padding","12rem 0 2rem");
            }
        },
        convertCSVtoJSON: function(csv){
            //var csv is the CSV file with headers
            var lines = csv.split("\n");

            var result = [];

            var headers = lines[0].split(",");

            for(var i=1;i<lines.length;i++){

              var obj = {};
              var currentline=lines[i].split(",");

              for(var j=0;j<headers.length;j++){
                  obj[headers[j]] = currentline[j];
              }

              result.push(obj);

            }

            //return result; //JavaScript object
            return JSON.stringify(result); //JSON
        },

    });
});
