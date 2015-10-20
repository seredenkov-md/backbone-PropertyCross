// тут собирается история поиска - последние несколько мест поиска

/*global Backbone */
var app = app || {};

(function () {
    'use strict';

    // Favourites Collection
    // ---------------
    app.Locations = Backbone.Collection.extend({
        max_length: 6,  // размер истории (успешных) поисков
        // todo: добавить обработчик на событие add -
        // если размер будет привышать максимально допустимы, тогда отбрасываем лишние  с конца..
        model: app.Location,
        //localStorage: new Backbone.LocalStorage('todos-backbone'),
        localStorage: new Backbone.LocalStorage('PropertyCross-Locations'),

        trim: function() {
            if (this.length > this.max_length) {
                console.log('выполняется trim для app.locations');
                this.sort();
                this.models[this.max_length].destroy();
            }
        },

        comparator: function(location) {
            var time = new Date(location.get('time'));
            return -time;
        },

        initialize: function(){
            this.listenTo(this, 'add', this.trim);
            this.fetch();
        }

    });
})();