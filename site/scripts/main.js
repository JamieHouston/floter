/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
'use strict';

angular.module('home', [
  'adf', 'adf.structures.base', 'adf.widget.news',
  'adf.widget.randommsg', 'adf.widget.weather',
  'adf.widget.markdown', 'adf.widget.linklist',
  'adf.widget.github', 'adf.widget.version',
  'adf.widget.clock', 'LocalStorageModule', 'ngRoute'
])
.config(function(dashboardProvider, $routeProvider, localStorageServiceProvider){
  dashboardProvider.widgetsPath('widgets/');
  localStorageServiceProvider.setPrefix('adf');

  $routeProvider.when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'homeCtrl'
  })
  .otherwise({
    redirectTo: 'home'
  });

})
.controller('navigationCtrl', function($scope, $location){

  $scope.navCollapsed = true;

  $scope.toggleNav = function(){
    $scope.navCollapsed = !$scope.navCollapsed;
  };

  $scope.$on('$routeChangeStart', function() {
    $scope.navCollapsed = true;
  });

  $scope.navClass = function(page) {
    var currentRoute = $location.path().substring(1) || 'home';
    return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
  };

})
.controller('homeCtrl', function($scope, localStorageService){
  var name = 'Home Page';
  var model = localStorageService.get(name);
  if (!model) {
    // set default model for demo purposes
    model = {
      title: "Home",
      structure: "4-8",
      rows: [{
        columns: [{
          styleClass: "col-md-4",
          widgets: [{
            type: "linklist",
            config: {
              links: [{
                title: "PPM",
                href: "http://github.com/daptiv/ppm"
              }, {
                title: "Target Process",
                href: "https://daptiv.tpondemand.com"
              }, {
                title: "Team City",
                href: "http://teamcity.hq.daptiv.com"
              }]
            },
            title: "Links"
          }, {
            type: "weather",
            config: {
              location: "98101"
            },
            title: "Weather Seattle"
          }]
        }, {
          styleClass: "col-md-8",
          widgets: [{
            type: "githubHistory",
            config: {
              path: "foresterh/floter"
            },
            title: "Floter History"
          }, {
            type: "markdown",
            config: {
              content: "[Daptiv](http://daptiv.com) hackdays created this *thing*."
            },
            title: "Markdown"
          }]
        }]
      }]
    };
  }
  $scope.name = name;
  $scope.model = model;
  $scope.collapsible = false;

  $scope.$on('adfDashboardChanged', function (event, name, model) {
    localStorageService.set(name, model);
  });

});
