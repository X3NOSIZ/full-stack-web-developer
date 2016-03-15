(function () {
    'use strict';

    angular
        .module('app.components.authentication')
        .config(componentConfig);

    componentConfig.$inject = [
        '$stateProvider'
    ];

    function componentConfig($stateProvider) {
        $stateProvider
        .state('authentication', {
            abstract: true,
            templateUrl: 'src/components/authentication/layout.tmpl.html'
        })
        .state('authentication.login', {
            url: '/login',
            templateUrl: 'src/components/authentication/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm',
            resolve: {
                auth: getCurrentAuth
            }
        })
        .state('authentication.signup', {
            url: '/signup',
            templateUrl: 'src/components/authentication/signup.tmpl.html',
            controller: 'SignUpController',
            controllerAs: 'vm',
            resolve: {
                auth: getCurrentAuth
            }
        })
        .state('authentication.forgot', {
            url: '/forgot',
            templateUrl: 'src/components/authentication/forgot.tmpl.html',
            controller: 'ForgotController',
            controllerAs: 'vm',
            resolve: {
                auth: getCurrentAuth
            }
        });
    }

    getCurrentAuth.$inject = [
        'authService'
    ];

    function getCurrentAuth(authService) {
        return authService.$waitForAuth();
    }
})();
