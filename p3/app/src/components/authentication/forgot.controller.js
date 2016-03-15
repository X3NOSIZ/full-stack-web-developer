(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .controller('ForgotController', ForgotController);

    ForgotController.$inject = [
        '$state',
        '$mdToast',
        'authService',
        'auth'
    ];

    /**
     * View: forgot.tmpl.html
     */
    function ForgotController($state, $mdToast, authService, auth) {
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
        };

        /**
         * Forward function declerations.
         */
        vm.resetPassword = resetPassword;

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
         * Reset button click handler.
         */
        function resetPassword(user, $event) {
            vm.working = true;
            authService.$resetPassword(user)
            .then(function (auth) {
                $mdToast.showSimple('Password reset. Check your email for login instructions.');
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