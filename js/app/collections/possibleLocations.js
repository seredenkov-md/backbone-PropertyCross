var app = app || {};

(function () {
    'use strict';
    // Коллекция возможных (предложенных) мест
    app.PossibleLocation = Backbone.Collection.extend({
        model: app.Location
    });
})();
