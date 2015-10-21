/* global Backbone: true */

'use strict';

(function() {

  var ratingClass = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  var reviewsTemplate = document.getElementById('review-template');

  var ReviewView = Backbone.View.extend({

    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    events: {
      'click': '_onClick'
    },

    tagName: 'article',

    className: 'review',

    render: function() {
      this.el.appendChild(reviewsTemplate.content.children[0].cloneNode(true));

      this.el.querySelector('.review-rating').classList.add(ratingClass[this.model.get('rating')]);
      this.el.querySelector('.review-text').textContent = this.model.get('description');

      if (this.model.get('author').picture) {
        var authorPicture = this.el.querySelector('.review-author');
        authorPicture.src = this.model.get('author').picture;

        authorPicture.addEventListener('load', this._onImageLoad);
        authorPicture.addEventListener('error', this._onImageFail);
        authorPicture.addEventListener('abort', this._onImageFail);
      }
    },

    _onClick: function(evt) {
      var goodReview = this.el.querySelector('span.review-quiz-answer:first-child');
      var badReview = this.el.querySelector('span.review-quiz-answer:last-child');
      if (evt.target === goodReview) {
        this.model.helpful();
      }
      if (evt.target === badReview) {
        this.model.unHelpful();
      }
    },

    _onImageLoad: function(evt) {
      var loadedImage = evt.path[0];
      this._cleanupImageListeners(loadedImage);

      loadedImage.width = 124;
      loadedImage.height = 124;
    },

    _onImageFail: function(evt) {
      var failedImage = evt.path[0];
      this._cleanupImageListeners(failedImage);

      this.el.classList.add('review-load-failure');
    },

    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageFail);
      image.removeEventListener('abort', this._onImageFail);
    }

  });

  window.ReviewView = ReviewView;
})();
