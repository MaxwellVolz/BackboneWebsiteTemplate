define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        bootstrap           = require('bootstrap'),
        ProjectItem           = require('../views/projectItem'),
        HTML                = require('text!html/Home.html'),
        projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML);

    return Backbone.View.extend({

        start:function(){
            this.render();
        },

        render: function () {
            var self = this;
            self.undelegateEvents();
            self.$el.html(template());

            var myEfficientFn = _.debounce(self.onResize, 100);
            $(window).resize(myEfficientFn);

            self.onResize();
            self.renderProjects();

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
        renderProjects: function(){
            var self = this;

             _.each(projectsData, function (project) {
                // console.log(project);
                // self.$el.append(new ProjectItem({model: project}).render().el);
                $("#supercontainer").append(new ProjectItem({model: project}).render().el);
            });

        },
    });
});
