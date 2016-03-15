(function () {
    'use strict';

    angular
        .module('app.components.items')
        .config(componentConfig);

    componentConfig.$inject = [
        '$stateProvider'
    ];

    function componentConfig($stateProvider) {
        $stateProvider
        .state('app.default.latest', {
            url: '/',
            templateUrl: 'src/components/items/items.tmpl.html',
            controller: 'ItemsController',
            controllerAs: 'vm',
            resolve: {
                auth: getCurrentAuth,
                category: function () { return null; },
                items: getLatestItems
            }
        })
        .state('app.default.items', {
            url: '/catalog/{category}/items',
            templateUrl: 'src/components/items/items.tmpl.html',
            controller: 'ItemsController',
            controllerAs: 'vm',
            resolve: {
                auth: getCurrentAuth,
                category: getCategory,
                items: getItemsByCategory
            }
        });
    }

    getLatestItems.$inject = [
        'itemService'
    ];

    function getLatestItems(itemService) {
        return itemService.getLatest();
    }

    getCategory.$inject = [
        '$stateParams',
        'categoryService'
    ];

    function getCategory($stateParams, categoryService) {
        return categoryService.getByName($stateParams.category);
    }

    getItemsByCategory.$inject = [
        '$stateParams',
        'itemService'
    ];

    function getItemsByCategory($stateParams, itemService) {
        return itemService.getByCategory($stateParams.category);
    }
    
    getCurrentAuth.$inject = [
        'authService'
    ];

    function getCurrentAuth(authService) {
        return authService.$waitForAuth();
    }
})();
