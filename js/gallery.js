/* global GalleryPicture: true */

'use strict';

(function() {
  /**
   * Список кодов клавиш для обработки
   * клавиатурных событий
   * @enum {number}
   */
  var key = {
    'LEFT': 37,
    'RIGHT': 39,
    'ESC': 27
  };

  /**
   * Возвращает значение не меньше min и не больше max
   * @param value
   * @param min
   * @param max
   * @return {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Контейнер галереи
   * @type {Element}
   */
  var galleryContainer = document.querySelector('.photogallery');

  /**
   * Конструктор галереи на основе коллекции Backbone. Создает свойства,
   * хранящие ссылки на элементы галереи, фиксирует контекст у обработчиков
   * событий
   * @constructor
   */
  var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._element = document.querySelector('.overlay-gallery');
    this._closeButton = document.querySelector('.overlay-gallery-close');
    this._leftButton = document.querySelector('.overlay-gallery-control-left');
    this._rightButton = document.querySelector('.overlay-gallery-control-right');
    this._pictureElement = this._element.querySelector('.overlay-gallery-preview');

    this._currentPhoto = 0;

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onLeftArrowClick = this._onLeftArrowClick.bind(this);
    this._onRightArrowClick = this._onRightArrowClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  /**
   * Показывает галерею, вешает на кнопки и окно обработчики событий,
   * показывает фотографию в соответствии с target.src
   * @param {string} src
   */
  Gallery.prototype.show = function(src) {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseButtonClick);
    this._leftButton.addEventListener('click', this._onLeftArrowClick);
    this._rightButton.addEventListener('click', this._onRightArrowClick);
    document.body.addEventListener('keydown', this._onDocumentKeyDown);

    this.setCurrentPhoto(this._photos.indexOf(this._photos.findWhere({url: src})));
  };

  /**
   * Скрывает галерею, удаляет обработчики событий, очищает свойства
   */
  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseButtonClick);
    this._leftButton.removeEventListener('click', this._onLeftArrowClick);
    this._rightButton.removeEventListener('click', this._onRightArrowClick);
    document.body.removeEventListener('keydown', this._onDocumentKeyDown);

    this._photos.reset();
    this._currentPhoto = 0;
  };

  /**
   * Перебирает коллекцию фотографий и записывает в массив их src
   * Создает модель и заполняет ее src из этого массива
   * Заполняет коллекцию
   */
  Gallery.prototype.setPhotos = function() {
    var imagesNodes = document.querySelectorAll('.photogallery-image img');
    var imageUrls = [];
    for (var i = 0; i < imagesNodes.length; i++) {
      imageUrls.push(imagesNodes[i].src);
    }

    this._photos.reset(imageUrls.map(function(photoSrc) {
      return new Backbone.Model({
        url: photoSrc
      });
    }));
  };

  /**
   * Обработчик события клика по крестику, вызывает метод hide
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onCloseButtonClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  /**
   * Обработчик события клика по стрелке влево
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onLeftArrowClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto - 1);
  };

  /**
   * Обработчик события клика по стрелке вправо
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onRightArrowClick = function(evt) {
    evt.preventDefault();
    this.setCurrentPhoto(this._currentPhoto + 1);
  };

  /**
   * Обработчик клавиатурных событий: переключает фотографии при
   * нажатии на стрелки и закрывает галерею при нажатии ESC
   * @param {Event} evt
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    switch (evt.keyCode) {
      case key.LEFT :
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;
      case key.RIGHT :
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
      case key.ESC :
        this.hide();
        break;
    }
  };

  /**
   * Устанавливает номер текущей фотографии. Отрисовывает галерею в соответствии
   * с индексом фотографии
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function(index) {
    index = clamp(index, 0, this._photos.length - 1);

    this._currentPhoto = index;

    var previewNumberContainer = this._pictureElement.children[0].cloneNode(true);
    var numberCurrent = previewNumberContainer.querySelector('.preview-number-current');
    var numberTotal = previewNumberContainer.querySelector('.preview-number-total');

    numberCurrent.textContent = this._currentPhoto + 1;
    numberTotal.textContent = this._photos.length;

    this._pictureElement.innerHTML = '';

    var imageElement = new GalleryPicture({ model: this._photos.at(this._currentPhoto) });
    imageElement.render();
    this._pictureElement.appendChild(previewNumberContainer);
    this._pictureElement.appendChild(imageElement.el);

  };

  /**
   * Обработчик события клика по фотографии в галерее.
   * Создает галерею, заполняет ее фотографиями и вызывает метод show,
   * передав в него src фотографии, по котороый был совершен клик
   */
  galleryContainer.addEventListener('click', function(evt) {
    if (evt.target.parentNode.classList.contains('photogallery-image')) {
      evt.preventDefault();
      var currentImage = evt.target.src;
      var gallery = new Gallery();
      gallery.setPhotos();
      gallery.show(currentImage);
    }
  });

  window.Gallery = Gallery;

})();
