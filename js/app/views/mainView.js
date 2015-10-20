var app = app || {};

(function() {
    'use strict';

    app.MainView = Backbone.View.extend({
        template: _.template($('#main-template').html()),
        locationTemplate: _.template($('#location-template').html()),
        historyLocationTemplate: _.template($('#history-location-template').html()),

        events: {
            'click #do-search': 'search',               // button
            'click .location':  'search',               // list of locations
            'keypress #query-text': 'searchOnEnter'     // EnterKey
        },

        search: function(event) {
            var dataKey,
                query;
            console.log("search....");
            console.log(event);

            app.results.reset();
            app.resultInfo.currentPage = 1;

            query = (event.currentTarget && event.currentTarget.getAttribute('data-key')) || this.$('#query-text').val();

            dataKey = this.$('#query-text').attr('data-key');
            query = dataKey || query;   // если атрибут data-key не пустой, тогда выполняем поиск по нему.
            if (!query) {
                return;
            }
            console.log('Производится поиск по запросу:', query);
            this.$('#overlay').show();
            app.results.search(query);
            console.log('Произведен поиск по запросу:', query);
        },

        searchOnEnter: function(e) {
            if ( e.which === ENTER_KEY ) {
                this.search(e);
            }
        },

        initialize: function () {
        },

        render: function() {
            console.log('!!!Render mainView!!!');
            this.$el.html(this.template);
            //this.$el.html(this.template(this.model.toJSON()));
            //console.log('app.posLocation', app.posLocation);
            if (app.errorText) {
                this.$('#error-area').show();
                this.$('#locations-area').hide();
                this.$('#error-area').append(app.errorText);
                app.errorText = '';
            } else {
                if (app.posLocation.length > 0) {
                    this.$('#locations-area').show();
                    app.posLocation.each(function(location){
                        this.$('#locations-area').append(this.locationTemplate(location.toJSON()));
                    }, this);
                    app.posLocation.reset([]); // или не очищать..? но когда..
                } else if (app.locations.length > 0) {
                    this.$('#locations-area').show();
                    app.locations.sort();
                    app.locations.each(function(location){
                        this.$('#locations-area').append(this.historyLocationTemplate(location.toJSON()));
                    }, this);
                } else {
                    this.$('#locations-area').hide();
                }
            }
            this.$('#overlay').hide();
            this.$('#query-text').focus();
            return this;
        }
    });
})();