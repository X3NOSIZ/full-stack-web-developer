(function () {
    'use strict';

    angular
        .module('app.components.toolbar')
        .controller('ToolbarController', ToolbarController);

    ToolbarController.$inject = [
        '$state',
        'authService',
        'auth'
    ];
    
    /**
     * View: toolbar.tmpl.html
     */
    function ToolbarController($state, authService, auth) {
        var vm = this;

        /**
         * Authentication state.
         */
        vm.auth = auth;

        /**
         * Forward function declerations.
         */
        vm.onAuth = onAuth;
        vm.login = login;
        vm.logout = logout;

        activate();

        ////////////////

        /**
         * Register authentication state change callback.
         */
        function activate() {
            authService.$onAuth(vm.onAuth);
        }

        /**
         * Callback invoked upon a change to authentication state.
         */
        function onAuth(auth) {
            vm.auth = auth;
        }

        /**
         * Login button click handler.
         */
        function login($event) {
            $state.go('authentication.login');
        }

        /**
         * Logout button click handler.
         */
        function logout($event) {
            authService.$unauth();
            $state.go('app.default.latest');
        }
    }
})();