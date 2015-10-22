/* global Backbone: true */

'use strict';

(function() {

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

  window.ReviewModel = ReviewModel;

})();
