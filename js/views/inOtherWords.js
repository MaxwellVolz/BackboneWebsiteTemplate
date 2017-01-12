define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tether               = require('tether'),
        bootstrap            = require('bootstrap'),
        HTML                 = require('text!html/Projects.html'),

        template = _.template(HTML);

    return Backbone.View.extend({

        render: function () {
            this.$el.html(template());
            return this;
        }

    });

});