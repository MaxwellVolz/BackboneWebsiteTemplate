require.config({

    baseUrl: 'lib',

    paths: {
        js: '../js',
        // css: '../css',
        html: '../html',
        tether: 'tether',
        d3: 'd3.v3.min'
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

require(['jquery', 'backbone', 'js/router'], function ($, Backbone, Router) {
    var router = new Router();
    Backbone.history.start();
});

// required to avoid console error caused by Tether.js not loading for Bootstrap correctly
define(['tether.min'], function(tether) {
    window.Tether = tether;
    return tether;
});