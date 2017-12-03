(function appServicesModule() {
	"use strict";

	angular
		.module("confusionApp")
		.constant("baseUrl", "/api/")
		.factory('storageFactory', [
			'$window',
			function storageFactory($window) {
				const storageToken = '3k5hkhnksd9873h5kweihb878578hjsbjnbu';
				const storageName = 'oi43w9587fhdnfp9asdgfew4534gvr546yutre45';
				const storageUserId = 'huepq934hygn48fcbupw34857hfwjbo23iu';

				return {
					removeUser: function () {
						$window.localStorage.removeItem(storageToken);
						$window.localStorage.removeItem(storageUserId);
						$window.localStorage.removeItem(storageName);
					},
					saveUser  : function (res) {
						$window.localStorage.setItem(
							storageToken,
							res.token
						);

						$window.localStorage.setItem(
							storageName,
							res.name
						);

						$window.localStorage.setItem(
							storageUserId,
							res.userId
						);
					},
					getUser   : function () {
						return {
							name  : $window.localStorage.getItem(storageName),
							userId: $window.localStorage.getItem(storageUserId),
							token : $window.localStorage.getItem(storageToken)
						};
					},

					isLoggedIn: function () {
						let token = $window.localStorage.getItem(storageToken);
						return token !== null;
					}
				};
			}
		])
		.factory("menuFactory", [
			"$resource",
			"baseUrl",
			function menuFactory($resource, baseUrl) {
				let dishes = $resource(
					baseUrl + "dishes/:id",
					{id: "@id"},
					{
						update: {method: "PUT"}
					}
				);

				let comments = $resource(
					baseUrl + 'dishes/:id/comments',
					{id: '@id'}
				);

				let promotions = $resource(
					baseUrl + "promotions/:id",
					{id: "@id"},
					{update: {method: "PUT"}}
				);

				return {
					addComment   : (comment, dishId) => {
						return comments
							.save({id: dishId}, comment)
							.$promise;
					},
					getDishes    : () => dishes.query().$promise,
					getDish      : (index) => dishes.get({id: index}).$promise,
					getPromotion : (index) => promotions.get({id: index}).$promise,
					getPromotions: () => promotions.query().$promise
				};
			}
		])
		.factory("corporateFactory", [
			"$resource",
			"baseUrl",
			function corporateFactory($resource, baseUrl) {
				let leadership = $resource(
					baseUrl + "leadership/:id",
					{id: "@id"}
				);

				return {
					getLeaders: () => leadership.query().$promise,
					getLeader : (index) => leadership.get({id: index}).$promise
				}
			}
		])
		.factory("feedbackFactory", [
			"$resource",
			"baseUrl",
			function feedbackFactory($resource, baseUrl) {
				return $resource(baseUrl + "feedback");
			}
		])
		.factory("userFactory", [
			"$resource",
			'baseUrl',
			function userFactory($resource, baseUrl) {
				let url = baseUrl + 'users/';

				return {
					logIn   : (user) => {
						return $resource(url + 'login')
							.save(user)
							.$promise;
					},
					register: (user) => {
						return $resource(url + 'register')
							.save(user)
							.$promise;
					},
					logOut  : () => {
						return $resource(url + 'logout')
							.get()
							.$promise;
					}
				};
			}
		]);
}());
