var app = app || {};

(function() {
    'use strict';

    app.OfferView = Backbone.View.extend({
        template: _.template($('#offer-template').html()),

        events: {
            'click #toggleFavorites': 'toggleFavorites'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            // todo: нужен рендер для отображения того, что это  объявление добавлено в  избранное
            this.render();
        },

        toggleFavorites: function() {
            var temp_model;
            if (this.model.get('inFavourites')) {
                // удаление модели
                console.log('удаляем из избранного');
                app.favourites.get(this.model.id).destroy();
            } else {
                console.log('добавляем в избранное');
                app.favourites.create(this.model.toJSON());
            }
            this.model.toggleFavourites();
        },

        render: function () {
            console.log('render OfferView');
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
})();
