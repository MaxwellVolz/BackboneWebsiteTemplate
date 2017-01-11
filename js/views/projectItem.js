define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!html/ProjectSection.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

		render: function () {
			console.log("rendering...");
            this.$el.html(template(this.model));
            return this;
        }

    });

});