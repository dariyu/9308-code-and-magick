/* global Backbone: true */

'use strict';

(function() {

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
