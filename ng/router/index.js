/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('app.router', ['ui.router'])
  .config(config);

function config($stateProvider, $urlRouterProvider, $httpProvider, toastrConfig){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

  $httpProvider.interceptors.push(function($q) {
    return {
      responseError: function(rejection) {
        if(rejection.status <= 0) {
          if(window.navigator.onLine==true){
            window.location.href = '#/login';
            return;
          }else{
            alert("网络已断开");
          }
        }
        return $q.reject(rejection);
      }
    };
  });

  angular.extend(toastrConfig, {
    allowHtml: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    extendedTimeOut: 1000,
    maxOpened: 1,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-dark',
      warning: 'toast-warning'
    },
    timeOut: 2000
  });

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    // 首页
    .state('home', {
      url: "/index",
      templateUrl: "views/home/index.html",
      controller: "homeCtl",
      controllerAs: "homeVm"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/main/login.html"
    })
    .state('village', {
      url: "/village?:id",
      templateUrl: "views/village/village.html",
      controller: "villageCtl",
      controllerAs: "villageVm"
    })
    .state('entrance', {
      url: "/entrance",
      templateUrl: "views/entrance/entrance.html",
      controller: "entranceCtl",
      controllerAs: "entranceVm"
    })
    .state('entrance.household', {
      url: "/household?:id",
      templateUrl: "views/entrance/household.html",
      controller: "householdCtl",
      controllerAs: "householdVm"
    })
    .state('entrance.common', {
      url: "/common?:id",
      templateUrl: "views/entrance/common.html",
      controller: "commonCtl",
      controllerAs: "commonVm"
    })
    .state('device', {
      url: "/device?:id",
      templateUrl: "views/device/device.html",
      controller: "deviceCtl",
      controllerAs: "deviceVm"
    })
    .state('log', {
      url: "/log",
      templateUrl: "views/log/log.html",
      controller: "logCtl",
      controllerAs: "logVm"
    })
    .state('log.open', {
      url: "/open?:id",
      templateUrl: "views/log/open.html",
      controller: "openCtl",
      controllerAs: "openVm"
    })
    .state('log.remove', {
      url: "/remove?:id",
      templateUrl: "views/log/remove.html",
      controller: "removeCtl",
      controllerAs: "removeVm"
    })
    .state('suggest', {
      url: "/suggest",
      templateUrl: "views/suggest/suggest.html",
      controller: "suggestCtl",
      controllerAs: "suggestVm"
    })

}