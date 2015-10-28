'use strict';

define([
  'backbone'
], function(Backbone) {

  /**
   * Список констант классов для рейтингов
   * @enum {string}
   */
  var RatingClass = {
    '1': 'review-rating-one',
    '2': 'review-rating-two',
    '3': 'review-rating-three',
    '4': 'review-rating-four',
    '5': 'review-rating-five'
  };

  /**
   * @type {Element}
   */
  var reviewsTemplate = document.getElementById('review-template');

  /**
   * Представление отзыва
   */
  var ReviewView = Backbone.View.extend({

    initialize: function() {
      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onClick = this._onClick.bind(this);
    },

    events: {
      'click': '_onClick'
    },

    tagName: 'article',

    className: 'review',

    /**
     * Отрисовка отзыва
     */
    render: function() {
      this.el.appendChild(reviewsTemplate.content.children[0].cloneNode(true));

      this.el.querySelector('.review-rating').classList.add(RatingClass[this.model.get('rating')]);
      this.el.querySelector('.review-text').textContent = this.model.get('description');

      if (this.model.get('author').picture) {
        var authorPicture = this.el.querySelector('.review-author');
        authorPicture.src = this.model.get('author').picture;

        authorPicture.addEventListener('load', this._onImageLoad);
        authorPicture.addEventListener('error', this._onImageFail);
        authorPicture.addEventListener('abort', this._onImageFail);
      }
    },

    /**
     * Обработчик события клика по "Да" или "Нет", вызывающего
     * изменение модели
     * @param {Event} evt - событие клика
     * @private
     */
    _onClick: function(evt) {
      var goodReview = this.el.querySelector('.review-quiz-answer-yes');
      var badReview = this.el.querySelector('.review-quiz-answer-no');
      if (evt.target === goodReview) {
        this.model.helpful();
      }
      if (evt.target === badReview) {
        this.model.unHelpful();
      }
    },

    /**
     * Обработчик события загрузки фотографии автора отзыва
     * @param {Event} evt - событие загрузки фотографии
     * @private
     */
    _onImageLoad: function(evt) {
      var loadedImage = evt.path[0];
      this._cleanupImageListeners(loadedImage);

      loadedImage.width = 124;
      loadedImage.height = 124;
    },

    /**
     * Обработчик события возникновения ошибки при загрузке
     * фотографии автора - добавление соответствующего класса
     * контейнеру
     * @param {Event} evt - событие ошибки при загрузке фотографии
     * @private
     */
    _onImageFail: function(evt) {
      var failedImage = evt.path[0];
      this._cleanupImageListeners(failedImage);

      this.el.classList.add('review-load-failure');
    },

    /**
     * Удаление обработчиков события с загрузкой фотографии
     * @param {Image} image - фотография, загруженная или нет
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageFail);
      image.removeEventListener('abort', this._onImageFail);
    }

  });

  return ReviewView;
});
