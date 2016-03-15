(function () {
    'use strict';

    angular
        .module('app')
        .run(runFunction);

    runFunction.$inject = [
        'categoryService',
        'itemService'
    ];
    
    function runFunction(categoryService, itemService) {
        categoryService.get();
        itemService.get();
    }
})();
