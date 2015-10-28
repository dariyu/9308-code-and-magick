'use strict';

define(function() {
  /**
   * Функция, восставливающая введенные ранее значения
   * в поле "Имя" и значение оценки из cookies
   */
  var restoreValueFromCookies = function() {
    if (docCookies.hasItem(formReviewName.name)) {
      formReviewName.value = docCookies.getItem(formReviewName.name);
    }

    if (docCookies.hasItem('review-mark')) {
      formReview['review-mark'].value = docCookies.getItem('review-mark');
    }
  };

  /**
   * Форма отзыва
   * @type {Element}
   */
  var formReview = document.querySelector('.review-form');

  /**
   * Поле "Имя"
   * @type {Element}
   */
  var formReviewName = document.querySelector('#review-name');

  /**
   * Поле "Отзыв"
   * @type {Element}
   */
  var formReviewText = document.querySelector('#review-text');

  /**
   * Обработчик события изменения поля "Имя", убирающий соответствующую
   * надпись
   */
  formReviewName.addEventListener('change', function() {
    if (formReviewName.value) {
      document.querySelector('.review-fields-name').hidden = true;
    } else {
      document.querySelector('.review-fields-name').hidden = false;
    }
  });

  /**
   * Обработчик события изменения поля "Отзыв", убирающий
   * соответствующую надпись
   */
  formReviewText.addEventListener('change', function() {
    if (formReviewText.value) {
      document.querySelector('.review-fields-text').hidden = true;
    } else {
      document.querySelector('.review-fields-text').hidden = false;
    }
  });

  /**
   * @type {Date}
   */
  var birthDate = new Date('1989-01-08');

  /**
   * @type {Date}
   */
  var nowDate = new Date();

  /**
   * Переменная, хранящая сумму дней, прошедших от дня
   * рождения до текущего дня
   * @type {number}
   */
  var sumDay = nowDate - birthDate;

  /**
   * Обработчик события отправления формы отзыва,
   * который записывает значение поля "Имя" и оценку отзыва
   * в cookies
   */
  formReview.addEventListener('submit', function(evt) {
    evt.preventDefault();

    docCookies.setItem(formReviewName.name, formReviewName.value, nowDate + sumDay);

    docCookies.setItem('review-mark', formReview['review-mark'].value, nowDate + sumDay);

    formReview.submit();
  });

  restoreValueFromCookies(formReview);
});

