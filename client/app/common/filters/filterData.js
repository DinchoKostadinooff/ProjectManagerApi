(function() {
    'use strict';

    angular
        .module('projectManager')
        .filter('filterData', filterData);

    filterData.$inject = [];

    function filterData() {

        return function(vals, data) {
            var out = [];
            if (data) {
                for (var i = 0; i < vals.length; i++) {
                    for (var j = 0; j < data.length; i++) {
                        if (!checkIfExists(vals, data[j])) {
                            out.push(vals[i]);
                        }
                    }
                }
                return out;
            }

            return vals;

        };
    }

    function checkIfExists(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]._id === value) {
                return true;
            }
        }
        return false;
    }

})();
