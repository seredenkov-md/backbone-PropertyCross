var app = app || {};

(function() {
    'use strict';

    app.FavoritesrView = Backbone.View.extend({

        tagName: 'div',

        template: _.template($('#favourites-template').html()),

        events: {
        },

        initialize: function () {
            this.listenTo(this.collection, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template);
            if (this.collection.length > 0) {
                this.collection.each(function(offer){
                    var itemView = new app.ItemView({ model: offer });
                    this.$('#favoritesList').append(itemView.render().el);
                }, this);
            } else {
                this.$('#favoritesList').append('You have not added any properties to your favourites');
            }
            return this;
        }

    });
})();
