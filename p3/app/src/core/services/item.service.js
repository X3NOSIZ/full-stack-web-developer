(function () {
    'use strict';

    angular
        .module('app.core.services')
        .factory('itemService', itemService);

    itemService.$inject = [
        '$q',
        '$firebaseArray',
        'databaseService',
        'categoryService',
        '_'
    ];
    
    /**
     * Item service.
     */
    function itemService($q, $firebaseArray, databaseService, categoryService, _) {
        var service = {
            items: null,
            get: get,
            getLatest: getLatest,
            getById: getById,
            getByIdSync: getByIdSync,
            getByCategory: getByCategory,
            getByCategoryAndTitle: getByCategoryAndTitle,
            hasUniqueTitle: hasUniqueTitle,
            save: save,
            remove: remove
        };
        return service;

        ////////////////

        /**
         * Get all items in the database (asynchronous).
         */
        function get() {
            if (service.items === null) {
                var query = databaseService.child('items').orderByChild('title');
                service.items = new $firebaseArray(query);
            }
            return service.items.$loaded();
        }

        /**
         * Get latest 10 items in the database sorted by creation instant (asynchronous).
         */
        function getLatest() {
            return new $q(function (resolve, reject) {
                service.get()
                .then(function () {
                    resolve(_.take(_.sortBy(service.items, 'created').reverse(), 10));
                })
                .catch(reject);
            });
        }

        /**
         * Get an item by ID (asynchronous).
         */
        function getById(id) {
            return new $q(function (resolve, reject) {
                service.get()
                .then(function () {
                    resolve(service.items.$getRecord(id));
                })
                .catch(reject);
            });
        }

        /**
         * Get an item by ID (synchronous).
         */
        function getByIdSync(id) {
            if (service.items !== null) {
                return service.items.$getRecord(id);
            } else {
                return null;
            }
        }

        /**
         * Get all items in a category (asynchronous).
         */
        function getByCategory(categoryName) {
            return new $q(function (resolve, reject) {
                service.get()
                .then(function () {
                    return categoryService.getByName(categoryName);
                })
                .then(function (c) {
                    if (c) {
                        resolve(_.filter(service.items, ['category', c.$id]));
                    } else {
                        resolve([]);
                    }
                })
                .catch(reject);
            });
        }

        /**
         * Get an item in a category by its title (asynchronous).
         */
        function getByCategoryAndTitle(categoryName, itemTitle) {
            return new $q(function (resolve, reject) {
                service.get()
                .then(function () {
                    return service.getByCategory(categoryName);
                })
                .then(function (items) {
                    resolve(_.find(items, ['title', itemTitle]) || null);
                })
                .catch(reject);
            });
        }

        /**
         * Determine if an item has a unique title in its category (synchronous).
         */
        function hasUniqueTitle(item) {
            var categoryItems = _.filter(service.items, ['category', item.category]);
            var otherItems = _.filter(categoryItems, function (i) {
                return i.$id !== item.$id;
            });
            var firstOtherItemWithTitle = _.find(otherItems, function (i) {
                return angular.uppercase(i.title) === angular.uppercase(item.title);
            });
            return angular.isUndefined(firstOtherItemWithTitle);
        }

        /**
         * Save an item to the database (asynchronous).
         */
        function save(item) {
            if (angular.isUndefined(item.$id)) {
                return service.items.$add(item);
            } else {
                return service.items.$save(item);
            }
        }

        /**
         * Remove an item from the database (asynchronous).
         */
        function remove(item) {
            return service.items.$remove(item);
        }
    }
})();