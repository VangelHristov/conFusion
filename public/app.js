(function confusionAppModule() {
	"use strict";

	angular
		.module(
			"confusionApp",
			["ui.router", "ngResource", 'ngAnimate', 'ui.bootstrap']
		)
		.config(
			function configConfusionApp($stateProvider, $urlRouterProvider) {
				$stateProvider
					.state("app", {
						url  : "/",
						views: {
							header : {
								templateUrl: "views/header.html",
								controller:"UserController"
							},
							content: {
								templateUrl: "views/home.html",
								controller : "IndexController"
							},
							footer : {
								templateUrl: "views/footer.html"
							}
						}
					})
					.state("app.aboutus", {
						url  : "aboutus",
						views: {
							"content@": {
								templateUrl: "views/aboutus.html",
								controller : "AboutController"
							}
						}
					})
					.state("app.menu", {
						url  : "menu",
						views: {
							"content@": {
								templateUrl: "views/menu.html",
								controller : "MenuController"
							}
						}
					})
					.state("app.dishdetails", {
						url  : "menu/:id",
						views: {
							"content@": {
								templateUrl: "views/dishdetail.html",
								controller : "DishDetailController"
							}
						}
					})
					.state("app.contactus", {
						url  : "contactus",
						views: {
							"content@": {
								templateUrl: "views/contactus.html",
								controller : "ContactController"
							}
						}
					});

				$urlRouterProvider.otherwise("/");
			});
}());
