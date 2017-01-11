require.config({

    baseUrl: 'lib',

    paths: {
        js: '../js',
        // json: 'json',
        // css: '../css',
        html: '../html',
        tether: 'tether',
        d3: 'd3.v4.min',
        data: '../data',
    },
    
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': ['tether','jquery']
    }
});

require(['jquery', 'backbone', 'js/router','json'], function ($, Backbone, Router) {
    var router = new Router();
    Backbone.history.start();
});

// required to avoid console error caused by Tether.js not loading for Bootstrap correctly
define(['tether.min'], function(tether) {
    window.Tether = tether;
    return tether;
});