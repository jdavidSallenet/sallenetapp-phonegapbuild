// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.sallenet')

/**
 * Agenda controller.
 *
 * @module mm.addons.sallenet
 * @ngdoc controller
 * @name mmaSallenetClasesCtrl
 */
.controller('mmaSallenetListaClaseCtrl', function($scope, $stateParams, $mmApp, $mmaSallenet, $mmSite, $timeout, $mmEvents, $window,
        $ionicScrollDelegate, mmUserProfileState, $mmUtil, $interval, $log, $ionicHistory, $ionicPlatform,
        mmCoreEventKeyboardShow, mmCoreEventKeyboardHide) {
	
	$scope.loaded = false;
	var id_clase = $stateParams.id_clase;
	$scope.seleccionados = [];
	var nombre = $stateParams.nombre;
	$scope.title = "Lista de clase '"+nombre+"' ("+id_clase+")";
	var id_evento = $scope.id_evento = $stateParams.id_evento;
	function consigueListaClase(id_clase){
		return $mmaSallenet.getAlumnosClase(id_clase,id_evento).then( function(salida){
			var array = [];
			var items_actitud = [];
			var items_asistencia = [];
			var i = 1;
			angular.forEach( salida.alumnos , function(v){
				v.num = i++;
				array.push(v);
			});
			$scope.alumnos = array;
			angular.forEach( salida.actitud , function(v){
				items_actitud.push(v);
			} );
			angular.forEach( salida.asistencia , function(v){
				items_asistencia.push(v);
			} );
			$scope.items_actitud = items_actitud;
			$scope.items_asistencia = items_asistencia;
		},function(error){
			if ( typeof error === 'string' ){
				 $mmUtil.showErrorModal(error);
			}else{
				$mmUtil.showErrorModal('mma.messages.errorwhileretrievingdiscussions', true);
			}
		});
	}
	$scope.refreshListaClase = function( ){
		$mmaSallenet.invalidarCacheAlumnosClase(id_clase).then( function(){
			return consigueListaClase(id_clase);
		}).finally(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	$scope.seleccionar = function(id_alumno){
		$scope.seleccionados[id_alumno] = !$scope.seleccionados[id_alumno];
		$scope.sel = !$scope.sel;
	};
	// Comprobar que la aplicación esta onLine
	$scope.isAppOnLine = function(){
		return $mmApp.isOnline();
	}
	$scope.muestraObservacion = function(texto){
		alert(texto);
	}
	// Establece incidencia
	$scope.setIncidencia = function(id_evento,id_item,tipo,texto, texto_inc ){
		if ( !$mmApp.isOnline() ){
			// Por si acaso se ha colado algo
			return;
		} else if ( !( tipo == 2 || tipo == 1 ) ){
			// Tiene que ser uno de los dos tipos
			return;
		}
		var alumnos = [];
		var entrado = false;
		for ( id_alumno in $scope.seleccionados ){
			if ( $scope.seleccionados[id_alumno] ){
				alumnos.push({userid: id_alumno});
				entrado = true;
			}
		}
		texto = "";
		if ( entrado ) $mmaSallenet.setIncidencia( alumnos , id_evento , id_clase , id_item , tipo , $mmSite.getUserId() , texto ).then(
			function (){
				
				// Si es correcto tendré que poner en algún sitio algo
				for ( id_alumno in $scope.seleccionados ){
					if ( $scope.seleccionados[id_alumno] ){
						for ( var i = 0 ; i < $scope.alumnos.length ; i++ ){
							if ( !$scope.alumnos[i] ) break;
							if ( $scope.alumnos[i]["id"] == id_alumno ){
								if ( tipo == 1 ){
									$scope.alumnos[i]["asistencia"] = texto_inc;
								}else if ( tipo == 2 ){
									$scope.alumnos[i]["actitud"] = texto_inc;
								}else if ( tipo == 3 ){
									$scope.alumnos[i]["observacion"] = texto_inc;
								}
							}
						}
					}
				}
			} ,
			function (error){
				$mmApp.closeKeyboard();

	            if (typeof error === 'string') {
	                $mmUtil.showErrorModal(error);
	            } else {
	                $mmUtil.showErrorModal('mma.messages.messagenotsent', true);
	            }
			}
		);
	};
	consigueListaClase(id_clase).finally(function(){
		$scope.loaded = true;
		$rootScope.$broadcast(mmCoreSplitViewLoad);
	});
});
