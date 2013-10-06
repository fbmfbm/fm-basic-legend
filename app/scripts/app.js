'use strict';

angular.module('fmBasicLegendApp', ['ngRoute', 'fm-basic-wms','fmBasicLegend'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
