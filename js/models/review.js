/* global Backbone: true ReviewCollection: true */

(function() {

  var ReviewModel = Backbone.Model.extend({

    initialize: function() {
      this.set('isHelpful', false);
    },

    helpful: function() {
      this.set('isHelpful', true);
    },

    unHelpful: function() {
      this.set('isHelpful', true);
    }

  });

  window.ReviewModel = ReviewModel;

})();
