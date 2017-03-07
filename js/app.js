var app = angular.module("dhcubing", ["ngRoute",'ngSanitize']);

app.config( ['$routeProvider',function($routeProvider){
	$routeProvider.
		when("/dhc",{
			controller:"DHCController",
			templateUrl:"dhc.html"
		}).
		when("/resultcells/:k",{
			controller:"ResultcellsController",
			templateUrl:"resultcells.html"
		}).
		when("/hierchies/:k",{
			controller:"HierchiesController",
			templateUrl:"hierchies.html"
		}).
		when("/hierchiesSentence/:k",{
			controller:"HierchiesController",
			templateUrl:"hierarchiesSentence.html"
		}).
		otherwise({redirectTo:'/dhc'});

}]);