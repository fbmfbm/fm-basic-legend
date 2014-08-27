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

					$rootScope.fbmBasicLegendVersion = "0.0.1";
	}])

	////////////////////////////////////////DIRECTIVE PRINCIPALE//////////////////////////////////////////

	fbmBasicLegendDirectives.directive('fmBasicLegend',['$compile', '$parse' ,function($compile, $parse){
		  return {
			restrict: 'E',
			replace: false,
			//transclude: true,
			template : '<div id="legende1" class="fm-basic-legend"><div class="fm-basic-legend-title"><h5>{{title}}<h5></div>'+
			'<div>{{subtitle}}</div>'+
			'<div ng-show="showClass"  ng-repeat="class in sldArray | orderBy: \'id\':true" style="height: 25px;margin-bottom:5px; border-bottom:1px solid #FFF;" >'+
			'<div class="fm-bloc-class" style="display: block;float:left; margin-right: 5px; width:15px; height:15px; background-color:{{class.fillColor}};border: solid {{class.strokeWidth}}px {{class.strokeColor}};"></div>'+
			'<p style="display:block-inline;">{{class.title}}</p>'+
			'</div>'+//div class
			'<div id="svg-draw" ng-show="showCircle"></div>'+//div circleProp
			'<div >{{comment}}</div>'+//div Comment
			'</div>',//div globale
			scope : {
				sld : "=",
				legendType: "@",
				title : "@",
				subtitle: "@",
				comment: "@", 
				sldVersion : "@"

			},
			link : function($scope, $elem, $attrs){

			var isDraw ; //// test for D3 draw function not to be repeated

			$scope.sldArray = [];
			
		   /*===================================================
		   =            fonction d'inititialisation            =
		   ===================================================*/

			function init(){


			if(!$scope.legendType){

				$scope.legendType = "chorophlet";

			};
			
			/*==========  adapte les dic css en fonction du type de légende  ==========*/
			
			
			switch($scope.legendType){
				case "symbole":
				$scope.showClass = false;
				$scope.showCircle = true;
				$scope.$compile;
				break;
				case "circle":
				$scope.showClass = false;
				$scope.showCircle = true;
				break;
				default :
				$scope.showClass = true;
				$scope.showCircle = false;
				break;
			}

			/*==========  switch le vocabulaire selon la version du sld   ==========*/
			
			
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



		

		}

		/*-----  End of init  ------*/
		
		init();


		/*===================================================================
		=            Fonction pour parsser le text du sld en xml            =
		===================================================================*/

			$scope.buildSdl = function(){
				
				$scope.sldArray = [];

				if($scope.sld){
					var sldXML = $.parseXML($scope.sld)//------------parse le txte en xml
					var $xml = $(sldXML);//$($scope.sld.data);

					/*==========  Niveau 1  : feature polygone   ==========*/			    	
					var poly = $xml.find( "FeatureTypeStyle").each(function(index){
	
					/*==========  Niveau 2 : Rules  ==========*/
					
						var rule = $(this).find('Rule').each(function(index){
							var sldObj ={};//-----contenue d'une rule
						
							sldObj.id = index;
							sldObj.title = $(this).find('Title').text();
							sldObj.name = $(this).find('Name').text();

							if($scope.legendType!=="symbole"){

								/*==========  construit chaque classes avec ses seuils ==========*/
								var filter = $(this).find('Filter').each(function(index){
		
									var isGreaterThan = $(this).find("PropertyIsGreaterThan");
									var literalIsGreaterThan = $(isGreaterThan).find("Literal");
									var isLessThanOrEqualTo = $(this).find("PropertyIsLessThanOrEqualTo");
									var literalIsLessThanOrEqualTo = $(isLessThanOrEqualTo).find("Literal");

									sldObj.literal = {isGreaterThan:"",isLessThanOrEqualTo:""};

									sldObj.literal.isGreaterThan = literalIsGreaterThan.text();
									sldObj.literal.isLessThanOrEqualTo = literalIsLessThanOrEqualTo.text();

								});
							};///////end if legendetype is not symbole///////
							
							/*==========  obtient la couleur de remplissage  ==========*/
							
							var fill = $(this).find('Fill').each(function(index){
								var searchStringPolyFill = $scope.typeParameter+"[name='fill']"
								sldObj.fillColor = $(this).find(searchStringPolyFill).text()
							});

							/*==========  Obtient le type de contour  ==========*/

							var stroke= $(this).find('Stroke').each(function(index){

								var searchStringStrokeWidth = $scope.typeParameter+"[name='stroke-width']";
								var searchStringStrokeColor = $scope.typeParameter+"[name='stroke']"; 
								sldObj.strokeWidth = $(this).find(searchStringStrokeWidth).text();//------épaisseur du contour		    	
								sldObj.strokeColor = $(this).find(searchStringStrokeColor).text();//-----couleur du contour
							});

					/*========================================================================
					=            Traitement particulier si legende de type cercle            =
					========================================================================*/
					
					if($scope.legendType=="circle"){

						var wellKnownName = $(this).find("WellKnownName").text();
						var size = $(this).find("Size").text();

						sldObj.wellKnownName = wellKnownName;
						sldObj.size = size ;
						//console.log(sldObj.wellKnownName);
						//console.log(sldObj.size);
						isDraw = false;

					}

					/*=====================================================================
					=            Traitement particulier si légende en symboles            =
					=====================================================================*/

					if($scope.legendType=="symbole"){
						var thisTitle = "";
						var wellKnownName = $(this).find("WellKnownName").text();
						var literal = $(this).find("Literal").each(function(index){
							
							var a = 0;
							var seuil = {};
							if(index%2==0){ 
									thisTitle = $(this).text();
								};
							if(index%2!=0){
								a++;
								var symboleObject = {};
								symboleObject.id = a;
								symboleObject.name = sldObj.name;
								symboleObject.fillColor = sldObj.fillColor;
								symboleObject.strokeWidth = sldObj.strokeWidth;
								symboleObject.strokeColor = sldObj.strokeColor;

								symboleObject.size = $(this).text();
								symboleObject.title = thisTitle;
								symboleObject.type = wellKnownName;

								$scope.sldArray.push(symboleObject);//

							};
						});

						isDraw = false;

					}else{
							$scope.sldArray.push(sldObj); //--------push a new rull
						}
					});/*-----  Fin du traitement des rules  ------*/
					});/*-----  Find du traitement au nieau feature  ------*/   		
				}/*-----  Fin du test de l'existence de données SDL  ------*/
			   
				/*================================================================================================
				=            Test si fin du traitement et eventuellement tracage des cymboles/cercles            =
				================================================================================================*/
	
				if(isDraw==false && ($scope.legendType=="symbole"||$scope.legendType=="circle")){
						$scope.buildSymbole();
						isDraw = true;
					};

			};/*-----  Fin de la fonction de traitement du parssing du XML/SLD  ------*/
			/*=====================================================================================================
			=            algorythme de calcule des taille des symbole utilisé dans l fonction suivante            =
			=====================================================================================================*/
			
			var displaySymboleSize = function(valDraw, valReal, symbLegendeSize){

				var buildSize = (valReal/valDraw)*symbLegendeSize;
				//console.log("("+valReal+"/"+valDraw+")*"+symbLegendeSize+"="+buildSize);
				return Math.round(buildSize);
			}
  
			/*===========================================
			=            DESSIN DES SYMBOLES/CERCLES           =
			===========================================*/

			$scope.buildSymbole = function(){

				var dataRef = $scope.sldArray;	
				var lenght = $scope.sldArray.length;
				var maxHeight = Number($scope.sldArray[length-1].size);
				var decalageHeight = 15;
				var decalageright = 30;
				var svgHeight = 100;
				var svgWidth = 100;

				if( $scope.legendType == "symbole") {svgHeight = 150; };
				if( $scope.legendType == "circle") {svgHeight = "80%"};

				/*==========  Dessin du cadre général  ==========*/	    		
				var svgContainer = d3.select("#svg-draw").append("svg").attr("width", svgWidth).attr("height", svgHeight).style("border","1px solid #CCC");

				
				/*----------------------------------------------------*/
				/*-------Dessin si symboles proportionels------------*/
				/*----------------------------------------------------*/
				if($scope.legendType=="symbole"){

						var yPos = 120;
						var alphaSize = 13

						var vMin = { 'val' : dataRef[1].size, 'display' : dataRef[1].title};
						var vMiddle = { 'val' : dataRef[2].size, 'display' : dataRef[2].title};
						var vMax = { 'val' : dataRef[3].size, 'display' : dataRef[3].title};

						(dataRef.length>3) ? vMax.val=dataRef[dataRef.length-1].size : vMax.val=dataRef[3].size;
						(dataRef.length>3) ? vMax.display=dataRef[dataRef.length-1].title : vMax.display=dataRef[3].title;

						vMin.display = displaySymboleSize( vMin.val, vMin.display, alphaSize);
						vMiddle.display = displaySymboleSize( vMiddle.val, vMiddle.display, alphaSize*2);
						vMax.display = displaySymboleSize( vMax.val, vMax.display, alphaSize*3);
						


						console.log( dataRef);
						
						for(var i=3;i>0;i--){

							var labelTxt="";

							switch(i){
								case 3:
								labelTxt=vMax.display;
								break;
								case 2:
								labelTxt=vMiddle.display;
								break;
								default : 
								labelTxt=vMin.display;
							}

							
							/*==========  si cercle symboles  ==========*/
							if(dataRef[0].type!='rectangle'){

								var autherCircle  = svgContainer.append("circle")
														.attr("cx", svgWidth/2)
														.attr("cy", yPos-(alphaSize*i))
														.attr("r", alphaSize*i)
														.style("fill", $scope.sldArray[0].fillColor)
														.style("fill-opacity", 0.4)
														.style("opacity", 0.6)
														.style("stroke", $scope.sldArray[0].strokeColor)
														.style("stroke-width", 1.0);
							}else{
							/*==========  si rectangle symboles  ==========*/
								var autherCircle  = svgContainer.append("rect")
														.attr("x", (svgWidth/2)-(alphaSize*i))
														.attr("y", yPos-(2*alphaSize*i))
														.attr("width", 2*alphaSize*i)
														.attr("height", 2*alphaSize*i)
														.style("fill", $scope.sldArray[0].fillColor)
														.style("fill-opacity", 0.4)
														.style("opacity", 0.6)
														.style("stroke", $scope.sldArray[0].strokeColor)
														.style("stroke-width", 1.0);

							}//------Fin du test sur le type de symbole-------/

							var autherLine = svgContainer.append("line")
														.attr("x1", 20+(svgWidth/2)-(alphaSize*4))
														.attr("y1", (yPos+1)-((alphaSize*i)*2))
														.attr("x2", svgWidth/2)
														.attr("y2", (yPos+1)-((alphaSize*i)*2))
														.style("stroke", "#000000")
														.style("stroke-width", 1.0);

							var autherLabel = svgContainer.append("text")
														.attr("x", 20+(svgWidth/2)-(alphaSize*4) )
														.attr("dy", (yPos -2)-((alphaSize*i)*2))
														.attr('text-anchor', 'start')
														.text(labelTxt);

						}

							/*
							var autherCircle = svgContainer.append("circle")
													.attr("cx", svgWidth/2)
													.attr("cy", decalageHeight+(($scope.sldArray[i].size)-($scope.sldArray[i].strokeWidth)*2))
													.attr("r", $scope.sldArray[i].size)
													//.style("fill", $scope.sldArray[i].fillColor)
													.style("opacity", .1)
													.style("stroke", $scope.sldArray[i].strokeColor)
													.style("stroke-width", 1.0);

							if(i==0||i==(lenght-2)){

								var autherLine = svgContainer.append("line")
														.attr("x1", decalageright)
														.attr("y1", decalageHeight+($scope.sldArray[i].size*2))
														.attr("x2", (maxHeight*(1))+decalageright)
														.attr("y2",decalageHeight+($scope.sldArray[i].size*2))
														.style("stroke", "#000000")
														.style("stroke-width", 1.0);

								var autherLabel = svgContainer.append("text")
														.attr("x", (maxHeight*(1))+decalageright)
														.attr("dy", decalageHeight+($scope.sldArray[i].size*2))
														.attr('text-anchor', 'start')
														.text($scope.sldArray[i].title);
												*/
				};/*------Fin du dessin des symboles -----*/

				/*------------------------------------------*/
				/*---------- Dessin si Cercles  -----------*/
				/*------------------------------------------*/
				if($scope.legendType=="circle"){
				/*==========  Boucle pour chaque éléments du tableau  ==========*/
					$scope.sldArray.reverse();//----inversion de l'ordre des + grands aux + petits pour cercles
					for (var i=0; i<$scope.sldArray.length;i++){
						
							//console.log(decalageHeight);
							var autherCircle = svgContainer.append("circle")
															.attr("cx", decalageright)
															.attr("cy", decalageHeight +Number($scope.sldArray[i].size))
															.attr("r", $scope.sldArray[i].size)
															.style("fill", $scope.sldArray[i].fillColor)
															.style("opacity", .9)
															.style("stroke", "#000000")
															.style("stroke-width", 1.0);


							var autherLine = svgContainer.append("line")
																.attr("x1", decalageright+Number($scope.sldArray[i].size))
																.attr("y1", decalageHeight+Number($scope.sldArray[i].size))
																.attr("x2", Number(maxHeight)+decalageright+5)
																.attr("y2",decalageHeight+($scope.sldArray[i].size*1))
																.style("stroke", "#000000")
																.style("stroke-width", 1.0);



							var autherLabel = svgContainer.append("text")
																.attr("x", Number(maxHeight)+decalageright+8)
																.attr("dy", 3+decalageHeight+Number($scope.sldArray[i].size))
																.attr('text-anchor', 'start')
																.text($scope.sldArray[i].title);

							var verticalShift = Number($scope.sldArray[i].size)*2

							if(verticalShift<20) verticalShift = 20;
							decalageHeight += verticalShift; 
							
					};/*-----  Fin de la boucle pour chaques éléments du tableau  ------*/
				};/*-----  Fin du dessin  des ligne  ------*/
				};/*-----  Fin du dessin des symboles  ------*/
				/*=============================================================================
				=            Ecoute de l'attribut sld pour création ou actualisation          =
				=============================================================================*/
				
				$scope.$watch('sld', function(newValue, oldValue){
					d3.select("svg").remove();
					init();
					$scope.buildSdl();
					
				}, true);
				

			}
		}
	}]);
}).call(this);