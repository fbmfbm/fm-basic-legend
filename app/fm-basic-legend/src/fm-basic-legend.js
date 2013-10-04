/***********************************************
* fm-basic-wms JavaScript Library
* Authors: fbmfbm
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
* Compiled At: 01/10/2013 
***********************************************/
(function() {

	'use strict';
	// CONSTANTES///////////////////////////////////////////////////////////////////////////////////////
	var FBM_NAME = "fbm";


	window.fmBasicWms = {};
	window.fmBasicWms.i18n = {};

	// Declare app level module which depends on filters, and services
	var fbmBasicLegendServices = angular.module('fbmBasicLegend.services', []);
	var fbmBasicLegendDirectives = angular.module('fbmBasicLegend.directives', []);
	var fbmBasicLegendFilters = angular.module('fbmBasicLegend.filters', []);
	
	// initialization of services into the main module
	angular.module('fmBasicLegend', ['fbmBasicLegend.services','fbmBasicLegend.directives', 'fbmBasicLegend.filters']);

	angular.module('fmBasicLegend').run(["$rootScope", function($rootScope){

					$rootScope.fbmBasicLegendVersion = "0.0.0.1";
	}])

	////////////////////////////////////////DIRECTIVE PRINCIPALE//////////////////////////////////////////

	fbmBasicLegendDirectives.directive('fmBasicLegend',['$compile', '$parse' ,function($compile, $parse){
		  return {
		    restrict: 'E',
		    replace: false,
		    //transclude: true,
		    scope:{

		    },
		    template: '<div class="fm-basic-legend"></div>',
		    link: function($scope, $elem, $attrs){



		    }
		}
	}]);
}).call(this);