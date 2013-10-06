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


	//window.fmBasicWms = {};
	//window.fmBasicWms.i18n = {};

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
		    template : '<div class="fm-basic-legend"><div class="fm-basic-legend-title"><h5>{{title}}<h5></div>'+
		    '<div ng-repeat="class in sldArray | orderBy: \'id\':true" style="height: 25px;margin-bottom:5px; border-bottom:1px solid #FFF;" >'+
		    '<div class="fm-bloc-class" style="display: block;float:left; margin-right: 5px; width:15px; height:15px; background-color:{{class.fillColor}};border: solid {{class.strokeWidth}}px {{class.strokeColor}};"></div>'+
		    '<p style="display:block-inline;">{{class.title}}</p>'+
		    '</div></div>',
		    scope : {
		    	sld : "=",
		    	title : "@",
		    	subtitle: "@",
		    	comment: "@", 
		    	sldVersion : "@"

		    },
		    link : function($scope, $elem, $attrs){

		    $scope.sldArray = [];
		    /////Definition des modification de lecture des style en fonction de la version du SLD

		    if($attrs.sldVersion){
		    		if($attrs.sldVersion=="1.0.0"){
		    			$scope.typeParameter = "CssParameter";
		    		}else if($attrs.sldVersion=="1.1.0"){
		    			$scope.typeParameter = "SvgParameter";
		    		}else{
		    			$scope.typeParameter = "SvgParameter";
		    		}
		    }else{
		    	$scope.typeParameter = "SvgParameter";
		    }

		    ////////////////////////////////////////////////////////
		    $scope.buildSdl = function(){


		    	
	    		$scope.sldArray = [];
	    		
				if($scope.sld){

					/*
		///////////test////////////////

    	var sldFormat = new OpenLayers.Format.SLD();
    	
    	var buildSldObj = sldFormat.read($scope.sld);
    	//console.log(buildSldObj);

    	$scope.sldObj = {};
    	$scope.sldObj.version = buildSldObj.version;
    	
    	//////////////////////////////////////////////////////////////////////////////
    	var sldStyles = $.each(buildSldObj.namedLayers, function(key, value){
   		////////////////////////////////////////////////////////////////////////////
    		var namedLayers = $.each($(this), function(key, value){

    				console.log("1 - NamedLayers : "+ $(this)[key].name);

    				var userStyles = $.each($(this)[key].userStyles, function(key, value){

    					console.log("2 - UserStyles: " + $(this)[0].name);
    					
    					var rules = $.each($(this)[0].rules, function(key, value){
    							console.log("3 - Rules ");
	    					var symbolizer = $.each($(this), function(key, value){
		
    						if($(this)[0].symbolizer.Point){
		    					var pointSymbolizer = $.each($(this)[0].symbolizer.Point, function(key, value){
		    					
		    						console.log($(this));

		    					});////////end PointSymbolizer

		    				};


		    					if($(this)[0].symbolizer.Polygon){
			    					var polygonSymobolizer = $.each($(this)[0].symbolizer, function(key, value){

			    						var polygon = {};
			    						polygon.fill = $(this)[0].fill;
										polygon.fillColor= $(this)[0].fillColor;
										polygon.fillOpacity= $(this)[0].fillOpacity;
										polygon.stroke= $(this)[0].stroke;
										polygon.strokeColor= $(this)[0].strokeColor;
										polygon.strokeDashstyle= $(this)[0].strokeDashstyle;
										polygon.strokeOpacity= $(this)[0].strokeOpacity;
										polygon.strokeWidth= $(this)[0].strokeWidth;
			    							
			    					});////////end PolygonSymbolizer
		    					};

							});///////////// en symbolizer


    					});////////////end Rules
    					
    				});////////////end UserStyles

    			});////////////end namedLayers

    		});//////end sdlStyles
    	
			*/

    	//$scope.$apply;
    	/////////////fin du test////////
			
					console.log("Traitement du XML");
					//console.log($scope.sld);

					var sldXML = $.parseXML($scope.sld)//////convertion de la string en XML
		    		var $xml = $(sldXML);//$($scope.sld.data);
					///////////////////////////// Feature level ////////////////////////////
			    	var poly = $xml.find( "FeatureTypeStyle").each(function(index){

			    		//console.log('Dans le featureTypeStyle');///// FeatureTypeStyle
			    		//console.log(this);///// FeatureTypeStyle
			    		
			    	///////////////////////////////Rules level /////////////////////////////
			    		var rule = $(this).find('Rule').each(function(index){
			    			var sldObj ={};
			    			
			    			//console.log('Dans les rules');///// FeatureTypeStyle
			    			//console.log(index);

			    			sldObj.id = index;

			    			sldObj.title = $(this).find('Title').text();
			    			sldObj.name = $(this).find('Name').text();
			    			//console.log(sldObj.title);

			    	////////////////////////////////Fill level /////////////////////////////
			    			var fill = $(this).find('Fill').each(function(index){
			    				
			    				var searchStringPolyFill = $scope.typeParameter+"[name='fill']"
			    				sldObj.fillColor = $(this).find(searchStringPolyFill).text()
			    			
			    				//console.log(sldObj.fillColor);
			    			});
			    	///////////////////////	end fill level
			    	////////////////////////////////Strock level /////////////////////////////
			    			var stroke= $(this).find('Stroke').each(function(index){
			    				//var stroke= $(this).find('SvgParameter');

			    				var searchStringStrokeWidth = $scope.typeParameter+"[name='stroke-width']";
			    				sldObj.strokeWidth = $(this).find(searchStringStrokeWidth).text();
			    				//console.log(strokeWidth[0]);
			    	
			    				var searchStringStrokeColor = $scope.typeParameter+"[name='stroke']"; 
			    				sldObj.strokeColor = $(this).find(searchStringStrokeColor).text();
			    				


			    				//console.log(sldObj.strokeWidth);
			    				//console.log(sldObj.strokeColor);

			    			});
			    	///////////////////////	end strock level
			    			$scope.sldArray.push(sldObj);
			    		});
			    	///////////////////// end rules lebel ////////			    		
			    	});

			    	/////// end features level ////////			    
			    }
			    /////////end of if test //////

			    };
			    /////////////end build SDL functuon //////////////////////////////

			    $scope.$watch('sld', function(newValue, oldValue){
			    	console.log("update");

			    	$scope.buildSdl();


			    }, true);

			}
		}

		
	}]);
}).call(this);