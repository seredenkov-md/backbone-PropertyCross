/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function () {
    'use strict';

    // kick things off by creating the `App`
    //new app.AppView();

    app.errorText = '';

    app.resultInfo = {
        totalResults : 0,
        placeName : '',
        currentPage : 1,    // start page
        pageSize : 50,      // 20..50
        maxResult: 1000     // api limitation
    };

    app.results = new app.Results();
    app.locations = new app.Locations();
    app.posLocation = new app.PossibleLocation();
    app.favourites = new app.Favourites();

    app.Router = new app.Router();
    Backbone.history.start();
});

