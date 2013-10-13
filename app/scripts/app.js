'use strict';

angular.module('fmBasicLegendApp', ['ngRoute', 'fm-basic-wms','fmBasicLegend'])
  .config(function ($routeProvider, $logProvider) {
    $logProvider.debugEnabled(true);
    //$logProvider.infoEnabled(false);
    //$logProvider.warnEnabled(false);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  angular.module('fmBasicLegendApp').run(function($rootScope, $log){

    $rootScope.$log = $log;

  });
