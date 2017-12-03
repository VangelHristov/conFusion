(function dishDetailControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("DishDetailController", [
			"$scope",
			"$stateParams",
			"menuFactory",
			function dishDetailController($scope, $stateParams, menuFactory) {
				$scope.order = "";
				$scope.dish = {};
				$scope.showDetail = false;
				$scope.message = "Loading...";

				menuFactory
					.getDish($stateParams.id)
					.then(function getDishSuccess(data) {
						$scope.dish = data;
						$scope.showDish = true;
					})
					.catch(function getDishError(res) {
						$scope.message =
							"Error: " + res.status + " " + res.statusText;
					});
			}
		]);
}());