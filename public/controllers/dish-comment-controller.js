(function dishCommentControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("DishCommentController", [
			"$scope",
			"$window",
			"menuFactory",
			"storageFactory",
			"notification",
			function dishCommentController(
				$scope,
				$window,
				menuFactory,
				storageFactory,
				notification
			) {
				const initComment = function () {
					return {
						rating  : "5",
						comment : "",
						author  : "",
						postedBy: "",
						token   : ""
					};
				};
				$scope.form = {};
				$scope.isLoggedIn = storageFactory.isLoggedIn;

				$scope.mycomment = initComment();

				$scope.submitComment = function submitComment() {
					let user = storageFactory.getUser();
					$scope.mycomment.token = user.token;
					$scope.mycomment.postedBy = user.userId;
					$scope.mycomment.author = user.name;
					$scope.mycomment.date = new Date();

					menuFactory
						.addComment($scope.mycomment, $scope.dish._id)
						.then(() => {
							$scope.dish.comments.push($scope.mycomment);
							$scope.form.comment.$setPristine();
							$scope.mycomment = initComment();
							notification.success('Your comment was added');
						});
				};
			}
		]);
}());