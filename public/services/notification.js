(function notificationFactoryModule() {
	'use strict';
	angular
		.module('confusionApp')
		.factory('notification', function notification() {
			toastr.options = {
				"closeButton"      : false,
				"debug"            : false,
				"newestOnTop"      : true,
				"progressBar"      : false,
				"positionClass"    : "toast-top-right",
				"preventDuplicates": false,
				"onclick"          : null,
				"showDuration"     : "400",
				"hideDuration"     : "1000",
				"timeOut"          : "5000",
				"extendedTimeOut"  : "1000",
				"showEasing"       : "swing",
				"hideEasing"       : "linear",
				"showMethod"       : "fadeIn",
				"hideMethod"       : "fadeOut"
			};

			return {
				success: function (text) {
					toastr.success(text.message || text, 'Success:');
				},
				error  : function (text) {
					let msg;
					if (text.data) {
						if (text.data.result) {
							msg = text.data.result;
						} else if (text.data.message) {
							msg = text.data.message;
						} else {
							msg = text.data;
						}

					} else {
						msg = text;
					}

					toastr.error(msg, 'Error:');
				},
				warn   : function (text) {
					toastr.warning(text, 'Warning:');
				}
			};
		});
}());