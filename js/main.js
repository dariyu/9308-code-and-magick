'use strict';

requirejs.config({
  baseUrl: 'js',
  paths: {
    cookies: '../lib/cookies',
    jquery: '../lib/jquery-1.11.3.min',
    underscore: '../lib/underscore-min',
    backbone: '../lib/backbone-min'
  },
  shim: {
    'backbone': {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    }
  }
});

define([
  'reviews',
  'gallery',
  'game_demo',
  'form',
  'form-validate'
]);
