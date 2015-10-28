'use strict';

define([
  'models/review',
  'backbone'
], function(ReviewModel, Backbone) {

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
