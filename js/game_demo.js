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
    cloudsContainer.style.backgroundPosition = getCloudsScroll() + '%' + '0%';
  }

  function initScroll() {
    window.addEventListener('scroll', function() {
      if (isContainerInTheWindow()) {
        cloudsOffset();
      } else {
        window.dispatchEvent(new CustomEvent('stopParallax'));
      }
    });
  }

  function removeScrollListener() {
    window.addEventListener('stopParallax', function() {
      window.removeEventListener('scroll', cloudsOffset());
    })
  }

  initScroll();
  removeScrollListener();

})();
