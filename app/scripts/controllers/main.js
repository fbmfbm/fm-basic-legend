'use strict';

angular.module('fmBasicLegendApp')
  .controller('MainCtrl', ['$scope', 'Sdl', function ($scope,Sdl) {

    $scope.typeMap = [
      {label: "Carte Chorophlet", style:"fbm_pop1_orange", xmlSLD : "fbm_pop1_orange.xml", type:"chorophlet"},
      {label: "Carte Degradée de cercles", style:"fbm_pop1_proport_rose", xmlSLD : "fbm_pop_circle.xml", type:"circle"},
      {label: "Carte Proportionnelle", style:"fbm_pop1_proport2_rose", xmlSLD : "fbm_proportion1.xml", type:"symbole"},
    ]

    $scope.selectedmap = $scope.typeMap[0];




  	////////////////def map ///////////
     var pos_bordeaux = new OpenLayers.LonLat("-38942.249144498", "5585455.9961036");

          
     var zoom_bordeaux = 8;

      $scope.position1 = {lonlat:pos_bordeaux,zoom:zoom_bordeaux};


    /////////////////////////////////////////////////////////////

    var optObj = {isBaseLayer: false, opacity: 0.9, visibility: true};

    $scope.layerarray2 = [
        {title: "Population", serverUrl: "http://www.scifmcn.com:8080/geoserver/geofla2013/wms",layerName:"geofla2013:communes_metro_13", style:$scope.selectedmap.style, optObj:optObj},
        {title: "Départements 1", serverUrl: "http://www.scifmcn.com:8080/geoserver/geofla2013/wms",layerName:"geofla2013:departements_13",style:'fbm_limites_blanches_2px', optObj:optObj},
        {title: "Region 1", serverUrl: "http://www.scifmcn.com:8080/geoserver/geofla2013/wms",layerName:"geofla2013:regions_13",style:'fbm_limites_brunes', optObj:optObj}
      ];

    ////////////////////////////////////////////////////////////

    /////////////////// def legende /////////////////////

    $scope.sld = Sdl;


    //$scope.sld .getSld("sld_polygone1.xml").then(function(data){
    $scope.sld .getSld($scope.selectedmap.xmlSLD).then(function(data){
    	
    	console.log("sldTest est ok");//data.data)
    	$scope.sldTest = data.data;
        
		///////////test////////////////

    	//var sldFormat = new OpenLayers.Format.SLD();
    	
    	//$scope.sldObject = sldFormat.read($scope.sldTest);
    	//console.log($scope.sldObject);
    	//$scope.$apply;
    	/////////////fin du test////////
        

    });

    /////////////////EXPERIMENT /////////

    $scope.getMapInfo = function(){

        console.log("test");
    }

    $scope.$watch('selectedmap', function(){
      $scope.sld .getSld($scope.selectedmap.xmlSLD).then(function(data){
      $scope.sldTest = data.data;
    });
    });





  }]);
