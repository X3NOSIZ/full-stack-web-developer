(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('category', category);

    category.$inject = [
        'categoryService'
    ];

    /**
     * Category filter.
     */
    function category(categoryService) {
        return categoryFilter;

        ////////////////

        /**
         * Given ID, synchronously return the value of a property.
         */
        function categoryFilter(id, property) {
            var c = categoryService.getByIdSync(id);
            if (c) {
                return c[property];
            } else {
                return undefined;
            }
        }
    }
})();