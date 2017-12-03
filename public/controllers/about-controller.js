(function aboutControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("AboutController", [
			"$scope",
			"corporateFactory",
			function aboutController($scope, corporateFactory) {
				$scope.leaders = {};
				$scope.showLeaders = false;
				$scope.message = "Loading...";

				corporateFactory
					.getLeaders()
					.then(function getLeadersSuccess(data) {
						$scope.leaders = data;
						$scope.showLeaders = true;
					})
					.catch(function getLeadersError(res) {
						$scope.message =
							"Error :" + res.status + " " + res.statusText;
					});
			}
		]);
}());
