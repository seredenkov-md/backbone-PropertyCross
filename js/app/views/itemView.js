var app = app || {};

(function() {
    'use strict';

    app.ItemView = Backbone.View.extend({

        tagName: 'div',
        className: 'itemContainer',

        template: _.template($('#item-template').html()),

        events: {
            'click .delete': 'deleteOffer'
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html( this.template(this.model.toJSON()));
            return this;
        }
    });
})();