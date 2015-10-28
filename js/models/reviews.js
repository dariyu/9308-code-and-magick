'use strict';

define([
  'models/review'
], function(ReviewModel) {

  /**
   * Коллекция отзывов, наследуемая от Backbone.Collection и
   * принимающая ReviewModel и url файла с отзывами
   */
  var ReviewCollection = Backbone.Collection.extend({

    model: ReviewModel,
    url: 'data/reviews.json'

  });

  return ReviewCollection;

});
