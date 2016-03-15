(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = [
        '$state',
        '$mdToast',
        'authService',
        'auth'
    ];

    function SignUpController($state, $mdToast, authService, auth) {
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
            password: ''
        };

        /**
         * Forward function declerations.
         */
        vm.signUp = signUp;

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
         * Sign up button click handler.
         */
        function signUp(user, $event) {
            vm.working = true;
            authService.$createUser(user)
            .then(function () {
                return authService.$authWithPassword(user);
            })
            .then(function (auth) {
                return $state.go('app.default.latest');
            })
            .catch(function (error) {
                $mdToast.showSimple(error.message || 'Error: Please try again.');
            })
            .finally(function () {
                vm.working = false;
            });
        }
    }
})();