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



            return this;
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
