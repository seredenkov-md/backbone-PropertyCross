var app = app || {};

(function () {
    'use strict';

    // Location Model
    app.Location = Backbone.Model.extend({
        defaults: {
            long_title: null,       /* для отображения этого элемента */
            place_name: null,       /* для формирования запроса */
            title: null,
            total_pages: null,      /* это пока лишнее*/
            total_results: null,
            time: new Date()        //
        }
    });
})();


/*
    long_title: "Leeds Railway Station",
    place_name: "leeds-railway-station",
    title: "Leeds Railway Station",
    total_pages: 1,
    total_results: 3,

*/
