(function() {

  var HORIZONTAL_COORDINATE = 50;
  var cloudsContainer = document.querySelector('.header-clouds');

  function getCloudsScroll() {
    return HORIZONTAL_COORDINATE - Math.ceil(window.scrollY/5);
  }

  function isContainerInTheWindow() {
    return cloudsContainer.getBoundingClientRect().bottom > 0;
  }

  function checkContainerInTheWindow() {
    if (isContainerInTheWindow()) {
      window.dispatchEvent(new CustomEvent('offsetClouds'));
    } else {
      removeScroll();
    }
  }

  function initScroll() {
    window.addEventListener('scroll', function() {
      checkContainerInTheWindow();
    });

    window.addEventListener('offsetClouds', function() {
      cloudsContainer.style.backgroundPosition = getCloudsScroll() + '%' + '0%';
    })
  }

  function removeScroll() {
    window.removeEventListener('scroll', function() {
      checkContainerInTheWindow();
    })
  }

  initScroll();

})();
