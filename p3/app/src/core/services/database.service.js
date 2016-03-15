(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('databaseService', databaseService);

    databaseService.$inject = [
        'firebase',
        'firebaseUrl'
    ];

    /**
     * Database service. Serves as a single reference to the database.
     */
    function databaseService(firebase, firebaseUrl) {
        return new firebase(firebaseUrl);
    }
})();
