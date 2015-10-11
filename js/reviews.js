(function() {

  var readyState = {
    'UNSENT' : 0,
    'OPENED' : 1,
    'HEADERS_RECEIVED' : 2,
    'LOADING' : 3,
    'DONE' : 4
  };

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 3;
  var FILTER_ID = 'filterID';

  var reviewsFilter = document.querySelector('.reviews-filter');

  reviewsFilter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');
  var reviews;
  var currentPage = 0;
  var currentReviews;
  var renderedReviews = [];

  function renderReviews(reviewToRender, pageNumber, replace) {
    replace = replace !== undefined ? replace : true;
    pageNumber = pageNumber || 0;

    if (replace) {
      var el;
      while ((el = renderedReviews.shift())) {
        el.unrender();
      }
    }

    var reviewsFragment = document.createDocumentFragment();
    var reviewsFrom = pageNumber * PAGE_SIZE;
    var reviewsTo = reviewsFrom + PAGE_SIZE;
    var reviewToRender = reviewToRender.slice(reviewsFrom, reviewsTo);

    if (PAGE_SIZE > 0) {
      document.querySelector('.reviews-controls-more').classList.remove('invisible');
    }

    reviewToRender.forEach(function(reviewData, i) {

      var newReviewElement = new Review(reviewData);
      newReviewElement.render(reviewsFragment);
      renderedReviews.push(newReviewElement);
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
    localStorage.setItem(FILTER_ID, filterID);
    return filteredReviews;
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
    });
  }

  function setActiveFilter(filterID) {
    currentReviews = filterReviews(reviews, filterID);
    currentPage = 0;
    renderReviews(currentReviews, currentPage, true);
  }

  function isNextPageAvailable() {
    return currentPage + 1 < Math.ceil(currentReviews.length / PAGE_SIZE);
  }

  function initAddPage() {
    var addPageButton = document.querySelector('.reviews-controls-more');
        addPageButton.addEventListener('click', function() {
          renderReviews(currentReviews, ++currentPage, false);
          if (!isNextPageAvailable()) {
            addPageButton.classList.add('invisible');
          }
        });
  }

  initFilters();
  initAddPage();

  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setActiveFilter(localStorage.getItem(FILTER_ID) || ('reviews-all'));
  });

  reviewsFilter.classList.remove('invisible');

})();
