/* global Backbone: true ReviewModel: true */

'use strict';

(function() {

  /**
   * Коллекция отзывов, наследуемая от Backbone.Collection и
   * принимающая ReviewModel и url файла с отзывами
   */
  var ReviewCollection = Backbone.Collection.extend({

    model: ReviewModel,
    url: 'data/reviews.json'

  });

  window.ReviewCollection = ReviewCollection;

})();
