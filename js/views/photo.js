'use strict';

(function() {

  /**
   * Представление фотографии в галерее, наследуемая
   * от Backbone.View
   */
  var GalleryPicture = Backbone.View.extend({

    tagName: 'img',

    render: function() {
      this.el.src = this.model.get('url');
    }
  });

  window.GalleryPicture = GalleryPicture;
})();
