(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('categoryService', categoryService);

    categoryService.$inject = [
        '$q',
        '$firebaseArray',
        'databaseService',
        '_'
    ];

    /**
     * Category service.
     */
    function categoryService($q, $firebaseArray, databaseService, _) {
        var service = {
            categories: null,
            get: get,
            getById: getById,
            getByIdSync: getByIdSync,
            getByName: getByName,
            getByNameSync: getByNameSync
        };
        return service;

        ////////////////

        /**
         * Get all categories in the database (asynchronous).
         */
        function get() {
            if (service.categories === null) {
                var query = databaseService.child('categories').orderByChild('name');
                service.categories = new $firebaseArray(query);
            }
            return service.categories.$loaded();
        }

        /**
         * Get a category by ID (asynchronous).
         */
        function getById(id) {
            return new $q(function (resolve, reject) {
                service.get()
                .then(function () {
                    resolve(service.categories.$getRecord(id));
                })
                .catch(reject);
            });
        }

        /**
         * Get a category by ID (synchronous).
         */
        function getByIdSync(id) {
            if (service.categories !== null) {
                return service.categories.$getRecord(id);
            } else {
                return null;
            }
        }

        /**
         * Get a category by name (asynchronous).
         */
        function getByName(name) {
            return new $q(function (resolve, reject) {
                service.get()
                .then(function () {
                    resolve(_.find(service.categories, ['name', name]) || null);
                })
                .catch(reject);
            });
        }

        /**
         * Get a category by name (synchronous).
         */
        function getByNameSync(name) {
            if (service.categories !== null) {
                return _.find(service.categories, ['name', name]) || null;
            } else {
                return null;
            }
        }
    }
})();