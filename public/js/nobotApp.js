'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('nobotApp', [
  'nobotApp.controllers',
  'ngRoute',
  'ngResource',
  'vcRecaptcha',
  'angulartics',
  'angulartics.google.analytics',
  'blockUI'
])

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/new',
      controller: 'NewCtrl'
    }).
    when('/about', {
      templateUrl: 'partials/about'
    }).
    when('/privacy', {
      templateUrl: 'partials/privacy'
    }).
    when('/contact', {
      templateUrl: 'partials/contact'
    }).
    when('/n/:name', {
      templateUrl: 'partials/email',
      controller: 'EmailCtrl'
    }).
    when('/h/:id', {
      templateUrl: 'partials/email',
      controller: 'EmailCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
}).run(function($rootScope) {
  $rootScope.$on('$routeChangeStart', function() {
    NProgress.start();
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    NProgress.done();
  });
});

//simple filter for moment.js
app.filter('fromNow', function() {
  return function(dateString) {
    return moment(dateString).fromNow()
  };
});
