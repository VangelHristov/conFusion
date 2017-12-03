(function menuControllerModule() {
	'use strict';

	angular
		.module("confusionApp")
		.controller("MenuController", [
			"$scope",
			"menuFactory",
			function menuController($scope, menuFactory) {
				$scope.tab = 1;
				$scope.filtText = "";
				$scope.dishes = {};
				$scope.showDetails = false;
				$scope.message = "Loading...";
				$scope.showMenu = false;

				$scope.toggleDetails = function toggleDetails() {
					$scope.showDetails = !$scope.showDetails;
				};

				menuFactory
					.getDishes()
					.then(function getDishesSuccess(res) {
						$scope.dishes = res;
						$scope.showMenu = true;
					})
					.catch(function getDishesError(res) {
						$scope.message =
							"Error :" + res.status + " " + res.statusText;
					});

				$scope.select = function select(setTab) {
					$scope.tab = setTab;

					if (setTab === 2) {
						$scope.filtText = "appetizer";
					} else if (setTab === 3) {
						$scope.filtText = "mains";
					} else if (setTab === 4) {
						$scope.filtText = "dessert";
					} else {
						$scope.filtText = "";
					}
				};

				$scope.isSelected = function isSelected(checkTab) {
					return $scope.tab === checkTab;
				};
			}
		]);
}());