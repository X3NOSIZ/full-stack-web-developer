(function () {
    'use strict';

    angular
        .module('app.components.item')
        .config(componentConfig);

    componentConfig.$inject = [
        '$stateProvider'
    ];

    function componentConfig($stateProvider) {
        $stateProvider
        .state('app.default.item', {
            url: '/catalog/{category}/{title}',
            templateUrl: 'src/components/item/item.tmpl.html',
            controller: 'ItemController',
            controllerAs: 'vm',
            resolve: {
                item: getItemByCategoryAndTitle,
                categories: getCategories,
                auth: getCurrentAuth
            }
        });
    }

    getItemByCategoryAndTitle.$inject = [
        '$stateParams',
        'itemService'
    ];

    function getItemByCategoryAndTitle($stateParams, itemService) {
        return itemService.getByCategoryAndTitle($stateParams.category, $stateParams.title);
    }
    
    getCategories.$inject = [
        'categoryService'
    ];

    function getCategories(categoryService) {
        return categoryService.get();
    }
    
    getCurrentAuth.$inject = [
        'authService'
    ];

    function getCurrentAuth(authService) {
        return authService.$waitForAuth();
    }
})();
