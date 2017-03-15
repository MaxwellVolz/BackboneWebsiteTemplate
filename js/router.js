define(function (require) {

  "use strict";

  var   $ = require('jquery'),
        Backbone = require('backbone'),
        HomeView = require('js/views/home'),
        InOtherWordsView   = require('js/views/sites/inOtherWords'),
        PoeLadderView  = require('js/views/sites/PoeLadder'),
        // FangChatView   = require('js/views/sites/fangChat'),

        $body = $('body'),
        $content = $("#mainContent"),
        homeView = new HomeView(),
        poeLadderView = new PoeLadderView(),
        iowView = new InOtherWordsView();
        // fangchatView = new FangChatView({el: $content}).render(),


        return Backbone.Router.extend({

            routes: {
                "": "home",
                "home": "home",
                "iow":"inOtherWords",
                "poe":"PoeLadder",
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
                console.log("inOtherWords route!");
                iowView.render();

            },
            PoeLadder: function(){
                poeLadderView.render();
            }
            // fangChat: function(){

                
            //     fangchatView.initialize();
            //     fangchatView.render();

            //     console.log("fangChat route!");
            // },



    });

});