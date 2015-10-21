var app = app || {};

(function () {
    'use strict';

    app.Favourites = Backbone.Collection.extend({
        model: app.Offer,
        localStorage: new Backbone.LocalStorage('PropertyCross-Favourites'),

        comparator: function(item) {
            var time = new Date(item.get('time'));
            return -time;
        },

        initialize: function() {
            this.fetch();
        }
    });
})();
