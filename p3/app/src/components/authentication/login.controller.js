(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$state',
        '$mdToast',
        'authService',
        'auth'
    ];

    function LoginController($state, $mdToast, authService, auth) {
        var vm = this;

        /**
         * Whether there is an active asynchronous operation.
         */
        vm.working = false;

        /**
         * The user.
         */
        vm.user = {
            email: '',
            password: '',
            rememberMe: false
        };

        /**
         * Forward function declerations.
         */
        vm.loginEmail = loginEmail;
        vm.loginGoogle = loginGoogle;

        activate();

        ////////////////

        /**
         * If user is already authenticated, navigate to latest items list.
         */
        function activate() {
            if (auth) {
                $state.go('app.default.latest');
            }
        }

        /**
         * Login button click handler.
         */
        function loginEmail(user, $event) {
            vm.working = true;
            authService.$authWithPassword(user, {
                remember: vm.user.rememberMe ? 'default' : 'sessionOnly'
            })
            .then(function (auth) {
                $state.go('app.default.latest');
            })
            .catch(function (error) {
                $mdToast.showSimple(error.message || 'Error: Please try again.');
            })
            .finally(function () {
                vm.working = false;
            });
        }

        /**
         * Google login button click handler.
         */
        function loginGoogle(withRedirect, $event) {
            vm.working = true;

            var promise;
            if (withRedirect) {
                promise = authService.$authWithOAuthRedirect('google');
            } else {
                promise = authService.$authWithOAuthPopup('google');
            }

            promise
            .then(function () {
                $state.go('app.default.latest');
            })
            .catch(function (error) {
                if (error.code === 'TRANSPORT_UNAVAILABLE') {
                    vm.loginGoogle(true, $event);
                } else {
                    $mdToast.showSimple(error.message || 'Error: Please try again.');
                }
            })
            .finally(function () {
                vm.working = false;
            });
        }
    }
})();