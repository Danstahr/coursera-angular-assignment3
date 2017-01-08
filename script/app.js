(function () {
'use strict';

angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
        var promise = $http({
            url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
        });

        return promise.then(function(result) {
            var foundItems =  result.data.menu_items;

            return foundItems.filter(function(item) {
                return item.description.search(searchTerm) !== -1;
            });
        });
    }
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var narrow = this;

    narrow.searchTerm = "";
    narrow.found = [];

    narrow.searchMenu = function () {
        MenuSearchService.getMatchedMenuItems(narrow.searchTerm)
            .then(function (result) {
                narrow.found = result;
            }).catch(function (result) {
                console.log("Oh no...", result);
            }
        )
    };

    narrow.removeItem = function (index) {
        narrow.found.splice(index, 1);
    }
}

function FoundItemsDirective() {
    return {
        restrict: "E",
        scope: {
            foundItems: "<",
            onRemove: "&"
        },
        templateUrl: "templates/foundItems.html"
    };
}
})();