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
		    /////Definition des modification de lecture des style en fonction de la version du SLD
		   
		    function init(){


		    if(!$scope.legendType){

		    	$scope.legendType = "chorophlet";

		    };
		    console.log($scope.legendType);
		    ////////////////Display svg section/////////////
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

		    /////////////////////////////////
		    
		    
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

		}///en init

		init();
		    $scope.buildSdl = function(){


		    	
	    		$scope.sldArray = [];
	    		
				if($scope.sld){

			
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

			    			if($scope.legendType!=="symbole"){
				    			var filter = $(this).find('Filter').each(function(index){
		

				    						var isGreaterThan = $(this).find("PropertyIsGreaterThan");
					    					var literalIsGreaterThan = $(isGreaterThan).find("Literal");
					    					var isLessThanOrEqualTo = $(this).find("PropertyIsLessThanOrEqualTo");
					    					var literalIsLessThanOrEqualTo = $(isLessThanOrEqualTo).find("Literal");

					    					sldObj.literal = {isGreaterThan:"",isLessThanOrEqualTo:""};

					    					sldObj.literal.isGreaterThan = literalIsGreaterThan.text();
					    					sldObj.literal.isLessThanOrEqualTo = literalIsLessThanOrEqualTo.text();

					    					//console.log("isGreaterThan : "+ literalIsGreaterThan.text());
					    					//console.log("isLessThanOrEqual : "+ literalIsLessThanOrEqualTo.text());


				    			});
			    		};///////end if legendetype is not symbole///////

			    	////////////////////////////////Fill level /////////////////////////////
			    			var fill = $(this).find('Fill').each(function(index){

			    				
			    				var searchStringPolyFill = $scope.typeParameter+"[name='fill']"
			    				sldObj.fillColor = $(this).find(searchStringPolyFill).text()
			    				//console.log(sldObj.fillColor);
			    			});///////////////////////	end fill level


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
			    			});///////////////////////	end strock level


			    	///////////////////////////Symbole size and type //////////////////

			    	if($scope.legendType=="circle"){

			    						//console.log("Classe de type circle");
			    						var wellKnownName = $(this).find("WellKnownName").text();
			    						var size = $(this).find("Size").text();

			    						sldObj.wellKnownName = wellKnownName;
			    						sldObj.size = size ;
			    						//console.log(sldObj.wellKnownName);
			    						//console.log(sldObj.size);
			    						isDraw = false;

			    			}///////////////////////////end Symbole size and type //////////////////

			    	if($scope.legendType=="symbole"){
			    				var thisTitle = "";
			    				var literal = $(this).find("Literal").each(function(index){
			    					//console.log(index);
			    					var a = 0;
			    					
			    					if(index%2==0){ thisTitle = $(this).text() };
			    					if(index%2!=0){
			    						a++;
			    						console.log($(this).text());
			    						var symboleObject = {};
			    						symboleObject.id = a;
			    						//symboleObject.title = sldObj.title;
			    						symboleObject.name = sldObj.name;
			    						symboleObject.fillColor = sldObj.fillColor;
			    						symboleObject.strokeWidth = sldObj.strokeWidth;
			    						symboleObject.strokeColor = sldObj.strokeColor;

			    						symboleObject.size = $(this).text();
			    						symboleObject.title = thisTitle;

			    						$scope.sldArray.push(symboleObject);

			    					};
			    				});

			    				isDraw = false;

			    			}else{
			    				$scope.sldArray.push(sldObj); 
			    			}
			    		});///////////////////// end rules lebel ////////

			    	});/////// end features level ////////	
			    }
			    if(isDraw==false && ($scope.legendType=="symbole"||$scope.legendType=="circle")){
				    $scope.buildSymbole();
				    isDraw = true;
			    }//// build circle

			    /////////end of if test //////
			    };
			    /////////////end build SDL functuon //////////////////////////////

			    $scope.buildSymbole = function(){

			    	
			    	//Reverse data array for loop to greater to smaller
			    	var dataRef = $scope.sldArray;
			    	dataRef.reverse();


			    	
			    		var lenght = $scope.sldArray.length;
			    		var maxHeight = Number($scope.sldArray[length-1].size);
			    		var decalageHeight = 15;
			    		var decalageright = 30;
			    		//console.log(maxHeight);
			    		var svgHeight = 100;
			    		if( $scope.legendType == "symbole") {svgHeight = ((maxHeight + decalageHeight)*2); };
			    		if( $scope.legendType == "circle") {svgHeight = "80%"};

			    	var svgContainer = d3.select("#svg-draw").append("svg").attr("width", 170).attr("height", svgHeight).style("border","1px solid #CCC");

			    	///////////// boucle for drawing circles //////////
			    	for (var i=0; i<$scope.sldArray.length;i++){

			    		/////////////////If legende is Symbole //////////
			    		if($scope.legendType=="symbole"){

			    				

								var autherCircle = svgContainer.append("circle")
								                        .attr("cx", decalageright)
								                        .attr("cy", decalageHeight+(($scope.sldArray[i].size)-($scope.sldArray[i].strokeWidth)*2))
								                        .attr("r", $scope.sldArray[i].size)
								                        .style("fill", $scope.sldArray[i].fillColor)
								                        .style("opacity", .9)
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
								}
					};////end if symbole
					/////////////////If legende is circle //////////
					if($scope.legendType=="circle"){
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

					}



					} /////end draw circles en ligne
				}

			    


			    $scope.$watch('sld', function(newValue, oldValue){
			    	d3.select("svg").remove();
			    	console.log("update");
			    	init();
			    	$scope.buildSdl();
			    	
			    }, true);

			}
		}
	}]);
}).call(this);