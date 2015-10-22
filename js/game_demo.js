'use strict';

(function() {
  /**
   * @const
   * @type {number}
   */
  var HORIZONTAL_COORDINATE = 50;

  /**
   * Контейнер с облаками
   * @type {Element}
   */
  var cloudsContainer = document.querySelector('.header-clouds');

  /**
   * @type {boolean}
   */
  var isCloudsVisible = true;

  /**
   * Возвращает горизонтальную координату облаков относительно скролла
   * @return {number}
   */
  function getCloudsOffset() {
    return HORIZONTAL_COORDINATE - window.scrollY / 5;
  }

  /**
   * Проверяет находится ли контейнер в облаками в области видимости
   * @return {boolean}
   */
  function isContainerInTheWindow() {
    return cloudsContainer.getBoundingClientRect().bottom > 0;
  }

  /**
   * Изменяет позицию облаков
   */
  function cloudsOffset() {
    cloudsContainer.style.backgroundPosition = getCloudsOffset() + '%' + '0%';
  }

  /**
   * Испускает кастомное событие stopParallax
   */
  function turnCloudsParallaxOff() {
    window.dispatchEvent(new CustomEvent('stopParallax'));
  }

  /**
   * Испускает кастомное событие startParallax
   */
  function showClouds() {
    window.dispatchEvent(new CustomEvent('startParallax'));
  }

  /**
   * Инициализация обработчиков событий скролла
   */
  function initScroll() {
    var cloudsVisibilityTimeout;
    /**
     * Вызов функции перемещения облаков при скролле
     */
    window.addEventListener('scroll', cloudsOffset);

    /**
     * Испускание кастомных событий исчезновения облаков и
     * отображения облаков по таймауту
     */
    window.addEventListener('scroll', function cloudsVisibilityCheck() {

      if (cloudsVisibilityTimeout) {
        return;
      }

      cloudsVisibilityTimeout = setTimeout(function() {
        clearTimeout(cloudsVisibilityTimeout);
        cloudsVisibilityTimeout = null;

        if (isContainerInTheWindow() === isCloudsVisible) {
          return;
        }

        isCloudsVisible = isContainerInTheWindow();

        if (isCloudsVisible) {
          showClouds();
        } else {
          turnCloudsParallaxOff();
        }
      }, 100);
    });
  }

  /**
   * Обработчик кастомного события stopParallax, реагирующего
   * на исчесновение облаков и отключающего параллакс
   */
  function stopParallaxListener() {
    window.addEventListener('stopParallax', function() {
      window.removeEventListener('scroll', cloudsOffset);
    });
  }

  /**
   * Обработчик коастомного события startParallax, реагирующего
   * на появление облаков и включающего параллакс
   */
  function startParallaxAgain() {
    window.addEventListener('startParallax', function() {
      window.addEventListener('scroll', cloudsOffset);
    });
  }

  initScroll();
  stopParallaxListener();
  startParallaxAgain();

})();
