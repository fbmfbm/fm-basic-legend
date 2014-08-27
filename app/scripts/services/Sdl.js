'use strict';

angular.module('fmBasicLegendApp')
  .factory('Sdl', ['$http', function ($http) {
    // Service logic
    // ...
          /*
          var sldName = "";

          var recupSLD = function(){

            var sld = $http.get(sldName).success(function(data,status,headr){

            }).error(function(status,header){
              console.log("Erreur d'acquisition des données"+status);
            });



          }
          */
          
         

    // Public API here
    return {

      getSld: function(sldName){

            return $http.get(sldName).success(function(data,status,headr){

            }).error(function(status,header){
              console.log("Erreur d'acquisition des données : "+status);
            })
          }
    };
  }]);
