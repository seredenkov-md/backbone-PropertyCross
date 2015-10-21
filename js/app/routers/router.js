var app = app || {};

(function () {
    'use strict';

    // ----------
    app.Router = Backbone.Router.extend({
        routes: {
            ''                      : 'index',      // главная страница приложения
            'favourites'            : 'favourites', // страница избранного
            'offer/:id'             : 'offer',      // страница просмотра объявления
            'results'               : 'results',    // страница результатов поиска
            '*other'                : 'index'
        },

        initialize: function() {
            // вообще, наверно, эти прослушивания собитий нужно вынести в диспетчер...
            // а не городить всё в роутере... :(
            this.listenTo(Backbone, 'offer:found', this.goToOffer);
            this.listenTo(Backbone, 'offer:error', this.goToError);
        },

        goToOffer : function(data) {
            var model = new app.Offer(data);
            if (model) {
                var view = new app.OfferView({model: model});
                $('#main').empty().append(view.render().el);
            } else {
                $('#main').empty().append('Something is broken');
            }
        },

        goToError : function(err) {
            $('#main').empty().append(err);
        },

        index: function() {
            console.log('главная страница');

            app.mainView = new app.MainView({});
            $('#main').empty().append(app.mainView.render().el);


        },

        favourites: function() {
            console.log('страница избранного');
            var view = new app.FavoritesrView({collection: app.favourites});
            $('#main').empty().append(view.render().el);
        },

        results: function() {
            console.log('страница результатов поиска');
            var view = new app.ResultsView({collection: app.results});
            $('#main').empty().append(view.render().el);
        },

        offer: function(id) {
            console.log('страница просмотра выбранного (' + id + ') объявления');
            var offer = new app.Offer();
            offer.search(id);   // todo: метод search вынести в метод класса, а не  экземпляра..
        }
    });
})();
