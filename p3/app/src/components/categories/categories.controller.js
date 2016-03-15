(function () {
    'use strict';

    angular
        .module('app.components.categories')
        .controller('CategoriesController', CategoriesController);

    CategoriesController.$inject = [
        '$filter',
        '$state',
        'categories'
    ];

    /**
     * View: categories.tmpl.html
     */
    function CategoriesController($filter, $state, categories) {
        var vm = this;

        /**
         * All categories.
         */
        vm.categories = categories;

        /**
         * Forward function declarations.
         */
        vm.navigateTo = navigateTo;

        ////////////////

        /**
         * Navigate to a category's items list view.
         */
        function navigateTo(category, $event) {
            $state.go('app.default.items', {
                category: $filter('category')(category.$id, 'name')
            });
        }
    }
})();
