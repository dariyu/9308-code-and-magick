/* global Backbone: true ReviewModel: true */

'use strict';

(function() {

  var ReviewCollection = Backbone.Collection.extend({

    model: ReviewModel,
    url: 'data/reviews.json'

  });

  window.ReviewCollection = ReviewCollection;

})();
