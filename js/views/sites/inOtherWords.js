define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        bootstrap           = require('bootstrap'),
        // ProjectItem           = require('../views/projectItem'),
        HTML                = require('text!html/sites/inOtherWords.html'),
        // projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML);

    return Backbone.View.extend({
        render: function () {
            var self = this;
            self.undelegateEvents();
            self.$el.html(template());

            var myEfficientFn = _.debounce(self.onResize, 100);
            $(window).resize(myEfficientFn);

            self.onResize();
            self.getGoogleData();

            $("html,body").animate({
                scrollTop: $("#contentContainer").offset().top
            },500);

            $("#myInput").on("click",function(e){
                $("html,body").animate({
                    scrollTop: $("#myInput").offset().top
                },500);
            });



            $("#myInput").on("keyup",function(e){
                self.doSearch(e);
            });

            // console.log(svgBike);

            if(window.innerWidth <= 600) {
                self.rearrangeForMobile();
            }

            return this;
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
        getGoogleData: function(){

            var self = this;

            var googleSpreadsheetPublicKey = "1VZA5ls0rEEWB1GZqt59y93gAQsnoFUGbr-MUng4e124";
            var gUrl = "https://spreadsheets.google.com/feeds/cells/" + googleSpreadsheetPublicKey + "/1/public/basic?hl=en_US&alt=json";

            var jqxhr = $.get(gUrl, function() {
              // alert( "success" );
            })
              .done(function(data) {
                // alert( "second success" );
                var listData = self.prepData(data);
                self.renderData(listData);
              })
              .fail(function() {
                // alert( "error" );
              })
              .always(function() {
                // alert( "finished" );
            });


        },
        prepData: function(data){
            // console.log("data");
            // console.log(data);
            // var dataEntries = data.feed.entry;
            var dataObj = [];
            for (var i = 0,y=data.feed.entry.length; i < y; i++) {
                dataObj[i] = data.feed.entry[i].content.$t;
            }
            //have raw spreadsheet data and read to sort
            dataObj.splice(0,4);
            //chop off first row
            
            var commentAmount = dataObj.length/4;
            var comments = [];
            var size = 4;

            while (dataObj.length > 0)
                comments.push(dataObj.splice(0, 4));

            for (i = 0; i < commentAmount; i++) {
                comments[i].time = comments[i][0];
                comments[i].name = comments[i][1];
                comments[i].theySaid = comments[i][2];
                comments[i].iow = comments[i][3];
            }
            // console.log("data massaged");
            // console.log(comments);
            return comments;
        },
        renderData: function(data){

            // console.log(a);

            var self = this;

             _.each(data, function (d) {
                // console.log(project);
                // self.$el.append(new ProjectItem({model: project}).render().el);
                $("#myTable").append("<tr><td>"+d.theySaid+"</td><td>"+d.iow+"</td></tr>");
            });

            

        },
        renderProjects: function(){
            var self = this;

             _.each(projectsData, function (project) {
                console.log(project);
                // self.$el.append(new ProjectItem({model: project}).render().el);
                $("#supercontainer").append(new ProjectItem({model: project}).render().el);
            });

        },
    });
});
