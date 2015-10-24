/* global Game: true */

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
   * @type {Element}
   */
  var headerContainer = document.querySelector('header');

  /**
   * @type {boolean}
   */
  var isCloudsVisible = true;

  var game = new Game(document.querySelector('.demo'));
  var Verdict = Game.Verdict;

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
    return headerContainer.getBoundingClientRect().bottom > 0;
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
  function turnCloudsParallaxOff$PausedGame() {
    window.dispatchEvent(new CustomEvent('stopParallax'));
  }

  /**
   * Испускает кастомное событие startParallax
   */
  function showClouds$ContinueGame() {
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
          showClouds$ContinueGame();
        } else {
          turnCloudsParallaxOff$PausedGame();
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
      game.setGameStatus(Verdict.PAUSE);
    });
  }

  /**
   * Обработчик коастомного события startParallax, реагирующего
   * на появление облаков и включающего параллакс
   */
  function startParallaxAgain() {
    window.addEventListener('startParallax', function() {
      window.addEventListener('scroll', cloudsOffset);
      game.setGameStatus(Verdict.CONTINUE);
    });
  }

  initScroll();
  stopParallaxListener();
  startParallaxAgain();

  game.initializeLevelAndStart();
  game.setGameStatus(Verdict.INTRO);

})();
