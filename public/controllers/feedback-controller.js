(function feedbackControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("FeedbackController", [
			"$scope",
			"feedbackFactory",
			function feedbackController($scope, feedbackFactory) {
				$scope.sendFeedback = function sendFeedback() {
					if (
						$scope.feedback.agree &&
						$scope.feedback.mychannel === "" &&
						!$scope.feedback.mychannel
					) {
						$scope.invalidChannelSelection = true;
					} else {
						feedbackFactory.save($scope.feedback);
						$scope.invalidChannelSelection = false;
						$scope.feedback = {
							mychannel: "",
							firstName: "",
							lastName : "",
							agree    : false,
							email    : ""
						};
						$scope.feedback.mychannel = "";

						$scope.feedbackForm.$setPristine();
					}
				};
			}
		]);
}());