/*global define */
define([
	'underscore',
	'backbone',
	'models/fangModel',
	'firebase',
	'backbonefire'
], function (_, Backbone, FangModel) {
	'use strict';

	var FangsCollection = Backbone.Firebase.Collection.extend({
		// Reference to this collection's model.
		model: FangModel,

		// Save all of the message under the `"Fangs"` namespace.
		url: 'https://backbonefire.firebaseio.com/FangchatDB',

		// Filter down the list of all Fang items that are finished.
		completed: function () {
			return this.where({completed: true});
		},

		// Filter down the list to only Fang items that are still not finished.
		remaining: function () {
			return this.where({completed: false});
		},

		// We keep the messages in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		// Messages are sorted by their original insertion order.
		comparator: 'order'
	});
	return new FangsCollection();
});