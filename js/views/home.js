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

        Model               = require("models/Model"),
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML),
        self;

    return Backbone.View.extend({

        el:'#mainContent',

        initialize: function(){
            console.log("home view initialized");

            console.log("model");



            this.model = new Model;
            console.log(this.model);

            this.model.on("test",this.test);


            self = this;

            this.model.triggerEvent();

            // this.model = new Model(){
            //     message: "Model activited."
            // }
        },
        test: function(obj) {

            console.log("Just got -=" + obj.someData + "=- from my model!");

        },

        start:function(){
            this.render();
        },

        render: function () {
            self.undelegateEvents();
            self.$el.html(template());

            var myEfficientFn = _.debounce(self.onResize, 100);
            $(window).resize(myEfficientFn);

            self.onResize();
            self.renderProjects();

            console.log(self.$el);

            // console.log(svgBike);



            return this;
        },
        onResize: function(){
            if(window.innerHeight <= 600) {
                self.$el.find("#homeContainer").css("padding","4rem 0");
            }
            else{
                self.$el.find("#homeContainer").css("padding","12rem 0 2rem");
            }
        },
        renderProjects: function(){
            var self = this;

             _.each(projectsData, function (project) {
                // console.log(project);
                // self.$el.append(new ProjectItem({model: project}).render().el);
                self.$el.find("#supercontainer").append(new ProjectItem({model: project}).render().el);
            });

        },
    });
});
