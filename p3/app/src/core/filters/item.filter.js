(function () {
    'use strict';

    angular
        .module('app.core.filters')
        .filter('item', item);

    item.$inject = [
        'itemService'
    ];

    /**
     * Item filter.
     */
    function item(itemService) {
        return itemFilter;

        ////////////////

        /**
         * Given ID, synchronously return the value of a property.
         */
        function itemFilter(id, property) {
            var i = itemService.getByIdSync(id);
            if (i) {
                return i[property];
            } else {
                return undefined;
            }
        }
    }
})();