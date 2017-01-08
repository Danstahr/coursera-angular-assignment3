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
        if (searchTerm.length === 0) {
            return Promise.resolve([]);
        }

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
    narrow.nothingFound = false;

    narrow.searchMenu = function () {
        MenuSearchService.getMatchedMenuItems(narrow.searchTerm)
            .then(function (result) {
                console.log(result);
                narrow.found = result;
                narrow.nothingFound = result.length === 0;
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