define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        HTML                 = require('text!html/Shell.html'),

        template = _.template(HTML);

    return Backbone.View.extend({

        render: function () {
            this.$el.html(template());
            return this;
        }

    });

});