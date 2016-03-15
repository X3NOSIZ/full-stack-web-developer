(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    routeConfig.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'src/layouts/default/default.tmpl.html'
        })
        .state('app.default', {
            abstract: true,
            views: {
                sidebar: {
                    templateUrl: 'src/components/categories/categories.tmpl.html',
                    controller: 'CategoriesController',
                    controllerAs: 'vm',
                    resolve: {
                        categories: getCategories
                    }
                },
                toolbar: {
                    templateUrl: 'src/components/toolbar/toolbar.tmpl.html',
                    controller: 'ToolbarController',
                    controllerAs: 'vm',
                    resolve: {
                        auth: getCurrentAuth
                    }
                },
                content: {
                    template: '<div id="content-view" flex ui-view></div>'
                }
            }
        });

        $urlRouterProvider.when('/', goToLatest);
        $urlRouterProvider.otherwise(goToLatest);
    }

    goToLatest.$inject = [
        '$state'
    ];

    function goToLatest($state) {
        $state.go('app.default.latest');
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
