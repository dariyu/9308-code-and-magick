(function() {

  var HORIZONTAL_COORDINATE = 50;
  var cloudsContainer = document.querySelector('.header-clouds');

  function getCloudsScroll() {
    return HORIZONTAL_COORDINATE - Math.ceil(window.scrollY/5);
  }

  function isContainerInTheWindow() {
    return cloudsContainer.getBoundingClientRect().bottom > 0;
  }

  function cloudsOffset() {
    if (isContainerInTheWindow()) {
      cloudsContainer.style.backgroundPosition = getCloudsScroll() + '%' + '0%';
    }
  }

  function hideClouds() {
    if (!isContainerInTheWindow()) {
      window.dispatchEvent(new CustomEvent('stopParallax'));
    }
  }

  function initScroll() {
    window.addEventListener('scroll', function() {
      cloudsOffset();
    });

    window.addEventListener('stopParallax', function() {
      window.removeEventListener('scroll', cloudsOffset());
    })
  }

  initScroll();

})();
