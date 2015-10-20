var app = app || {};

(function() {
    'use strict';

    app.ResultsView = Backbone.View.extend({

        tagName: 'div',

        template: _.template($('#results-template').html()),

        events: {
            'click #load-more': 'loadMore'
        },

        initialize: function () {
            this.listenTo(this.collection, 'change', this.render);
            this.listenTo(Backbone, 'results:next', this.render);
        },

        render: function () {
            this.$el.html(this.template);
            console.log('resultsView.collection:', this.collection);
            if (this.collection.length > 0) {
                this.collection.each(function(offer){
                    var itemView = new app.ItemView({ model: offer });
                    this.$('#resultList').append(itemView.render().el);
                }, this);

                if ( (app.resultInfo.currentPage * app.resultInfo.pageSize < app.resultInfo.totalResults)
                        && ((app.resultInfo.currentPage) * app.resultInfo.pageSize < app.resultInfo.maxResult)) {
                    this.$('#load-more').show();
                    this.$('#load-more').html('Load more');
                } else {
                    this.$('#load-more').hide();
                }


            } else {
                this.$('#resultList').append('Here is empty');
            }
            return this;
        },

        loadMore: function() {

            this.$('#load-more').html('Loading...');
            console.log('Loading next offers...');
            app.resultInfo.currentPage++;
            console.log('app.resultInfo.currentPage', app.resultInfo.currentPage);
            app.results.search(app.resultInfo.placeName);
        }
        /*
        nextResults: function(results) {
            console.log('nextResults');
            this.render();
        }
        */
    });
})();