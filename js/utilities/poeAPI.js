define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        d3                  = require('d3'),
        Backbone            = require('backbone');
        

        

        // projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')

    var searchCharacters = [],
        lineGraphData = [],
        lineGraphMetrics = {};


    var testVar = 123;

    var davesAPI = {
        testFun: getDavesClassData
    }

    function getDavesClassData(){
        var self = this,
            data;

        // d3.xhr("http://poe.davidzeiser.com/classes.html", function(error, data){
        var theData = d3.xhr("http://poe.davidzeiser.com/classes.html", function(error, data){

             data = $.parseJSON(convertCSVtoJSON(data.response));

            // classData = data;
            // self.setPieButtons();
            return data;
        });

        
            
        return theData;
    }

    function convertCSVtoJSON(csv){
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
    }

    return davesAPI;


});
