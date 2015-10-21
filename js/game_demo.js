'use strict';

(function() {

  var HORIZONTAL_COORDINATE = 50;
  var cloudsContainer = document.querySelector('.header-clouds');

  var isCloudsVisible = true;

  function getCloudsOffset() {
    return HORIZONTAL_COORDINATE - window.scrollY / 5;
  }

  function isContainerInTheWindow() {
    return cloudsContainer.getBoundingClientRect().bottom > 0;
  }

  function cloudsOffset() {
    cloudsContainer.style.backgroundPosition = getCloudsOffset() + '%' + '0%';
  }

  function turnCloudsParallaxOff() {
    window.dispatchEvent(new CustomEvent('stopParallax'));
  }

  function showClouds() {
    window.dispatchEvent(new CustomEvent('startParallax'));
  }

  function initScroll() {
    var cloudsVisibilityTimeout;
    window.addEventListener('scroll', cloudsOffset);

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

  function stopParallaxListener() {
    window.addEventListener('stopParallax', function() {
      window.removeEventListener('scroll', cloudsOffset);
    });
  }

  function startParallaxAgain() {
    window.addEventListener('startParallax', function() {
      window.addEventListener('scroll', cloudsOffset);
    });
  }

  initScroll();
  stopParallaxListener();
  startParallaxAgain();

})();
