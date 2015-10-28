'use strict';

define([
  'backbone'
], function(Backbone) {

  /**
   * Модель отзыва, наследуемая от Backbone.Model
   */
  var ReviewModel = Backbone.Model.extend({

    initialize: function() {
      this.set('isHelpful', false);
    },

    helpful: function() {
      this.set('isHelpful', true);
    },

    unHelpful: function() {
      this.set('isHelpful', false);
    }

  });

  return ReviewModel;

});
