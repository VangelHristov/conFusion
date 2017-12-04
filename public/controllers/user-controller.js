(function userControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("UserController", [
			"$scope",
			"userFactory",
			"$uibModal",
			"storageFactory",
			"notification",
			function userController(
				$scope,
				userFactory,
				$uibModal,
				storageFactory,
				notification
			) {
				const initUser = function () {
					return {
						username       : '',
						password       : '',
						confirmPassword: ''
					};
				};

				const modalCtrl = function ($scope) {
					$scope.dismissModal = () => $scope.cancelModal()
				};
				$scope.passwordMismatch = () => $scope.user.password !== $scope.user.confirmPassword;
				$scope.modal = {};

				$scope.showLogInModal = function showLogInModal() {
					$scope.modal = $uibModal.open({
						templateUrl: 'views/login.html',
						scope      : $scope,
						controller : modalCtrl,
						size       : 'sm'
					});
				};

				$scope.showRegisterModal = function showRegisterModal() {
					$scope.modal = $uibModal.open({
						templateUrl: 'views/register.html',
						scope      : $scope,
						controller : modalCtrl,
						size       : 'sm'
					});
				};

				$scope.cancelModal = () => $scope.modal.dismiss('cancel');

				$scope.isLoggedIn = storageFactory.isLoggedIn;

				$scope.user = initUser();

				$scope.logIn = function logIn() {
					userFactory
						.logIn($scope.user)
						.then(function logInSuccess(res) {
							storageFactory.saveUser(res);
							$scope.user = initUser();
							$scope.dismissModal();
							notification.success(res.message);
						})
						.catch(err => notification.error(err));
				};

				$scope.register = function register() {
					userFactory
						.register($scope.user)
						.then(function registerSuccess(res) {
							storageFactory.saveUser(res);
							$scope.user = initUser();
							$scope.dismissModal();
							notification.success(res);
						})
						.catch(err => notification.error(err));
				};

				$scope.logOut = function logOut() {
					userFactory
						.logOut()
						.then(function logoutSuccess() {
							$scope.user = initUser();
							storageFactory.removeUser();
							notification.success('You have logged out');
						})
						.catch(err => notification.error(err));
				};
			}
		]);
}());