/* global Backbone: true ReviewModel: true */

(function() {

  var ReviewCollection = Backbone.Collection.extend({

    model: ReviewModel,
    url: 'data/reviews.json'

  });

  window.ReviewCollection = ReviewCollection;

})();
