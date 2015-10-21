/* global ReviewCollection: true ReviewView: true */

'use strict';

(function() {

  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 3;
  var FILTER_ID = 'filterID';

  var reviewsFilter = document.querySelector('.reviews-filter');

  reviewsFilter.classList.add('invisible');

  var reviewsContainer = document.querySelector('.reviews-list');
  var currentPage = 0;
  var renderedReviews = [];

  var reviewCollection = new ReviewCollection();
  var initiallyLoaded = [];

  function renderReviews(pageNumber, replace) {

    var reviewsFragment = document.createDocumentFragment();
    var reviewsFrom = pageNumber * PAGE_SIZE;
    var reviewsTo = reviewsFrom + PAGE_SIZE;

    if (replace) {
      while (renderedReviews.length) {
        var reviewToRemove = renderedReviews.shift();
        reviewsContainer.removeChild(reviewToRemove.el);
        reviewToRemove.remove();
      }
    }

    if (PAGE_SIZE > 0) {
      document.querySelector('.reviews-controls-more').classList.remove('invisible');
    }

    reviewCollection.slice(reviewsFrom, reviewsTo).forEach(function(model) {
      var view = new ReviewView( { model: model } );

      view.render();
      reviewsFragment.appendChild(view.el);
      renderedReviews.push(view);
    });
    reviewsContainer.appendChild(reviewsFragment);
  }

  function showFailure() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  function filterReviews(filterID) {
    var filteredReviews = initiallyLoaded.slice(0);

    switch (filterID) {
      case 'reviews-recent':
        filteredReviews = initiallyLoaded.filter(function(obj) {
          var reviewDate = new Date(obj.date);
          var recentDate = new Date('2015-04-02');
          return reviewDate >= recentDate;
        });
        filteredReviews.sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case 'reviews-good' :
        filteredReviews = initiallyLoaded.filter(function(obj) {
          return obj.rating >= 3;
        });
        filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;

      case 'reviews-bad' :
        filteredReviews = initiallyLoaded.filter(function(obj) {
          return obj.rating <= 2;
        });
        filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;

      case 'reviews-popular' :
        filteredReviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;

      case 'reviews-all':
      default :
        filteredReviews.slice(0);
        break;
    }

    reviewCollection.reset(filteredReviews);
    localStorage.setItem(FILTER_ID, filterID);
  }

  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
    });
  }

  function setActiveFilter(filterID) {
    filterReviews(filterID);
    currentPage = 0;
    renderReviews(currentPage, true);
  }

  function isNextPageAvailable() {
    return currentPage + 1 < Math.ceil(reviewCollection.length / PAGE_SIZE);
  }

  function initAddPage() {
    var addPageButton = document.querySelector('.reviews-controls-more');
    addPageButton.addEventListener('click', function() {
      renderReviews(++currentPage, false);
      if (!isNextPageAvailable()) {
        addPageButton.classList.add('invisible');
      }
    });
  }

  reviewCollection.fetch( { timeout: REQUEST_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    initFilters();
    initAddPage();

    setActiveFilter(localStorage.getItem(FILTER_ID) || ('reviews-all'));
  }).fail( function() {
    showFailure();
  });

  reviewsFilter.classList.remove('invisible');

})();
