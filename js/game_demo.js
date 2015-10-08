(function() {

  var HORIZONTAL_COORDINATE = 50;
  var cloudsContainer = document.querySelector('.header-clouds');

  var isCloudsVisible = true;

  function getCloudsOffset() {
    return HORIZONTAL_COORDINATE - Math.ceil(window.scrollY/5);
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

  function cloudsPositionUpdate() {
    if (isCloudsVisible) {
      cloudsOffset();
    }
  }

  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', cloudsPositionUpdate);

    window.addEventListener('scroll', function cloudsVisibilityCheck() {
      clearTimeout(someTimeout);

      someTimeout = setTimeout(function() {
        if (isContainerInTheWindow() == isCloudsVisible) {
          return;
        }

        isCloudsVisible = isContainerInTheWindow();

        if (isContainerInTheWindow()) {
          showClouds();
        } else {
          turnCloudsParallaxOff();
        }
      }, 100);
    })
  }

  function stopParallaxListener() {
    window.addEventListener('stopParallax', function() {
      window.removeEventListener('scroll', cloudsPositionUpdate);
    })
  }

  function startParallaxAgain() {
    window.addEventListener('startParallax', function() {
      cloudsOffset();
    })
  }

  initScroll();
  stopParallaxListener();
  startParallaxAgain();

})();
