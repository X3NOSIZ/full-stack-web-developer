(function () {
    'use strict';

    angular
        .module('app.components.item')
        .controller('ItemController', ItemController);

    ItemController.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$mdDialog',
        '$mdToast',
        'authService',
        'itemService',
        'categoryService',
        'auth',
        'item',
        'categories',
        'moment',
        'Upload',
        '_'
    ];

    /**
     * View: item.tmpl.html
     */
    function ItemController($scope, $state, $stateParams, $mdDialog, $mdToast, authService, itemService, categoryService, auth, item, categories, moment, Upload, _) {
        var vm = this;

        /**
         * Whether there is an active asynchronous operation.
         */
        vm.working = false;

        /**
         * Whether there is a picture upload in progress.
         */
        vm.uploading = false;

        /**
         * Authentication state.
         */
        vm.auth = auth;

        /**
         * Categories for category select.
         */
        vm.categories = categories;

        /**
         * Item being viewed/edited/added.
         */
        vm.item = item;

        /**
         * Item snapshot for restoration in case user leaves view mid-edit.
         */
        vm.itemSnapshot = undefined;

        /**
         * Item properties that are snapshot.
         */
        vm.itemSnapshotProperties = [
            'category',
            'created',
            'creator',
            'description',
            'picture',
            'title'
        ];

        /**
         * Whether controls should be rendered as read-only. If `vm.item` is
         * null, that means the user is adding a new item.
         */
        vm.inEditMode = (!vm.item);

        /**
         * Forward function declerations.
         */
        vm.onAuth = onAuth;
        vm.updateSnapshot = updateSnapshot;
        vm.edit = edit;
        vm.remove = remove;
        vm.save = save;
        vm.showEditRemove = showEditRemove;
        vm.goToCategory = goToCategory;
        vm.uploadPicture = uploadPicture;
        vm.removePicture = removePicture;

        activate();

        ////////////////

        /**
         * Register authentication state change callback, try to pre-load item
         * attributes based on URL, and save a snapshot of the item.
         */
        function activate() {
            authService.$onAuth(vm.onAuth);
            
            var category = categoryService.getByNameSync($stateParams.category);
            vm.item = vm.item || {
                title: $stateParams.title,
                category: category ? category.$id : null
            };

            vm.updateSnapshot(vm.item);
            $scope.$on('$destroy', function () {
                _.forEach(vm.itemSnapshotProperties, function (prop) {
                    vm.item[prop] = vm.itemSnapshot[prop] || null;
                });
            });
        }

        /**
         * Callback invoked upon a change to authentication state.
         */
        function onAuth(auth) {
            vm.auth = auth;
        }

        /**
         * Update item snapshot (once at view initialization and every save).
         */
        function updateSnapshot(item) {
            vm.itemSnapshot = _.pick(item, vm.itemSnapshotProperties);
        }

        /**
         * Edit button click handler. Enters edit mode.
         */
        function edit(item, $event) {
            vm.inEditMode = true;
        }

        /**
         * Determine if edit/remove buttons should be visible.
         */
        function showEditRemove(item, auth) {
            return !vm.inEditMode && item && auth && item.creator === auth.uid;
        }

        /**
         * Remove button click handler.
         */
        function remove(item, $event) {
            $mdDialog.show(
                $mdDialog.confirm()
                .title('Remove Item')
                .textContent('Are you sure you want to remove this item?')
                .ok('Ok')
                .cancel('Cancel')
                .targetEvent($event)
            )
            .then(function () {
                vm.working = true;
                return itemService.remove(item);
            })
            .then(function () {
                $mdToast.showSimple('Removed.');
                vm.goToCategory(item);
            })
            .catch(function (error) {
                if (error && error.message) {
                    $mdToast.showSimple('Error removing. Please try again.');
                }
            })
            .finally(function () {
                vm.working = false;
            });
        }

        /**
         * Go to the category items view for the item in its current state.
         */
        function goToCategory(item) {
            var category = categoryService.getByIdSync(item.category);
            if (category) {
                $state.go('app.default.items', {
                    category: category.name
                });
            }
        }

        /**
         * Save button click handler.
         */
        function save(item, $event) {
            if (!itemService.hasUniqueTitle(item)) {
                $mdToast.showSimple('Title must be unique in this category.');
                return;
            }

            vm.working = true;

            if (angular.isUndefined(item.creator)) {
                item.creator = vm.auth.uid;
            }
            if (angular.isUndefined(item.created)) {
                item.created = moment.utc().format();
            }

            itemService.save(item)
            .then(function () {
                $mdToast.showSimple('Saved.');
                if (angular.isUndefined(item.$id)) {
                    vm.goToCategory(item);
                } else {
                    vm.updateSnapshot(item);
                    vm.inEditMode = false;
                }
            })
            .catch(function () {
                $mdToast.showSimple('Error saving. Please try again.');
            })
            .finally(function () {
                vm.working = false;
            });
        }

        /**
         * Upload picture button click handler.
         */
        function uploadPicture(file) {
            vm.uploading = true;
            Upload.base64DataUrl(file)
            .then(function (picture) {
                vm.item.picture = picture;
                $mdToast.showSimple('Uploaded.');
            })
            .catch(function (error) {
                $mdToast.showSimple('Error uploading. Please try again.');
            })
            .finally(function () {
                vm.uploading = false;
            });
        }

        /**
         * Remove item picture.
         */
        function removePicture(item, $event) {
            item.picture = null;
        }
    }
})();