define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether              = require('tether'),
        d3                  = require('d3'),
        d3tip               = require('d3tip'),
        bootstrap           = require('bootstrap'),
        poeData             = require('json!../../../data/poeData.json'),
        poeDB               = require('json!../../../data/jsonDB.json'),

        
        // ProjectItem           = require('../views/projectItem'),
        HTML                = require('text!html/sites/PoeLadder.html'),
        // projectsData        = require('json!data/projects.json'), 
        // svgBike             = require('text!svg/svgBike.svg')
        template = _.template(HTML);

    var searchCharacters = [],
        lineGraphData = [],
        lineGraphMetrics = {};


    var testVar = 123;

    return Backbone.View.extend({
        el:'#mainContent',

        initialize: function(){
            var self = this;

        },
        testFun: function(){
            return testVar;
        },
        render: function () {

        },

    });
});
