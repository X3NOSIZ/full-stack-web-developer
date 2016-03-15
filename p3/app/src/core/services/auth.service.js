(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('authService', authService);

    authService.$inject = [
        '$firebaseAuth',
        'databaseService'
    ];

    /**
     * Authentication service. Maintains global authentication state.
     */
    function authService($firebaseAuth, databaseService) {
        return $firebaseAuth(databaseService);
    }
})();
