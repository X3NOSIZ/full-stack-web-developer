(function () {
    'use strict';

    angular
        .module('app.components.items')
        .controller('ItemsController', ItemsController);

    ItemsController.$inject = [
        '$filter',
        '$state',
        'authService',
        'auth',
        'category',
        'items'
    ];

    /**
     * View: items.tmpl.html
     */
    function ItemsController($filter, $state, authService, auth, category, items) {
        var vm = this;

        /**
         * Authentication state.
         */
        vm.auth = auth;
        
        /**
         * Category for which items are to be displayed. If null, latest items
         * are displayed.
         */
        vm.category = category;

        /**
         * Whether the view is displaying latest items or items of a category.
         */
        vm.showingLatest = (!vm.category);

        /**
         * Items being displayed.
         */
        vm.items = items;

        /**
         * Forward function declerations.
         */
        vm.onAuth = onAuth;
        vm.navigateTo = navigateTo;
        vm.addItem = addItem;

        activate();

        ////////////////

        /**
         * Register authentication state change callback.
         */
        function activate() {
            authService.$onAuth(vm.onAuth);
        }

        /**
         * Callback invoked upon a change to authentication state.
         */
        function onAuth(auth) {
            vm.auth = auth;
        }

        /**
         * Navigate to an item's detail view.
         */
        function navigateTo(item, $event) {
            $state.go('app.default.item', {
                category: $filter('category')(item.category, 'name'),
                title: $filter('item')(item.$id, 'title')
            });
        }

        /**
         * Add item button click handler.
         */
        function addItem($event) {
            $state.go('app.default.item', {
                category: vm.category ? vm.category.name : null,
                title: null
            }, {
                location: false  // do not update URL
            });
        }
    }
})();
