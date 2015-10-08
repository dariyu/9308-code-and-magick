(function() {

  var HORIZONTAL_COORDINATE = 50;
  var cloudsContainer = document.querySelector('.header-clouds');

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

  function initScroll() {
    var someTimeout;
    var isCloudsVisible = true;

    window.addEventListener('scroll', function cloudsPositionUpdate() {
      if (isCloudsVisible) {
        cloudsOffset();
      }
    });

    window.addEventListener('scroll', function cloudsVisibilityCheck() {
      clearTimeout(someTimeout);

      someTimeout = setTimeout(function() {
        if (isContainerInTheWindow() == isCloudsVisible) {
          return;
        }
        if (!isContainerInTheWindow()) {
          turnCloudsParallaxOff();
        } else {
          showClouds();
        }
      }, 100);
    })
  }

  function stopParallaxListener() {
    window.addEventListener('stopParallax', function() {
      window.removeEventListener('scroll', cloudsOffset);
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
