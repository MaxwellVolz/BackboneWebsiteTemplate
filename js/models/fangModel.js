define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var FangModel = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			user: '',
			msg: '',
		},

	});

	return FangModel;
});