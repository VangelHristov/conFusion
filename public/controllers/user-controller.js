(function userControllerModule() {
	"use strict";

	angular
		.module("confusionApp")
		.controller("UserController", [
			"$scope",
			"userFactory",
			"$uibModal",
			"storageFactory",
			function userController(
				$scope,
				userFactory,
				$uibModal,
				storageFactory
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
						})
						.catch(function logInError(err) {
							console.log(err);//eslint-disable-line no-console
						});
				};

				$scope.register = function register() {
					if ($scope.user.password !== $scope.user.confirmPassword) {
						//eslint-disable-next-line no-console
						console.log('passwords don\'t match');
					}

					userFactory
						.register($scope.user)
						.then(function registerSuccess() {
							$scope.user = initUser();
							$scope.dismissModal();
						})
						.catch(function registerError(err) {
							console.log(err);//eslint-disable-line no-console
						});
				};

				$scope.logOut = function logOut() {
					userFactory
						.logOut()
						.then(function logoutSuccess() {
							$scope.user = initUser();
							storageFactory.removeUser();
						})
						.catch(function logoutError(err) {
							console.log(err);//eslint-disable-line no-console
						});
				};
			}
		]);
}());