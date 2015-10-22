'use strict';

(function() {
  var restoreValueFromCookies = function() {
    if (docCookies.hasItem(formReviewName.name)) {
      formReviewName.value = docCookies.getItem(formReviewName.name);
    }

    if (docCookies.hasItem('review-mark')) {
      formReview['review-mark'].value = docCookies.getItem('review-mark');
    }
  };

  var formReview = document.querySelector('.review-form');
  var formReviewName = document.querySelector('#review-name');
  var formReviewText = document.querySelector('#review-text');

  formReviewName.addEventListener('change', function() {
    if (formReviewName.value) {
      document.querySelector('.review-fields-name').hidden = true;
    } else {
      document.querySelector('.review-fields-name').hidden = false;
    }
  });

  formReviewText.addEventListener('change', function() {
    if (formReviewText.value) {
      document.querySelector('.review-fields-text').hidden = true;
    } else {
      document.querySelector('.review-fields-text').hidden = false;
    }
  });

  var birthDate = new Date('1989-01-08');
  var nowDate = new Date();
  var sumDay = nowDate - birthDate;

  formReview.addEventListener('submit', function(evt) {
    evt.preventDefault();

    docCookies.setItem(formReviewName.name, formReviewName.value, nowDate + sumDay);

    docCookies.setItem('review-mark', formReview['review-mark'].value, nowDate + sumDay);

    formReview.submit();
  });

  restoreValueFromCookies(formReview);
})();

