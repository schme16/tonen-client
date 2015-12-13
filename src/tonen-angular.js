angular.module("tonen", []).factory('$tonen', function tonen ($http) {

	var $tonen = function (url, $scope, binder) {
		$tonen.get(url).success(function (data) {
			var skip = true, 
				id = parseInt(new Date().getTime() + Math.random(), 0)
				$scope['$$_____' + id] = data
			$scope.$eval(binder + ' = $$_____' + id) 
			delete $scope['$$_____' + id]
			$scope.$applyAsync()
			$scope.$watch(binder, function (n, o) {
				if (!skip) {
					$tonen.set(url, n)
				}
				skip = false
			}, true)
		})
	}
	
	$tonen.get = function (url) {

		return $http.get(url)
	}

	$tonen.set = function (url, data) {
		if (typeof data === 'undefined') return 
		return $http({
			method: 'POST',
			url: url,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			transformRequest: function(obj) {
				var str = [];
				for(var p in obj)
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
				return str.join("&");
			},
			data: {data: angular.toJson(data)}
		})
	}

	return $tonen
})