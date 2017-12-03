(function indexControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("IndexController", [
			"$scope",
			"menuFactory",
			"corporateFactory",
			function indexController(
				$scope,
				menuFactory,
				corporateFactory
			) {
				$scope.promotion = {};
				$scope.leader = {};
				$scope.dish = {};

				$scope.promotionMessage = "Loading...";
				$scope.dishMessage = "Loading...";
				$scope.leaderMessage = "Loading...";

				$scope.showDish = false;
				$scope.showPromotion = false;
				$scope.showLeader = false;

				menuFactory
					.getPromotion("5a213890f36d282c8c62e453")
					.then(function getPromotionSuccess(data) {
						$scope.promotion = data;
						$scope.showPromotion = true;
					})
					.catch(function getPromotionError(res) {
						$scope.promotionMessage =
							"Error :" + res.status + " " + res.statusText;
					});

				menuFactory
					.getDish("5a2137d9f36d282c8c62e40f")
					.then(function getDishSuccess(data) {
						$scope.dish = data;
						$scope.showDish = true;
					})
					.catch(function getDishError(res) {
						$scope.dishMessage =
							"Error :" + res.status + " " + res.statusText;
					});

				corporateFactory
					.getLeader("5a2138fcf36d282c8c62e473")
					.then(function getLeaderSuccess(data) {
						$scope.leader = data;
						$scope.showLeader = true;
					})
					.catch(function getLeaderError(res) {
						$scope.leaderMessage =
							"Error :" + res.status + " " + res.statusText;
					});
			}
		]);
}());