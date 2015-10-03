(function() {
  var ratingClass = {
    '1' : 'review-rating-one',
    '2' : 'review-rating-two',
    '3' : 'review-rating-three',
    '4' : 'review-rating-four',
    '5' : 'review-rating-five'
  };

  var readyState = {
    'UNSENT' : 0,
    'OPENED' : 1,
    'HEADERS_RECEIVED' : 2,
    'LOADING' : 3,
    'DONE' : 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var reviewsFilter = document.querySelector('.reviews-filter');

  reviewsFilter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviews;

  function renderReviews(reviews) {
    reviewsContainer.innerHTML = '';

    var reviewsTemplate = document.getElementById('review-template');
    var reviewsFragment = document.createDocumentFragment();

    reviews.forEach(function(review, i) {
      var newReviewElement = reviewsTemplate.content.children[0].cloneNode(true);

      newReviewElement.querySelector('.review-rating').classList.add(ratingClass[review.rating]);
      newReviewElement.querySelector('.review-text').textContent = review.description;

      reviewsFragment.appendChild(newReviewElement);

      if (review.author.picture) {
        var authorPicture = new Image();
        authorPicture.src = review.author.picture;

        authorPicture.onload = function() {
          newReviewElement.replaceChild(authorPicture, newReviewElement.childNodes[1]);
          authorPicture.classList.add('review-author');
          authorPicture.width = 124;
          authorPicture.height = 124;
        };

        authorPicture.onerror = function(evt) {
          newReviewElement.classList.add('review-load-failure');
        };
      }
    });
    reviewsContainer.appendChild(reviewsFragment);
  }

  function showFailure() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  function loadReviews(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/reviews.json');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case readyState.OPENED:
          reviewsContainer.classList.add('reviews-list-loading');
          break;

        case readyState.DONE:
          if (loadedXhr.status == 200) {
            var data = loadedXhr.response;
            reviewsContainer.classList.remove('reviews-list-loading');
            reviewsContainer.classList.remove('reviews-load-failure');
            callback(JSON.parse(data));
          }

          if (loadedXhr.status > 400) {
            showFailure();
          }
        break;
        default : break;
      }
    };
    xhr.ontimeout = function() {
      showFailure();
    }
  }

  function filterReviews(reviews, filterID) {
    var filteredReviews = reviews.slice(0);

    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = reviews.filter(function(obj) {
            var reviewDate = new Date(obj.date);
            var recentDate = new Date('2015-04-02');
            return reviewDate >= recentDate;
        });
        filteredReviews.sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
         });
        break;

      case 'reviews-good' :
        filteredReviews = reviews.filter(function(obj) {
          return obj.rating >= 3;
        });
        filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
       break;

      case 'reviews-bad' :
        filteredReviews = reviews.filter(function(obj) {
          return obj.rating <= 2;
        });
        filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
      break;

      case 'reviews-popular' :
        filteredReviews = reviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
      break;

      case 'reviews-all':
      default :
        filteredReviews = reviews.slice(0);
        break;
    }
    return filteredReviews;
  }

  function initFilters() {
    var filtersElement = document.querySelectorAll('input[name=reviews]');
    for (var i = 0; i < filtersElement.length; i++) {
      filtersElement[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.id);
      }
    }
  }

  function setActiveFilter(filterID) {
    var filteredReviews = filterReviews(reviews, filterID);
    renderReviews(filteredReviews);
  }

  initFilters();
  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter('reviews-all');
  });

  reviewsFilter.classList.remove('invisible');

})();
