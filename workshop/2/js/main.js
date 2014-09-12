var app = angular.module('farmersMarket', []);

app.controller('search', function($scope) {
	$scope.search = {
		zip : null,
		coords : null,
		loading : false,
		results : null
	};

	$scope.getCoords = function() {
		if (Modernizr.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
				$scope.search.coords = [
					position.coords.latitude,
					position.coords.longitude
				];
				$scope.$digest();
			});
		}
	};

	var trackZip = function() {
		if ($scope.search.zip) {
			if ($scope.search.zip.length === 5) {
				$scope.search.loading = true;
				console.log('ajax here');
			}
		}
	};

	var trackCoords = function() {
		if ($scope.search.coords) {
			$scope.search.loading = true;
			console.log('ajax here');
		}
	};

	var init = function() {
		$scope.$watch('search.zip', function() {
			trackZip();
		});
		$scope.$watch('search.coords', function() {
			trackCoords();
		});
	};

	init();
});