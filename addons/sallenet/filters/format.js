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
 * Filter to format a message.
 *
 * @module mma.sallenet
 * @ngdoc filter
 * @name mmaSallenetHora
 */
.filter('mmaSallenetHora', function($mmText) {
	return function(text) {
		var d = new Date(text*1000);
		return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2);
	};
})

.filter('mmaSallenetHour', function($mmText) {
	return function(text) {
		var d = new Date(text*1000);
		var options = {hour: "numeric"}
		return d.toLocaleTimeString("es", options);
	};
})
/**
 * Filter to format a message.
 *
 * @module mma.sallenet
 * @ngdoc filter
 * @name mmaSallenetFecha
 */
.filter('mmaSallenetFecha', function($mmText) {
	return function(text) {
		var d = new Date(text*1000);
		var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"}
		return d.toLocaleDateString("es", options);
	};
})

.filter('mmaSallenetDia', function($mmText) {
	return function(text) {
		var d = new Date(text*1000);
		var options = {weekday: "long"};
		return d.toLocaleDateString("es", options);
	};
})

.filter('mmaSallenetNumeroDiaSemana', function($mmText) {
	return function(text) {
		var d = new Date(text*1000);
		return d.getDay();
	};
})

.filter('mmaSallenetGetHours', function($mmText) {
	return function(eventos) {
		var hours = [];
		for(var i=0; i<eventos.length; i++){
			var hora = new Date(eventos[i].inicio*1000).getHours();
			if(hours.indexOf(hora)==-1){
				hours.push(hora);
			}
		}
		hours.sort(function(a, b){return a-b});
		return hours;
	};
})

.filter('mmaSallenetGetName', function($mmText) {
	return function(evento, hour, day) {
		for(var i=0; i<evento.length; i++){
			var dia_inicio = new Date(evento[i].inicio*1000).getDay();
			var dia_fin = new Date(evento[i].inicio*1000).getDay();
			var hora_inicio = new Date(evento[i].inicio*1000).getHours();
			var hora_fin = new Date(evento[i].inicio*1000).getHours();
			var minuto_inicio = new Date(evento[i].inicio*1000).getMinutes();
			var minuto_fin = new Date(evento[i].inicio*1000).getMinutes();
			if(dia_inicio==day && hora_inicio==hour){
				var inicio = ("0"+hora_inicio).slice(-2)+":"+("0"+minuto_inicio).slice(-2);
				var fin = ("0"+hora_fin).slice(-2)+":"+("0"+minuto_fin).slice(-2);
				return evento[i].nombre;
			}
		}
	};
})

.filter('mmaSallenetGetTime', function($mmText) {
	return function(evento, hour, day) {
		for(var i=0; i<evento.length; i++){
			var dia_inicio = new Date(evento[i].inicio*1000).getDay();
			var dia_fin = new Date(evento[i].inicio*1000).getDay();
			var hora_inicio = new Date(evento[i].inicio*1000).getHours();
			var hora_fin = new Date(evento[i].fin*1000).getHours();
			var minuto_inicio = new Date(evento[i].inicio*1000).getMinutes();
			var minuto_fin = new Date(evento[i].fin*1000).getMinutes();
			if(dia_inicio==day && hora_inicio==hour){
				var inicio = ("0"+hora_inicio).slice(-2)+":"+("0"+minuto_inicio).slice(-2);
				var fin = ("0"+hora_fin).slice(-2)+":"+("0"+minuto_fin).slice(-2);
				return "("+inicio+"-"+fin+")";
			}
		}
	};
});