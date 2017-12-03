(function contactControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("ContactController", [
			"$scope",
			function contactController($scope) {
				$scope.channels = [
					{value: "tel", label: "Tel."},
					{value: "Email", label: "Email"}
				];
				$scope.invalidChannelSelection = false;
				$scope.feedback = {
					mychannel: "",
					firstName: "",
					lastName : "",
					agree    : false,
					email    : ""
				};
			}
		]);
}());