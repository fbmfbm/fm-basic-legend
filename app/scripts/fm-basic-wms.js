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
	var fmBasicWmsServices = angular.module('fmBasicWms.services', []);
	var fmBasicWmsDirectives = angular.module('fmBasicWms.directives', []);
	var fmBasicWmsFilters = angular.module('fmBasicWms.filters', []);
	
	// initialization of services into the main module
	angular.module('fm-basic-wms', ['fmBasicWms.services','fmBasicWms.directives', 'fmBasicWms.filters']);

	angular.module('fm-basic-wms').run(["$rootScope", function($rootScope){

		$rootScope.fmBasicWmsVersion = "0.0.1";
	}])

	////////////////////////////////////////DIRECTIVE PRINCIPALE//////////////////////////////////////////

	fmBasicWmsDirectives.directive('fmBasicWms',['$compile', '$parse' ,function($compile, $parse){
		  return {
		    restrict: 'E',
		    replace: true,
		    //transclude: true,
		    scope:{
		    	mapLayers: "=",
		    	mapStyles: "=",
		    	mapLocalisation: '=',
		    	divref: "@divref",
		    	mapwidth: "@width",
		    	mapheight: "@height",
		    	mapSld : "="

		    },
		    //template: '<div id="{{divref}}" style="width: {{mapwidth}}; height: {{mapheight}}"></div>',
		    link: function($scope, $elem, $attrs){

		    	$scope.isLoaded = false;
		    	$scope.countLayers = [];

		    	//console.log($scope.mapLayers.length);

		    	
		    	var element = angular.element('<div id="'+$scope.divref+'" class="fbm-map"></div><p class="">{{select}}</p>');
			    var compiled = $compile(element);
			    $elem.append(element);
			    compiled($scope);

		    	if($scope.mapwidth && $scope.mapheight){
		    	
		    	 $("#"+$scope.divref).css({'width': $scope.mapwidth, 'height' :$scope.mapheight});

		    	}else{

		    		$("#"+$scope.divref).css({'width': '100px', 'height' : '100px'});
		    	};

		    	
		    	

		    	OpenLayers.ProxyHost = "http://localhost/cgi-bin/proxy.cgi?url=";

				var geographic = new OpenLayers.Projection("EPSG:4326");
				var mercator = new OpenLayers.Projection("EPSG:900913");


  				//////////////////////// build wms layer function ///////////////

				var buildWMSLayer = function(l_name, l_serverUrl, l_layers, l_styles, l_opt_obj, l_isWorkingLayer){

				    if(typeof(l_isWorkingLayer)==='undefined') l_isWorkingLayer) = false;

				    var wmsLayer = new OpenLayers.Layer.WMS(l_name, l_serverUrl,
				        { layers : l_layers,
				          styles: l_styles,//green',
				          transparent: true},
				          l_opt_obj 
				      );


				    wmsLayer.events.register('loadend',"", layersWmsDataLoaded);
				    wmsLayer.events.register('loadstart',"", layersWmsLoad);

				    if( l_isWorkingLayer == true){$scope.workinLayer = wmsLayer};

				    return wmsLayer;
				};
				//////////////////////// end of build wms layer function ///////////////
				//////////////////////// build layers stack function ///////////////
				var buildLayerStack = function(layersDataArray){

			
					for (var i=0; i<layersDataArray.length;i++){

						$scope.mapAllLayers.push(buildWMSLayer(layersDataArray[i].title,layersDataArray[i].serverUrl,layersDataArray[i].layerName,layersDataArray[i].style,layersDataArray[i].optObj,layersDataArray[i].isWorkLayer));
						//console.log("work : "+layersDataArray[i].isWorkLayer);
					}
			
				};
				//////////////////////// end of build layer stack function ///////////////	

				var preparMap = function(){


					$scope.mapAllLayers = [];

			   		if($attrs.osm){

			   			var osmLayer = new OpenLayers.Layer.OSM("Reliefs et réseaux", '',{attribution: ''});
			   			$scope.mapAllLayers[0] = osmLayer;
			   		}

			   		if($scope.mapLayers){
			   			
			   					buildLayerStack($scope.mapLayers);
			   		}

			   		init();


				}

				///////////////////////////////////Events map and layers ///////////////////////
				function layersWmsLoad(event){
					
					//console.log("Chargement de "+event.object.name);
					$scope.countLayers.push(event.object.name);

					$scope.isLoaded = false;

				};
				
				
				function layersWmsDataLoaded(event){

					//console.log(event);
					//console.log(event.object.name +" est maintenant chargé et utilise le style : "+event.object.params.STYLES);
					var layerWork = $scope.map.getLayersByName(event.name);
					var index = $scope.countLayers.indexOf(event.object.name);
					$scope.countLayers.splice(index,1);
					if($scope.countLayers.length == 0){
						console.log("Tous les éléments sont maintenant chargés ");
						$scope.isLoaded = true;
					}
					
					

				};


				////////////////////////////// Initialisation de la carte ////////////////////////
		     	function init(){


				     	$scope.map = new OpenLayers.Map({
				   			div: $scope.divref,
				   			projection:mercator,
				   			layers: $scope.mapAllLayers,
				   			controls: [
				   				new OpenLayers.Control.Navigation(),
	        					new OpenLayers.Control.ArgParser(),
	        					new OpenLayers.Control.Attribution()
				   			]
				   		});
		     		

			     	$scope.map.setCenter($scope.mapLocalisation.lonlat, $scope.mapLocalisation.zoom);
   	

		     	}
		     	//////////////////////////////Fin de l'initialisation de la carte ////////////

		     	preparMap();

		     	//////////actualisation des données du calque work et mise à jour de la map ////////////

		     	$scope.$watch("mapLayers",function(){

		     		//buildLayerStack($scope.mapLayers);
		     		var newLayersData;
		     		for (var i=0; i<$scope.mapLayers.length;i++){
		     			if($scope.mapLayers[i].title ==  $scope.workinLayer.name){newLayersData=$scope.mapLayers[i]};

		     		}

		     		console.log("Update du layer wms dans la directive : "+ $scope.workinLayer.name);
		     		$scope.workinLayer.mergeNewParams({"STYLES": newLayersData.style});
		     		//console.log($scope.workinLayer.params);
			

		     	}, true);/// end watch mapLayers

		    }
		  }
	}]);

}).call(this);
 

