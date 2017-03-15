    require.config({

    baseUrl: 'lib',

    paths: {
        js: '../js',
        // json: 'json',
        // css: '../css',
        html: '../html',
        tether: 'tether',
        d3: 'd3.v3.min',
        d3tip: 'd3.tip',
        data: '../data',
        SVG: '../svg',

        collections: '../js/collections',
        models: '../js/models'
    },
    
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'd3tip':{
            deps: ['d3']
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': ['tether','jquery'],
    }
});
 


            
require(['jquery', 'backbone', 'js/router'], function ($, Backbone, Router) {
    var router = new Router();
    Backbone.history.start();

    console.log(".....");
});


// required to avoid console error caused by Tether.js not loading for Bootstrap correctly
define(['tether.min'], function(tether) {
    window.Tether = tether;
    return tether;
});