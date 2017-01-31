define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Model = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			"id": 1,
			"title": "Poyo",
			"desc": "The story is of little bird named Poyo who must restore color to a desolated world. 2D Physics-based platformer created in Unity.",
			"tech": "Unity, C#, Adobe",
			"imgURL": "images/poyo.gif",
			"linkTitle": "",
			"linkURL":""
		},
		initialize:function(){

		},
		validate:function(attrs){
			console.log("Model validation: " + attrs);
		},

		triggerEvent: function(){
			this.trigger("test", {someData: "data"});
		}

	});

	return Model;
});