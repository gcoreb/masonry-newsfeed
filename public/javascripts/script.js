/**
 * Created by bryanchen on 7/26/16.
 */
(function () {

    var appModule = angular.module('NewsFeedApp', ['wu.masonry','relativeDate']);

    appModule.controller('NewsFeedController', ['$scope','$rootScope','$http','$window',function ($scope,$rootScope, $http,$window) {
        $scope.refilter = function(category){
            $scope.items = [];
            $scope.category = category;
            $scope.loadMoreRecords();
        }
        $scope.openLink = function(url) {
            $window.open(url, "_blank")
        }
        $scope.reload = function(){
            $rootScope.$emit("callReload", {});
        }
        $scope.category = 'all';
        $scope.loading = false;
        $scope.items = [];
        $scope.count = 1;
        $scope.loadMoreRecords = function () {
            console.log("scrolled.", $scope.loading);
            $scope.loading = true;
                $http.get("/feed?limit=10&offset=" + $scope.count*10 + "&category=" + $scope.category).then(function (news) {
                    if(news.data.message == "API not found with these values"){
                        $scope.loadMoreRecords();
                        return false;
                    }
                    for (var i = 0; i < news.data.results.length; i++) {
                        if(!news.data.results[i].multimedia){
                            news.data.results[i].multimedia = [{},{},{},{}];
                            news.data.results[i].multimedia[1].url = "http://sleepypod.com/latest/wp-content/uploads/2016/03/the-new-york-times.jpg";
                        }
                        $scope.items.push(news.data.results[i]);
                        if(i==news.data.results.length-1){
                            $scope.loading = false;
                            console.log("done!");
                        }
                    }
                    $scope.count++;
                })
        }
        $scope.loadMoreRecords();
    }]);
    appModule.directive('scrollTrigger', function($window) {
        return {
            link : function(scope, element, attrs) {
                var offset = parseInt(attrs.threshold) || 0;
                var e = jQuery(element[0]);
                var doc = jQuery(document);
                angular.element(document).bind('scroll', function() {
                    if (doc.scrollTop() + $window.innerHeight + offset > e.offset().top && !scope.loading) {
                        scope.$apply(attrs.scrollTrigger);
                    }
                });
            }
        };
    });

}());
