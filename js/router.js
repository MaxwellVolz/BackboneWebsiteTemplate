define(function (require) {

  "use strict";

  var   $ = require('jquery'),
        Backbone = require('backbone'),
        HomeView = require('js/views/home'),
        ProjectsView   = require('js/views/projects'),

        $body = $('body'),
        $content = $("#mainContent"),
        homeView = new HomeView({el: $content}).render(),
        projectsView = new ProjectsView({el: $content});


        // $body.click(function () {
        //   console.log($content);
        // });

        // $("body").on("click", "#showMeBtn", function (event) {
        //     event.preventDefault();
        // });

        return Backbone.Router.extend({

            routes: {
                "": "home",
                "home": "home",
                "projects": "projects",
                "employees/:id": "employeeDetails"
            },

            home: function () {
                console.log("home route!");
                // $("html,body").addClass("overflowHidden");

                // homeView.delegateEvents(); 
                // // delegate events when the view is recycled
                homeView.render();
            },

            projects: function () {
                // $("html,body").removeClass("overflowHidden");
                projectsView.delegateEvents(); 
                // // delegate events when the view is recycled
                projectsView.render();

                console.log("projects route!");
                // require(["app/views/Contact"], function (ContactView) {
                //     var view = new ContactView({el: $content});
                //     view.render();
                // });
            }



    });

});