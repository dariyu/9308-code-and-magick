/* global Review: true */

(function() {

  var ratingClass = {
    '1' : 'review-rating-one',
    '2' : 'review-rating-two',
    '3' : 'review-rating-three',
    '4' : 'review-rating-four',
    '5' : 'review-rating-five'
  };

  var reviewsTemplate = document.getElementById('review-template');

  var Review = function(data) {
     this._data = data;
     this.element_ = null;
   };

  Review.prototype.render = function(container) {
    var newReviewElement = reviewsTemplate.content.children[0].cloneNode(true);

    newReviewElement.querySelector('.review-rating').classList.add(ratingClass[this._data.rating]);
    newReviewElement.querySelector('.review-text').textContent = this._data.description;

    if (this._data.author.picture) {
      var authorPicture = new Image();
      authorPicture.src = this._data.author.picture;

      authorPicture.addEventListener('load', function() {
        newReviewElement.replaceChild(authorPicture, newReviewElement.childNodes[1]);
        authorPicture.classList.add('review-author');
        authorPicture.width = 124;
        authorPicture.height = 124;
      });

      authorPicture.addEventListener('error', function(evt) {
        newReviewElement.classList.add('review-load-failure');
      });
    }

    container.appendChild(newReviewElement);

    this.element_ = newReviewElement;
  };

  Review.prototype.unrender = function() {
    this.element_.parentNode.removeChild(this.element_);
    this.element_ = null;
  };

  window.Review = Review;

})();
