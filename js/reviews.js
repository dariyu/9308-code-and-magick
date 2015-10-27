/* global ReviewCollection: true ReviewView: true */

'use strict';

(function() {
  /**
   * @const
   * @type {number}
   */
  var REQUEST_FAILURE_TIMEOUT = 10000;

  /**
   * @const
   * @type {number}
   */
  var PAGE_SIZE = 3;

  /**
   * Контейнер фильтров
   * @type {Element}
   */
  var reviewsFilter = document.querySelector('.reviews-filter');

  /**
   * Скрывает фильтры при отсутствии отзывов
   */
  reviewsFilter.classList.add('invisible');

  /**
   * Контейнер отзывов
   * @type {Element}
   */
  var reviewsContainer = document.querySelector('.reviews-list');

  /**
   * @type {number}
   */
  var currentPage = 0;

  /**
   * @type {Array}
   */
  var renderedReviews = [];

  /**
   * @type {ReviewCollection}
   */
  var reviewCollection = new ReviewCollection();

  /**
   * @type {Array}
   */
  var initiallyLoaded = [];

  /**
   * Постранично отрисовывает отзывы на странице
   * @param {number} pageNumber - Номер текущей страницы с отзывами
   * @param {boolean} replace - аргумент, отвечающий за очистку контейнера
   */
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
    /**
     * Отрисовывает кнопку "Еще отзывы"
     */
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

  /**
   * Добавляет класс с ошибкой контейнеру отзывов в случае ошибки при загрузке
   */
  function showFailure() {
    reviewsContainer.classList.add('reviews-load-failure');
  }

  /**
   * Фильтрация и сортировка отзывов. Принимает на вход список отзывов и ID фильтра
   * Возвращает отфильтрованный и отсортированный список, и записывает фильтр
   * в localStorage
   * @param {string} filterID - ID фильтра, по которому производился клик
   * @return {Array}
   */
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
  }

  /**
   * Обработчик события клика по кнопке фильтра
   */
  function initFilters() {
    var filtersContainer = document.querySelector('.reviews-filter');

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      location.hash = 'filters/' + clickedFilter.id;
    });
  }

  /**
   * Функция, добавляющая обработчик события изменения хэша
   */
  function addHashChangeListener() {
    window.addEventListener('hashchange', function() {
      parseURL();
    });
  }

  /**
   * Обрабатывает хэш адресной строки и запускает фильтрацию,
   * в соответствии с ID фильтра в адресной строке
   */
  function parseURL() {
    var hashArray = location.hash.match(/^#filters\/(\S+)$/);
    var filterId;
    if (hashArray) {
      filterId = hashArray[1];
    } else {
      filterId = 'reviews-all';
    }
    setActiveFilter(filterId);
  }

  /**
   * Вызывает функцию фильтрации отзывов
   * @param {string} filterID - ID фильтра, по которому производился клик
   */
  function setActiveFilter(filterID) {
    filterReviews(filterID);
    currentPage = 0;
    renderReviews(currentPage, true);
    document.getElementById(filterID).checked = true;
  }

  /**
   * Проверяет возможность отрисовки следующей страницы отзывов
   * @return {boolean}
   */
  function isNextPageAvailable() {
    return currentPage + 1 < Math.ceil(reviewCollection.length / PAGE_SIZE);
  }

  /**
   * Обработчик события клика по кнопке добавления страницы отзывов,
   * если следующая страница есть и прячет кнопку, если следующей
   * страницы нет
   */
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
    addHashChangeListener();

    parseURL();
  }).fail( function() {
    showFailure();
  });

  /**
   * Показывает фильтры после загрузки отзывов
   */
  reviewsFilter.classList.remove('invisible');

})();
