/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    // Offer Model
    app.Offer = Backbone.Model.extend({
        idAttribute: "guid",

        defaults: {
            time: new Date(),
            inFavourites: false,
            auction_date: null,
            bathroom_number: null,
            bedroom_number: null,
            car_spaces: null,
            commission: null,
            construction_year: null,
            datasource_name: null,
            guid: null,
            img_height: null,
            img_url: null,
            img_width: null,
            //keywords: "Terrace, Basement, Parking, Patio",
            //latitude: 51.69675827026367,
            lister_name: null,
            lister_url: null,
            listing_type: null,
            location_accuracy: null,
            longitude: null,
            price: null,
            price_currency: null,
            price_formatted: null,
            price_high: null,
            price_low: null,
            price_type: null,
            property_type: null,
            summary: null,
            thumb_height: null,
            thumb_url: null,
            thumb_width: null,
            title: null,
            updated_in_days: null,
            updated_in_days_formatted: null
        },

        initialize: function() {
            if (app.favourites && app.favourites.length > 0) {
                if (app.favourites.get(this.get('guid'))) {
                    this.set('inFavourites', true);
                }
            }
        },

        toggleFavourites: function(){
            this.set('inFavourites', !this.get('inFavourites'));
        },

        search: function(query) {
            var httpURL = 'http://api.nestoria.co.uk/api' +
                '?&action=search_listings&pretty=0&encoding=json&' + '' +
                'guid=' + query;

            var self = this;
            $.ajax({
                url: httpURL,
                timeout: 5000,
                jsonp: "callback",
                dataType: "jsonp",
                data: {
                    format: "json"
                },
                success: self.processingOfResponse.bind(self),
                error: self.processingOfError.bind(self)
            });
        },

        processingOfResponse: function(response) {
            var code,
                response_text;
            code = response.response.application_response_code;
            response_text = response.response.application_response_test;
            if (code === '111') {
                console.log('Получен ответ на запрос объявления по guid');
                Backbone.trigger('offer:found', response.response.listings[0])
            } else {
                console.log('SOME ERROR:', {code: code, response_text: response_text});
                Backbone.trigger('offer:error', {code: code, response_text: response_text});
            }
        },

        processingOfError: function(jqXHR, textStatus) {
            var error_text = '';
            // todo: сделать обработку ошибок
            if (textStatus === 'timeout') {
                //вывести сообщение о превышении времени ожидания ответа
                //do something. Try again perhaps?
                console.log('Failed from timeout');
                error_text = messages.ERROR_TIMEOUT;
            } else {
                // вывести сообщение об ошибке.
                alert('Something is wrong');
                console.log('textStatus', textStatus);
                console.log('jqXHR:', jqXHR.status, jqXHR.statusText);
                // тут может быть 404 или любая другая ошибка от сервера, не от API
                // todo: добавить более точное определдение ошибок, и сообщения о них.
                error_text = messages.ERROR_OTHER;
            }
            // todo: инициировать изменение состояния главной вьюхи, передать текст ошибки
            app.errorText = error_text;
            app.mainView.render();
        }

    });
})();