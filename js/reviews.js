(function() {
  var ratingClass = {
    '1' : 'review-rating-one',
    '2' : 'review-rating-two',
    '3' : 'review-rating-three',
    '4' : 'review-rating-four',
    '5' : 'review-rating-five'
  }

  var reviewsFilter = document.querySelector('.reviews-filter');

  reviewsFilter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsTemplate = document.getElementById('review-template');
  var reviewsFragment = document.createDocumentFragment();

  reviews.forEach(function(review, i) {
    var newReviewElement = reviewsTemplate.content.children[0].cloneNode(true);

    newReviewElement.querySelector('.review-rating').classList.add(ratingClass[review['rating']]);
    newReviewElement.querySelector('.review-text').textContent = review['description'];

    reviewsFragment.appendChild(newReviewElement);

    if (review['author']['picture']) {
      var authorPicture = new Image();
      authorPicture.src = review['author']['picture'];

      authorPicture.onload = function() {
        newReviewElement.replaceChild(authorPicture, newReviewElement.childNodes[1]);
        authorPicture.classList.add('review-author');
        authorPicture.width = 124;
        authorPicture.height = 124;
      }

      authorPicture.onerror = function(evt) {
        newReviewElement.classList.add('review-load-failure');
      }
    }
  });

  reviewsContainer.appendChild(reviewsFragment);

  reviewsFilter.classList.remove('invisible');

})();
