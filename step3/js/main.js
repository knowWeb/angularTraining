var app = angular.module('farmersMarket', []);

app.controller('search', function($scope, farmersMarketFactory) {
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
				farmersMarketFactory.getMarketDataByZip($scope.search.zip).then(function(d){
				    $scope.search.results = d.results;
				    $scope.search.loading = false;
				    console.log($scope.search);
				});
			}
		}
	};

	var trackCoords = function() {
		if ($scope.search.coords) {
			$scope.search.loading = true;
			farmersMarketFactory.getMarketDataByCoords($scope.search.coords).then(function(d){
				$scope.search.results = d.results;
				$scope.search.loading = false;
				console.log($scope.search);
			});
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

app.factory('farmersMarketFactory', function($http) {

    var factory = {};

	var processData = function(dataArr) {
	    var str1, str2, str3;
	    if (dataArr.results[0].id !== "Error") {
	        for (var i=0; i < dataArr.results.length; i++) {
	            str1 = dataArr.results[i].marketname;
	            str2 = str1.substr(0,str1.indexOf(' ')) + " miles ",
	            str3 = str1.substr(str1.indexOf(' ')+1);
	            dataArr.results[i].marketname = str3;
	            dataArr.results[i].marketnameEncoded = encodeURIComponent(str3);
	            dataArr.results[i].distance = str2;
	        }
	    }

	    return dataArr;
	}

	factory.getMarketDataByZip = function(zip) {
	    var promise = $http.get('http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip).then(function (results) {
	        return processData(results.data);
	    });
	    return promise;
	};

	factory.getMarketDataByCoords = function(coords) {
	    var promise = $http.get('http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=' + coords[0] + '&lng=' + coords[1]).then(function (results) {
	        return processData(results.data);
	    });
	    return promise;
	};

    return factory;
});