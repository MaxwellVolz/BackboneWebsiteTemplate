define(function (require) {

  "use strict";

  var   $ = require('jquery'),
        Backbone = require('backbone'),
        HomeView = require('js/views/home'),
        InOtherWordsView   = require('js/views/sites/inOtherWords'),
        // FangChatView   = require('js/views/sites/fangChat'),

        $body = $('body'),
        $content = $("#mainContent"),
        homeView = new HomeView({el: $content}).render(),
        iowView = new InOtherWordsView({el: $content}).render();
        // fangchatView = new FangChatView({el: $content}).render(),


        return Backbone.Router.extend({

            routes: {
                "": "home",
                "home": "home",
                "iow":"inOtherWords",
                "fangchat":"fangChat",
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

            inOtherWords: function(){
                iowView.render();

                console.log("inOtherWords route!");
            },
            // fangChat: function(){

                
            //     fangchatView.initialize();
            //     fangchatView.render();

            //     console.log("fangChat route!");
            // },



    });

});