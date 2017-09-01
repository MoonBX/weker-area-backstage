/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('app', [
  'ui.router',
  'ui.select2',
  'ui.bootstrap',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.dropdown',
  'ngAnimate',
  'angular-loading-bar',
  'angularBootstrapNavTree',
  'toastr',
  'angularFileUpload',
  // 'ng-sweet-alert',
  'ngSanitize',
  'app.router',
  'mainMdl',
  'mainApi',
  'directive.pagination',
  'directive.cascade',
  'directive.filterButton',
  'directive.select',
  'homeMdl',
  'villageMdl',
  'entranceMdl',
  'deviceMdl',
  'logMdl',
  'suggestMdl',
  'villageApi',
  'homeApi',
  'doorApi',
  'deviceApi',
  'logApi',
  'httpApi'
]);

angular.module('app')
  .run(initConfig)
  .config(config);

function initConfig(uiSelect2Config){
   uiSelect2Config.minimumResultsForSearch = -1;
  uiSelect2Config.placeholder = "Placeholder text";
}

function config(toastrConfig){
  angular.extend(toastrConfig, {
    iconClasses: {
      error: 'toast-error',
      info: 'toast-dark',
      success: 'toast-success',
      warning: 'toast-warning'
    }
  });
}

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
/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.cascade', [])
  .directive('myCascadeFive', myCascadeFive)
  .directive('myCascadeFour', myCascadeFour);

function myCascadeFive(){
  return {
    restrict: 'E',
    scope: {
      communityId: '=',
      partitionId: '=',
      blockId: '=',
      unitId: '=',
      roomId: '=',
      getPartitions: '&',
      getBlocks: '&',
      getUnits: '&',
      getRooms: '&',
      communities: '=',
      partitions: '=',
      blocks: '=',
      units: '=',
      rooms: '='
    },
    template: '<div class="pull-left w-sm m-r-sm"><select ng-cloak ui-select2 ng-model="communityId" data-placeholder="小区" ng-change="getPartitions({communityId: communityId})"> <option value=""></option><option ng-value="item.communityId" ng-repeat="item in communities"> {{item.communityName}} </option> </select></div> <div class="pull-left w-sm m-r-sm"><select ng-cloak ui-select2 ng-model="partitionId" data-placeholder="分区" ng-change="getBlocks({partitionId: partitionId})"> <option value=""></option><option ng-value="item.communityPartitionId" ng-repeat="item in partitions"> {{item.communityPartitionName}} </option> </select> </div><div class="pull-left w-xs m-r-sm" > <select ng-cloak ui-select2 name="louyu" ng-model="blockId" data-placeholder="楼宇" ng-change="getUnits({blockId: blockId})"> <option value=""></option> <option ng-value="item.communityBlockId" ng-repeat="item in blocks"> {{item.communityBlockName}} </option> </select> </div><div class="pull-left w-xs m-r-sm"> <select ng-cloak ui-select2 name="danyuan" ng-model="unitId" data-placeholder="单元" ng-change="getRooms({unitId: unitId})"> <option value=""></option> <option ng-value="item.unitId" ng-repeat="item in units"> {{item.unitName}} </option> </select> </div><div class="pull-left w-xs m-r-lg"> <select ng-cloak ui-select2 name="fanghao" ng-model="roomId" data-placeholder="房号"> <option value=""></option> <option ng-value="item.roomNoId" ng-repeat="item in rooms"> {{item.code}} </option> </select> </div>'
  }
}

function myCascadeFour(){
  return {
    restrict: 'E',
    scope: {
      communityId: '=',
      partitionId: '=',
      blockId: '=',
      unitId: '=',
      roomId: '=',
      getPartitions: '&',
      getCommunity: '&',
      getBlocks: '&',
      getUnits: '&',
      communities: '=',
      partitions: '=',
      blocks: '=',
      units: '='
    },
    template: '<div class="pull-left w-sm m-r-sm"><select ng-cloak ui-select2 ng-model="communityId" data-placeholder="小区" ng-change="getPartitions({communityId: communityId})"> <option value=""></option><option ng-value="item.communityId" ng-repeat="item in communities"> {{item.communityName}} </option> </select></div> <div class="pull-left w-sm m-r-sm"><select ng-cloak ui-select2 ng-model="partitionId" data-placeholder="分区" ng-change="getBlocks({partitionId: partitionId})"> <option value=""></option><option ng-value="item.communityPartitionId" ng-repeat="item in partitions"> {{item.communityPartitionName}} </option> </select> </div><div class="pull-left w-xs m-r-sm" > <select ui-select2 ng-cloak name="louyu" ng-model="blockId" data-placeholder="楼宇" ng-change="getUnits({blockId: blockId})"> <option value=""></option> <option ng-value="item.communityBlockId" ng-repeat="item in blocks"> {{item.communityBlockName}} </option> </select> </div><div class="pull-left w-xs m-r-sm"> <select ng-cloak ui-select2 name="danyuan" ng-model="unitId" data-placeholder="单元" ng-change="getRooms({unitId: unitId})"> <option value=""></option> <option ng-value="item.unitId" ng-repeat="item in units"> {{item.unitName}} </option> </select> </div>'
  }
}
/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.filterButton', [])
  .directive('myFilterButton', myFilterButton);

function myFilterButton(){
  return {
    restrict: 'E',
    scope: {
      getSearch: '&',
      clearSession: '&',
      selectList: '=',
      getList: '='
    },
    template: '<button class="btn btn-sm btn-primary p-h-lg" ng-click="getSearch({selectList: selectList, getList: getList})"> 搜索 </button> <button class="btn btn-sm btn-primary btn-stroke p-h-lg m-l-md" ng-click="clearSession()"> 清空 </button>'
  }
}
/**
 * Created by zhongyuqiang on 2017/7/20.
 */
angular.module('directive.pagination', [])
  .directive('myPagination', myPagination);

function myPagination(){
  return{
    restrict: 'E',
    scope: {
      pages: '=',
      selectPage: '&',
      isFirstPage: '=',
      isLastPage: '=',
      pageActive: '=',
      pagesNum: '=',
      pagesTotal: '=',
      pageSkip: '='
    },
    template: '<ul class="pagination pull-left p-h-sm"><li ng-class="{active: pageActive, disabled: isFirstPage}" class="pagination-first"> <a href="javascript:;" ng-click="selectPage({pageTag: \'current\', pageNo: 1})">首页</a> </li> <li ng-class="{disabled:isFirstPage}" class="pagination-prev"> <a href ng-click="isFirstPage || selectPage({pageTag: \'prev\'})">上一页</a> </li> <li ng-repeat="page in pages" ng-class="{active: page.active}" class="pagination-page"><a href ng-click="selectPage({pageTag: \'current\', pageNo: page.text})">{{page.text}}</a> </li>  <li ng-class="{disabled:isLastPage}" class="pagination-next"> <a href ng-click="isLastPage || selectPage({pageTag: \'next\'})">下一页</a> </li> <li ng-class="{disabled:isLastPage}" class="pagination-last"> <a href ng-click="isLastPage || selectPage({pageTag: \'current\', pageNo: pagesNum})">尾页</a> </li></ul><div class="page-skip pull-left m-l-sm"> <span class="m-r-xs">共<b>{{pagesTotal}}</b>条</span> <span>跳转至</span> <input type="number" class="form-control" id="pageBinding" min="1" ng-model="pageSkip" max="{{pagesNum}}" style="width:80px;display: inline-block;"><span style="margin-left: 5px;">页</span><button class="btn btn-info btn-sm" style="margin-left: 10px;margin-top: -5px;" ng-disabled="!pageSkip" ng-click="selectPage({pageTag: \'current\', pageNo: pageSkip})">确定 </button></div>'
  }
}
/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.select', [])
  .directive('mySelect', mySelect);

function mySelect(){
  return {
    restrict: 'E',
    scope: {
      optList: '=',
      model: '=',
      placeholder: '@'
    },
    template: '<select ng-cloak ui-select2 ng-model="model" data-placeholder="{{placeholder}}"> <option value=""></option> <option ng-repeat="item in optList" ng-value="$index">{{item}}</select>'
  }
}
/**
 * Created by zhongyuqiang on 2017/7/26.
 */
angular.module('deviceMdl', [])
  .controller('deviceCtl', deviceCtl)
  .controller('alertCtl', alertCtl)
  .controller('dDetailCtl', dDetailCtl);

function deviceCtl($modal, $location, $state, deviceSrv, mainSrv, villageSrv, $rootScope, toastr) {
  var vm = this;
  vm.openModal = openModal;
  vm.pageNo = parseInt($location.search().id);
  vm.block = {};
  vm.deviceList = [];
  vm.selectList = {};

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/device/' + template + '.html',
      controller: controller,
      size: 'sm',
      resolve: {
        items: function () {
          if (item) {
            return item;
          }
        }
      }
    })
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getDevice(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
      getPartitions(obj.communityId);
      getBlocks(obj.partitionId);
      getUnits(obj.blockId);
      getRooms(obj.unitId);
      getDevice(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  getCommunity();
  function getCommunity() {
    mainSrv.getCommunity().then(function (res) {
      console.log(res);
      vm.block.communities = res.data;
    })
  }

  vm.getPartitions = getPartitions;
  function getPartitions(communityId) {
    console.log(communityId);
    mainSrv.getPartitions(communityId).then(function (res) {
      console.log(res);
      vm.block.partitions = res.data;
    })
  }

  vm.getBlocks = getBlocks;
  function getBlocks(partitionId) {
    console.log(partitionId);
    mainSrv.getBlocks(partitionId).then(function (res) {
      console.log(res);
      vm.block.blocks = res.data;
    })
  }

  vm.getUnits = getUnits;
  function getUnits(blockId) {
    console.log(blockId);
    mainSrv.getUnits(blockId).then(function (res) {
      console.log(res);
      vm.block.units = res.data;
    })
  }

  getArea();

  function getArea() {
    villageSrv.getArea().then(function (res) {
      console.log(res);
      vm.arrayList = res.data;
    })
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getDevice(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    console.log(obj)
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  vm.selectPage = selectPage;
  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('device', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('device', {id: vm.pageNo - 1});
    } else {
      $state.go('device', {id: pageNo});
    }
  }


  vm.getDevice = getDevice;
  function getDevice(pageNo, obj) {
    deviceSrv.getDevice(pageNo, 9, obj).then(function (res) {
      console.log(res);

      vm.pages = [];
      if (res.success) {
        for (var i = 0; i < res.data.list.length; i++) {
          switch (res.data.list[i].type) {
            case 0:
              res.data.list[i].type_cn = '围墙机';
              break;
            case 1:
              res.data.list[i].type_cn = '单元机';
              break;
            default:
              res.data.list[i].type_cn = '';
          }
          switch (res.data.list[i].status) {
            case 0:
              res.data.list[i].status_cn = '离线';
              break;
            case 1:
              res.data.list[i].status_cn = '在线';
              break;
            default:
              res.data.list[i].status_cn = '';
          }
          switch (res.data.list[i].lockType) {
            case 0:
              res.data.list[i].lockType_cn = '磁力锁';
              break;
            case 1:
              res.data.list[i].lockType_cn = '电控锁';
              break;
            default:
              res.data.list[i].lockType_cn = '';
          }
        }
        vm.deviceList = res.data.list;
        vm.pagesNum = Math.ceil(res.data.total / 9);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 9;

        if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
          vm.isFirstPage = true;
          vm.isLastPage = true;
        } else if (vm.pageNo == 1) {
          vm.isFirstPage = true;
          vm.isLastPage = false;
        } else if (vm.pageNo == vm.pagesNum) {
          vm.isLastPage = true;
          vm.isFirstPage = false;
        }
        mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        toastr.info(res.message);
      }
    })
  }

  $rootScope.$on('refresh-device', function ($event) {
    getDevice(1);
  })
}

function alertCtl(items, $modalInstance, $timeout, toastr, $rootScope, deviceSrv) {
  var vm = this;
  vm.sn = items;
  console.log(items);

  vm.unbindDevice = unbindDevice;
  function unbindDevice() {
    deviceSrv.unbindDevice(vm.sn).then(function (res) {
      if (res.success) {
        toastr.info('解绑成功')
        $timeout(function(){
          $rootScope.$broadcast('refresh-device');
          cancel()
        }, 500)
      } else {
        toastr.info(res.message);
      }
    })
  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

}

function dDetailCtl(items, $modalInstance) {
  var vm = this;
  console.log(items);
  vm.model = items;

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}
/**
 * Created by zhongyuqiang on 2017/7/26.
 */
angular.module('entranceMdl', [])
  .controller('entranceCtl', entranceCtl)
  .controller('householdCtl', householdCtl)
  .controller('hDetailCtl', hDetailCtl)
  .controller('commonCtl', commonCtl)
  .controller('cDetailCtl', cDetailCtl);

function entranceCtl(){
  var vm = this;
}

function householdCtl($modal,$location,$state, doorSrv,mainSrv, $rootScope, toastr){
  var vm = this;
  vm.openModal = openModal;
  vm.pageNo = parseInt($location.search().id);
  vm.selectList = {};
  vm.block={};

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/entrance/' + template + '.html',
      controller: controller,
      size: 'sm',
      resolve: {
        items: function () {
          if (item) {
            return item;
          }
        }
      }
    })
  }


  getCommunity();
  function getCommunity(){
    mainSrv.getCommunity().then(function(res){
      console.log(res);
      vm.block.communities = res.data;
    })
  }
  vm.getPartitions = getPartitions;
  function getPartitions(communityId){
    console.log(communityId);
    mainSrv.getPartitions(communityId).then(function(res){
      console.log(res);
      vm.block.partitions = res.data;
    })
  }

  vm.getBlocks = getBlocks;
  function getBlocks(partitionId){
    console.log(partitionId);
    mainSrv.getBlocks(partitionId).then(function(res){
      console.log(res);
      vm.block.blocks = res.data;
    })
  }

  vm.getUnits = getUnits;
  function getUnits(blockId){
    console.log(blockId);
    mainSrv.getUnits(blockId).then(function(res){
      console.log(res);
      vm.block.units = res.data;
    })
  }
  vm.getRooms = getRooms;
  function getRooms(unitId){
    mainSrv.getRoomNo(unitId).then(function(res){
      console.log(res);
      vm.block.rooms = res.data;
    })
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getResident(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
      getPartitions(obj.communityId);
      getBlocks(obj.partitionId);
      getUnits(obj.blockId);
      getRooms(obj.unitId);
      getResident(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getResident(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    if(obj.status == 0||obj.status == 1){
      console.log('a');
      obj.effectiveType = null;
    }
    console.log(obj);
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  vm.householdList = [];

  vm.pageNo = parseInt($location.search().id);
  vm.selectPage = selectPage;
  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('entrance.household', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('entrance.household', {id: vm.pageNo - 1});
    } else {
      $state.go('entrance.household', {id: pageNo});
    }
  }

  vm.getResident = getResident;
  function getResident(pageNo, obj){
    doorSrv.getResident(pageNo, 9, obj).then(function(res){
      console.log(res);
      vm.pages = [];

      if(res.success){
        for(var i=0; i<res.data.list.length; i++){
          switch (res.data.list[i].userType) {
            case 0:
              res.data.list[i].userType_cn = '户主';
              break;
            case 1:
              res.data.list[i].userType_cn = '家人';
              break;
            case 2:
              res.data.list[i].userType_cn = '租客';
              break;
            default:
              res.data.list[i].userType_cn = '';
          }
          switch (res.data.list[i].status) {
            case 0:
              res.data.list[i].status_cn = '正常';
              break;
            case 1:
              res.data.list[i].status_cn = '过期';
              break;
            default:
              res.data.list[i].status_cn = '';
          }
        }
        vm.householdList = res.data.list;
        vm.pagesNum = Math.ceil(res.data.total / 9);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 9;

        if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
          vm.isFirstPage = true;
          vm.isLastPage = true;
        } else if (vm.pageNo == 1) {
          vm.isFirstPage = true;
          vm.isLastPage = false;
        } else if (vm.pageNo == vm.pagesNum) {
          vm.isLastPage = true;
          vm.isFirstPage = false;
        }
        mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        toarst.info(res.message);
      }
    })
  }
}

function commonCtl($modal,$location,$state, doorSrv,mainSrv, $rootScope, toastr){
  var vm = this;
  vm.openModal = openModal;
  vm.pageNo = parseInt($location.search().id);
  vm.selectList = {};

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/entrance/' + template + '.html',
      controller: controller,
      size: 'sm',
      resolve: {
        items: function () {
          if (item) {
            return item;
          }
        }
      }
    })
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getPublicCard(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
      getPublicCard(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getPublicCard(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    console.log(obj);
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  vm.commonList = [];

  vm.selectPage = selectPage;
  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('entrance.common', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('entrance.common', {id: vm.pageNo - 1});
    } else {
      $state.go('entrance.common', {id: pageNo});
    }
  }

  vm.getPublicCard = getPublicCard;
  function getPublicCard(pageNo, obj){
    doorSrv.getPublicCard(pageNo, 9, obj).then(function(res){
      console.log(res);
      vm.pages = [];
      if(res.success) {
        for (var i = 0; i < res.data.list.length; i++) {
          switch (res.data.list[i].userStatus) {
            case 0:
              res.data.list[i].userStatus_cn = '物业人员';
              break;
            case 1:
              res.data.list[i].userStatus_cn = '外部人员';
              break;
            default:
              res.data.list[i].userStatus_cn = '';
          }
          switch (res.data.list[i].vaildType) {
            case 0:
              res.data.list[i].vaildType_cn = '月卡';
              break;
            case 1:
              res.data.list[i].vaildType_cn = '季卡';
              break;
            case 2:
              res.data.list[i].vaildType_cn = '年卡';
              break;
            default:
              res.data.list[i].vaildType_cn = '';
          }
          switch (res.data.list[i].cardType) {
            case 1:
              res.data.list[i].cardType_cn = 'IC卡';
              break;
            case 2:
              res.data.list[i].cardType_cn = 'ID卡';
              break;
            default:
              res.data.list[i].cardType_cn = '';
          }
          switch (res.data.list[i].status) {
            case 0:
              res.data.list[i].status_cn = '正常';
              break;
            case 1:
              res.data.list[i].status_cn = '过期';
              break;
            default:
              res.data.list[i].status_cn = '';
          }
        }
        vm.commonList = res.data.list;
        vm.pagesNum = Math.ceil(res.data.total / 9);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 9;

        if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
          vm.isFirstPage = true;
          vm.isLastPage = true;
        } else if (vm.pageNo == 1) {
          vm.isFirstPage = true;
          vm.isLastPage = false;
        } else if (vm.pageNo == vm.pagesNum) {
          vm.isLastPage = true;
          vm.isFirstPage = false;
        }
        mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        toastr.info(res.message);
      }
    })
  }

}

function hDetailCtl(items, $modalInstance){
  var vm = this;
  vm.cancel = cancel;
  console.log(items);

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  if (items) {
    if(items.cardTypeName){
      var a = items.cardTypeName.split(' ');
      a.pop();
      items.cardTypeNameArr = listTemp(a);
    }
    vm.model = items;
  }

  function listTemp(oldList){
    var list = oldList;
    var arrTemp = [];
    var index = 0;
    var sectionCount = 2;
    for(var i=0; i<list.length; i++){
      index = parseInt(i/sectionCount);
      if(arrTemp.length <= index){
        arrTemp.push([]);
      }
      arrTemp[index].push(list[i]);
    }
    console.log(arrTemp);
    return arrTemp;
  }
}

function cDetailCtl(items, $modalInstance){
  var vm = this;
  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('homeMdl', [])
  .controller('homeCtl', homeCtl);

function homeCtl(homeSrv,$rootScope, toastr){
  var vm = this;

  vm.getAreaDevice = getAreaDevice;
  vm.getAreaPartition = getAreaPartition;
  vm.listTemp = listTemp;

  vm.areaDeviceList = {};
  vm.areaPartitionList = {};

  getAreaDevice();
  getAreaPartition();

  function getAreaDevice(){
    homeSrv.getAreaDevice().then(function(res){
      console.log(res);
      if(res.success){
        console.log(parseFloat(res.data.onlineRatio));
        vm.areaDeviceList = res.data;
        vm.areaDeviceList.onlineRatio = parseFloat(res.data.onlineRatio)
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        alert('获取失败')
      }

    })
  }

  function getAreaPartition(){
    homeSrv.getAreaPartitionDevice().then(function(res){
      console.log(res);
      if(res.success){
        vm.data = res.data;
        vm.data.onlineRatio_fl = parseFloat(res.data.onlineRatio)
        vm.areaPartitionList = listTemp(vm.data);
      }
    })
  }

  //列表分组
  function listTemp(oldList){
    var list = oldList;
    var arrTemp = [];
    var index = 0;
    var sectionCount = 3;
    for(var i=0; i<list.length; i++){
      index = parseInt(i/sectionCount);
      if(arrTemp.length <= index){
        arrTemp.push([]);
      }
      arrTemp[index].push(list[i]);
    }
    console.log(arrTemp);
    return arrTemp;
  }
}
/**
 * Created by zhongyuqiang on 2017/7/26.
 */
angular.module('logMdl', [])
  .controller('logCtl', logCtl)
  .controller('openCtl', openCtl)
  .controller('removeCtl', removeCtl)
  .controller('oDetailCtl', oDetailCtl);

function logCtl(){
  var vm = this;
}

function openCtl($modal, $location,$state, logSrv, mainSrv, $rootScope, toastr){
  var vm = this;
  vm.openModal = openModal;
  vm.unlockList = [];
  vm.block = {};
  vm.pageNo = parseInt($location.search().id);
  vm.selectList = {};

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/log/' + template + '.html',
      controller: controller,
      size: 'sm',
      resolve: {
        items: function () {
          if (item) {
            return item;
          }
        }
      }
    })
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getUnlock(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
      getPartitions(obj.communityId);
      getBlocks(obj.partitionId);
      getUnits(obj.blockId);
      getRooms(obj.unitId);
      getUnlock(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  getCommunity();
  function getCommunity(){
    mainSrv.getCommunity().then(function(res){
      console.log(res);
      vm.block.communities = res.data;
    })
  }
  vm.getPartitions = getPartitions;
  function getPartitions(communityId){
    console.log(communityId);
    mainSrv.getPartitions(communityId).then(function(res){
      console.log(res);
      vm.block.partitions = res.data;
    })
  }

  vm.getBlocks = getBlocks;
  function getBlocks(partitionId){
    console.log(partitionId);
    mainSrv.getBlocks(partitionId).then(function(res){
      console.log(res);
      vm.block.blocks = res.data;
    })
  }

  vm.getUnits = getUnits;
  function getUnits(blockId){
    console.log(blockId);
    mainSrv.getUnits(blockId).then(function(res){
      console.log(res);
      vm.block.units = res.data;
    })
  }
  vm.getRooms = getRooms;
  function getRooms(unitId){
    mainSrv.getRoomNo(unitId).then(function(res){
      console.log(res);
      vm.block.rooms = res.data;
    })
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getUnlock(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    console.log(obj);
    if(obj.st == obj.et){
      obj.et = obj.et+24*60*60*1000-1
    }
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  vm.selectPage = selectPage;
  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('log.open', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('log.open', {id: vm.pageNo - 1});
    } else {
      $state.go('log.open', {id: pageNo});
    }
  }


  vm.getUnlock = getUnlock;
  function getUnlock(pageNo, obj){
    logSrv.getUnlock(pageNo, 9, obj).then(function(res){
      console.log(res);

      vm.pages = [];
      if(res.success) {
        for (var i = 0; i < res.data.list.length; i++) {
          switch (res.data.list[i].deviceType) {
            case 0:
              res.data.list[i].deviceType_cn = '围墙机';
              break;
            case 1:
              res.data.list[i].deviceType_cn = '单元机';
              break;
            default:
              res.data.list[i].deviceType_cn = '';
          }
          switch (res.data.list[i].type) {
            case 0:
              res.data.list[i].type_cn = '呼叫开门';
              break;
            case 1:
              res.data.list[i].type_cn = '刷卡开门';
              break;
            case 2:
              res.data.list[i].type_cn = '密码开门';
              break;
            case 3:
              res.data.list[i].type_cn = '手机开门';
              break;
            default:
              res.data.list[i].type_cn = '';
          }
        }
        vm.unlockList = res.data.list;
        vm.pagesNum = Math.ceil(res.data.total / 9);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 9;

        if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
          vm.isFirstPage = true;
          vm.isLastPage = true;
        } else if (vm.pageNo == 1) {
          vm.isFirstPage = true;
          vm.isLastPage = false;
        } else if (vm.pageNo == vm.pagesNum) {
          vm.isLastPage = true;
          vm.isFirstPage = false;
        }
        mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        toastr.info(res.message);
      }


    })
  }
}

function removeCtl($location,$state, logSrv,mainSrv, $rootScope, toastr){
  var vm = this;
  vm.pageNo = parseInt($location.search().id);
  vm.removeList = [];
  vm.selectList = {};

  vm.selectPage = selectPage;
  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('log.remove', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('log.remove', {id: vm.pageNo - 1});
    } else {
      $state.go('log.remove', {id: pageNo});
    }
  }


  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getAlarm(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
      getAlarm(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getAlarm(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    if(obj.startTime == obj.endTime){
      obj.endTime = obj.endTime+24*60*60*1000-1
    }
    console.log(obj);
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  vm.getAlarm = getAlarm;
  function getAlarm(pageNo, obj){
    logSrv.getAlarm(pageNo, 9, obj).then(function(res){
      console.log(res);

      vm.pages = [];

      if(res.success){
        for (var i = 0; i < res.data.list.length; i++) {
          switch (res.data.list[i].deviceType) {
            case 0:
              res.data.list[i].deviceType_cn = '围墙机';
              break;
            case 1:
              res.data.list[i].deviceType_cn = '单元机';
              break;
            default:
              res.data.list[i].deviceType_cn = '';
          }
        }
        vm.removeList = res.data.list;
        vm.pagesNum = Math.ceil(res.data.total / 9);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 9;

        if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
          vm.isFirstPage = true;
          vm.isLastPage = true;
        } else if (vm.pageNo == 1) {
          vm.isFirstPage = true;
          vm.isLastPage = false;
        } else if (vm.pageNo == vm.pagesNum) {
          vm.isLastPage = true;
          vm.isFirstPage = false;
        }
        mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        toastr.info(res.message);
      }

    })
  }
}

function oDetailCtl(items, $modalInstance){
  var vm = this;

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  console.log(items);
  vm.model = items;
}
/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('mainMdl', [])
  .controller('mainCtl', mainCtl);

function mainCtl($scope, $rootScope, $location, $state, $timeout, $modal, cfpLoadingBar, mainSrv, toastr){
  var mainVm = this;

  console.log(localStorage.wekerAreaToken);

  mainVm.asideArr = [
    {title: '首页', icon: 'fa-home', sref: 'home', path: 'index', isActive: true},
    {title: '小区管理', icon: 'fa-building', sref: 'village', pageNo: 1, path: 'village', isActive: false},
    {title: '门禁管理', icon: 'fa-cog', sref: 'entrance.household', path: 'entrance', isActive: false, item:[
      {b_title: '门禁管理', itemName:"住户管理", sref:"entrance.household", pageNo: 1, isActive: false},
      {b_title: '门禁管理', itemName:"公卡管理", sref:"entrance.common", pageNo: 1, isActive: false}
    ]},
    {title: '设备管理', icon: 'fa-unlock-alt', sref: 'device', pageNo: 1,  path: 'device', isActive: false},
    {title: '日志管理', icon: 'fa-file-text-o', sref: 'log.open', path: 'log', isActive: false, item:[
      {b_title: '日志管理', itemName:"开门日志", sref:"log.open", pageNo: 1, isActive: false},
      {b_title: '日志管理', itemName:"防拆日志", sref:"log.remove", pageNo: 1, isActive: false}
    ]},
    //{title: '反馈意见', icon: 'fa-unlock-alt', sref: 'suggest', path: 'suggest', isActive: false}
  ];
  mainVm.currentNav = {title: '首页', icon: 'fa-home', sref: 'home', path: 'index', isActive: true};
  mainVm.pathNav = [
    {path: '/index', b_title: '首页', itemName: ''},
    {path: '/village', b_title: '小区管理', itemName: ''},
    {path: '/entrance/household', b_title: '门禁管理', itemName: '住户管理'},
    {path: '/entrance/common', b_title: '门禁管理', itemName: '公卡管理'},
    {path: '/device', b_title: '设备管理', itemName: ''},
    {path: '/log/open', b_title: '日志管理', itemName: '开门日志'},
    {path: '/log/remove', b_title: '日志管理', itemName: '防拆日志'},
    //{path: '/suggest', b_title: '反馈意见', itemName: ''}
  ];

  mainVm.wekerUsername = localStorage.wekerAreaname;
  $scope.user = {};
  mainVm.account = {};

  mainVm.login = login;
  mainVm.logout = logout;
  mainVm.logup = logup;
  mainVm.switchNavItem = switchNavItem;
  mainVm.switchItem = switchItem;
  $rootScope.openModal = openModal;
  $scope.state = $state;

  function checkUrl(){
    var pathArr = $location.path().split('/');
    var path = pathArr[1];
    var arr = mainVm.asideArr;

    if(path == 'login'){
      mainVm.isLogin = false;
    }else{
      if(!localStorage.wekerAreaToken){
        mainVm.isLogin = false;
        //$location.path('login');
        window.location.href = '/#/login';
        toastr.info('请先登录')
      }else{
        mainVm.isLogin = true;
      }
    }

    for(var i=0;i<arr.length;i++){
      mainVm.asideArr[i].isActive = false;
      if(path === arr[i].path){
        mainVm.asideArr[i].isActive = true;
        mainVm.currentNav = mainVm.asideArr[i]
      }
    }
    for(var j=0; j<mainVm.pathNav.length; j++){
      if($location.path() == mainVm.pathNav[j].path){
        mainVm.currentNav.b_title = mainVm.pathNav[j].b_title;
        mainVm.currentNav.itemName = mainVm.pathNav[j].itemName;
      }
    }
  }

  function login(obj){
    if(localStorage.wekerAreaToken){
      localStorage.removeItem('wekerAreaToken');
    }
    console.log(obj);
    mainSrv.login(obj).then(function(data){
      console.log(data);
      if(data.success){
        console.log()
        cfpLoadingBar.start();
        localStorage.wekerAreaToken = data.data.token;
        localStorage.wekerAreaname = data.data.areaName;
        mainVm.wekerUsername = localStorage.wekerAreaname;
        $timeout(function(){
          window.location.href = '/#/index';
          cfpLoadingBar.complete();
        }, 1000);
        mainVm.isLoginError = false;
      }else{
        mainVm.isLoginError = true;
      }

    }, function(error){
      console.log(error)
    })
  }

  function logout(){
    mainSrv.logout().then(function(data){
      localStorage.removeItem('wekerAreaToken');
      localStorage.removeItem('wekerUsername');
      window.location.href = '/#/login';
    }, function(error){
      console.log(error)
    })
  }

  function logup(obj){
    if($scope.updateForm.$valid){
      mainSrv.logup(obj).then(function(data){
        if(data.success){
          toastr.success('请重新登录','密码修改成功');
          $timeout(function(){
            mainVm.pwdIsError = false;
            window.location.href = '/#/login';
          }, 2000);
        }else{
          mainVm.pwdIsError = true;
        }
      }, function(error){
        console.log(error)
      })
    }else{
      $scope.updateForm.submitted = true;
    }
  }

  function switchNavItem(index){
    mainVm.currentNav = mainVm.asideArr[index];
    for(var i=0;i<mainVm.asideArr.length;i++){
      mainVm.asideArr[i].isActive = false;
      if(index == i)
        mainVm.currentNav.isActive = true;
    }
    if(!mainVm.currentNav.item){
      cfpLoadingBar.start();
      $timeout(function(){
        $state.go(mainVm.currentNav.sref, {id: mainVm.currentNav.pageNo});
        cfpLoadingBar.complete();
      }, 1000)
    }else{
      for(var j=0; j<mainVm.pathNav.length; j++){
        if($location.path() == mainVm.pathNav[j].path){
          mainVm.currentNav.b_title = mainVm.pathNav[j].b_title;
          mainVm.currentNav.itemName = mainVm.pathNav[j].itemName;
        }
      }
    }
  }

  function switchItem(item){
    if(item.pageNo){
      $state.go(item.sref, {id: item.pageNo});
    }else{
      $state.go(item.sref);
    }
    if(sessionStorage.filterList){
      sessionStorage.removeItem('filterList');
    }
    mainVm.currentNav.itemName = item.itemName;
    mainVm.currentNav.b_title = item.b_title;
  }

  $rootScope.$on('$stateChangeStart', function(){
    cfpLoadingBar.start();
    $timeout(function(){
      cfpLoadingBar.complete();
    }, 1000)

  });

  //$locationChangeSuccess: 监听路由变化事件
  $scope.$on("$locationChangeSuccess", function () {
    checkUrl();
  });

  $rootScope.$on("tokenExpired", function(){
    window.location.href = '/#/login';

  });

  function openModal(template, controller){
    $modal.open({
      templateUrl: './views' + template + '.html',
      controller: controller,
      size: 'sm'
    })
  }
}
/**
 * Created by zhongyuqiang on 2017/7/26.
 */
angular.module('suggestMdl', [])
  .controller('suggestCtl', suggestCtl)
  .controller('detailCtl', detailCtl);

function suggestCtl($modal){
  var vm = this;
  vm.openModal = openModal;

  function openModal(template, controller) {
    $modal.open({
      templateUrl: './views/suggest/' + template + '.html',
      controller: controller,
      size: 'sm'
    })
  }
}

function detailCtl(){

}
/**
 * Created by zhongyuqiang on 2017/7/25.
 */
angular.module('villageMdl', [])
  .controller('villageCtl', villageCtl)
  .controller('createCtl', createCtl)
  .controller('appearCtl', appearCtl)
  .controller('roomCtl', roomCtl);

function villageCtl($modal, $rootScope, $location, $state, villageSrv, mainSrv, toastr) {
  var vm = this;

  vm.openModal = openModal;
  vm.getCommunity = getCommunity;
  vm.selectPage = selectPage;

  vm.communityList = []; //小区列表
  vm.pageNo = parseInt($location.search().id);
  vm.selectList = {};

  getArea();

  function getArea() {
    villageSrv.getArea().then(function (res) {
      console.log(res);
      if(res.success) {
        vm.arrayList = res.data;
      }
    })
  }

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/village/' + template + '.html',
      controller: controller,
      size: 'sm',
      resolve: {
        items: function () {
          if (item) {
            return item;
          }
        }
      }
    })
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getCommunity(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getCommunity(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }


  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getCommunity(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('village', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('village', {id: vm.pageNo - 1});
    } else {
      $state.go('village', {id: pageNo});
    }
  }

  function getCommunity(pageNo, obj) {
    villageSrv.getCommunity(pageNo, 9, obj).then(function (res) {
      console.log('获取小区列表: ', res);
      vm.pages = [];
      if(res.success){
        vm.communityList = res.data.list;
        vm.pagesNum = Math.ceil(res.data.total / 9);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 9;

        for(var i=0; i<vm.communityList.length; i++){
          if(vm.communityList[i].userName){
            vm.communityList[i].userNameArr = vm.communityList[i].userName.split('/');
          }
        }

        if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
          vm.isFirstPage = true;
          vm.isLastPage = true;
        } else if (vm.pageNo == 1) {
          vm.isFirstPage = true;
          vm.isLastPage = false;
        } else if (vm.pageNo == vm.pagesNum) {
          vm.isLastPage = true;
          vm.isFirstPage = false;
        }
        mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
        toastr.info('登录信息失效, 请重新登录');
      }else{
        toastr.info(res.message);
      }
    })
  }

  $rootScope.$on('refresh-village', function ($event) {
    getCommunity(1);
  })
}

function createCtl($rootScope, $scope, villageSrv, $modalInstance, items, toastr, $timeout) {
  var vm = this;

  vm.getArea = getArea;
  vm.arrayList = [];
  vm.model = {};

  if (items) {
    console.log(items);
    vm.isUpdate = true;
    vm.title = '修改小区';
    vm.model.userName = items.account;
    vm.model.areaPartitionId = items.areaPartitionId;
    vm.model.estateName = items.estateName;
    vm.model.estateTel = items.estateTel;
    vm.model = {
      communityId: items.communityId,
      userName: items.account,
      areaPartitionId: items.areaPartitionId,
      estateName: items.estateName,
      estateTel: items.estateTel,
      operationTel: items.operationTel,
      consumerTel: items.consumerTel,
      password: '●●●●●●',
      communityName: items.communityName
    };
    vm.createVillage = updateVillage;
    vm.passBlur = passBlurUpdate;
    getArea();
  } else {
    vm.title = '添加小区';
    vm.model.password = '123456';
    vm.createVillage = createVillage;
    vm.passBlur = passBlurCreate;

    getArea();
  }



  vm.passFocus = passFocus;
  function passFocus(){
    vm.model.password = '';
  }

  function passBlurCreate(){
    vm.model.password = '123456';
  }

  function passBlurUpdate(){
    vm.model.password = '●●●●●●';
  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function getArea() {
    villageSrv.getArea().then(function (res) {
      console.log(res);
      if(res.success){
        vm.arrayList = res.data;
        if(!items){
          vm.model.areaPartitionId = vm.arrayList[0].id;
        }
      }
    })
  }

  function createVillage(obj) {
    if ($scope.createVillageForm.$valid) {
      console.log(obj);
      villageSrv.createCommunity(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          toastr.info('创建成功');
          $timeout(function () {
            $rootScope.$broadcast('refresh-village');
            cancel();
          }, 500);
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      $scope.createVillageForm.submitted = true;
    }
  }

  function updateVillage(obj) {
    if ($scope.createVillageForm.$valid) {
      console.log(obj);
      villageSrv.editCommunity(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          toastr.info('修改成功');
          $timeout(function () {
            $rootScope.$broadcast('refresh-village');
            cancel();
          }, 500);
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      $scope.createVillageForm.submitted = true;
      console.log('表单未通过')
    }
  }
}

function appearCtl(villageSrv, $modalInstance, $filter, $timeout, items, toastr) {

  //console.log(JSON.stringify(jsonObj));

  var vm = this;
  vm.cancel = cancel;
  vm.model = items;
  vm.communityId = items.communityId;
  vm.partitionId = "";
  vm.machineToggle = false;

  vm.getDevicePartition = getDevicePartition;
  vm.devicePartitionList = [];

  vm.machineList = [];
  vm.filterMachineList = [];

  vm.locationArr = [];
  vm.wallMachineList = []; // 需要上传的围墙机列表
  vm.wallMachineExistList = []; // 已存在的围墙机列表
  vm.unitList = [];
  vm.newUnitList = [];
  vm.taskMemberExistList = [];
  vm.taskMemberList = [];

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  getDevicePartition();
  getTaskMember();

  // 获取门禁点位
  function getDevicePartition() {
    villageSrv.getDeviceLocation(vm.communityId).then(function (res) {
      console.log(res);
      if (res.success) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].active = 'false';
        }
        vm.devicePartitionList = res.data;
      } else {
        alert(res);
      }
    })
  }

  // 获取派发人员
  function getTaskMember() {
    villageSrv.getTask(vm.communityId).then(function (res) {
      console.log(res.data);
      if (res.success) {
        vm.taskMemberExistList = res.data;
        vm.taskMemberList = [];
      }
    })
  }

  // 获取设备派发
  vm.getDeviceTask = getDeviceTask;
  function getDeviceTask(partitionId, index) {
    vm.taskIndex = index;
    for (var j = 0; j < vm.devicePartitionList.length; j++) {
      vm.devicePartitionList[j].active = false;
      if (j == index) {
        vm.devicePartitionList[j].active = true;
      }
    }
    vm.wallMachineExistList = [];
    vm.wallMachineList = [];
    vm.filterMachineList = [];
    vm.unitList = [];

    villageSrv.getDeviceTask(partitionId).then(function (res) {
      console.log(res);
      var arr = [];
      if (res.success) {
        vm.machineToggle = true;
        vm.machineList = res.data;
        //保存partitionId
        vm.partitionId = partitionId;

        // 通过deviceType把围墙机和单元机区分
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].deviceType != 0) {
            arr.push(res.data[i].location);
            vm.unitList.push({
              id: res.data[i].id,
              blockId: res.data[i].blockId,
              location: res.data[i].location,
              unitName: res.data[i].unitName,
              unitId: res.data[i].unitId,
              deviceType: 1,
              communityId: vm.communityId,
              partitionId: vm.partitionId
            })
          } else {
            vm.wallMachineExistList.push(res.data[i]);
          }
        }

        vm.unitListGroup = arrGroup(vm.unitList);
        console.log(vm.unitList);
        console.log(vm.unitListGroup);

      } else {
        alert(res)
      }
    })
  }

  function arrGroup(arr) {
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = arr[i];
      if (!map[ai.unitName]) {
        dest.push({
          unitName: ai.unitName,
          data: [ai]
        });
        map[ai.unitName] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.unitName == ai.unitName) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }

    return dest;
  }

  vm.checkAllToggle = false;
  vm.selectAll = selectAll;
  function selectAll() {
    vm.checkAllToggle = !vm.checkAllToggle;
    if (vm.checkAllToggle) {
      for (var i = 0; i < vm.unitListGroup.length; i++) {
        vm.unitListGroup[i].select = true;
      }
    } else {
      for (var i = 0; i < vm.unitListGroup.length; i++) {
        vm.unitListGroup[i].select = false;
      }
    }
  }

  vm.selectCurrent = selectCurrent;
  function selectCurrent(obj) {
    obj.select = true;
  }

  function checkSelectCurrent() {
    if (vm.checkAllToggle) {
      for (var i = 0; i < vm.unitListGroup.length; i++) {
        vm.unitListGroup[i].select = true;
      }
    } else {
      for (var i = 0; i < vm.unitListGroup.length; i++) {
        vm.unitListGroup[i].select = false;
      }
    }
  }

  vm.try_adding_unit = try_adding_unit;
  function try_adding_unit(location) {
    var obj = {};
    var objArr = [];
    //checkSelectCurrent();
    console.log(vm.unitListGroup);
    for (var i = 0; i < vm.unitListGroup.length; i++) {
      if (vm.unitListGroup[i].select == true) {
        var locationIsExist = findArray(vm.unitListGroup[i].data, {location: location});
        if (locationIsExist == -1) {
          objArr.push({
            blockId: vm.unitListGroup[i].data[0].blockId,
            location: location,
            unitName: vm.unitListGroup[i].data[0].unitName,
            unitId: vm.unitListGroup[i].data[0].unitId,
            deviceType: 1,
            communityId: vm.communityId,
            partitionId: vm.partitionId
          });
        }
      }
    }
    obj.list = objArr;
    console.log(obj);
    if (obj.list.length) {
      villageSrv.createDeviceTask(obj).then(function (res) {
        if (res.success) {
          getDeviceTask(vm.partitionId, vm.taskIndex);
          toastr.info('单元机派发成功');
          vm.checkAllToggle = false;
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      toastr.info('请先勾选单元信息')
    }

  }

  vm.try_delete_unit = try_delete_unit;
  function try_delete_unit(location) {
    var obj = {};
    var objArr = [];
    //checkSelectCurrent();
    for (var i = 0; i < vm.unitListGroup.length; i++) {
      if (vm.unitListGroup[i].select == true) {
        var locationIsExist = findArray(vm.unitListGroup[i].data, {location: location});
        if (locationIsExist != -1) {
          objArr.push(vm.unitListGroup[i].data[locationIsExist].id);
        }
      }
    }
    console.log(objArr);
    obj.ids = objArr;
    if (obj.ids.length) {
      console.log(obj);
      villageSrv.deleteMultiDeviceTask(obj).then(function (res) {
        if (res.success) {
          toastr.info('删除成功');
          getDeviceTask(vm.partitionId, vm.taskIndex);
          vm.checkAllToggle = false;
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      toastr.info('请先勾选单元信息')
    }

  }

  function findArray(array, feature) {
    var all = true;
    for (var index in array) {
      var cur = array[index];
      if (feature instanceof Object) {
        var allRight = true;
        for (var key in feature) {
          var value = feature[key];
          if (cur[key] == value && !all) return index;
          if (all && cur[key] != value) {
            allRight = false;
            break;
          }
        }
        if (allRight) return index;
      } else {
        if (cur == feature) {
          return index;
        }
      }
    }
    return -1;
  }

  //增加围墙机
  vm.addWallMachine = addWallMachine;
  function addWallMachine() {
    if (checkTextTemp(vm.wallMachineName) == -1) {
      toastr.info('围墙机字数不能超过10个字')
    } else {
      var objArr = {};
      objArr.list = [];
      if (vm.wallMachineName) {
        var postObj = {
          location: vm.wallMachineName,
          deviceType: 0,
          communityId: vm.communityId,
          partitionId: vm.partitionId
        };
        objArr.list.push(postObj);
        console.log(objArr);
        villageSrv.createDeviceTask(objArr).then(function (res) {
          console.log(res);
          if (res.success) {
            vm.wallMachineName = "";
            getDeviceTask(vm.partitionId, vm.taskIndex);
          } else {
            toastr.info(res.message);
          }
        })
      }
    }
  }

  //删除已存在的围墙机数据
  vm.deleteExistWallMachine = deleteExistWallMachine;
  function deleteExistWallMachine(id, index) {
    console.log(id);
    var obj = {};
    obj.id = id;
    villageSrv.deleteDeviceTask(obj).then(function (res) {
      console.log(res);
      if (res.success) {
        vm.wallMachineExistList.splice(index, 1);
      }
    })
  }

  //删除临时围墙机数据
  vm.deleteTempWallMachine = deleteWallMachine;
  function deleteWallMachine() {
    console.log(vm.wallMachineList);
  }

  vm.deleteExistTaskMember = deleteExistTaskMember;
  function deleteExistTaskMember(id, index) {
    var obj = {};
    obj.workTaskId = id;
    villageSrv.deleteTaskSend(obj).then(function (res) {
      console.log(res);
      if (res.success) {
        vm.taskMemberExistList.splice(index, 1);
      }
    })
  };

  vm.deleteTaskMember = deleteTaskMember;
  function deleteTaskMember(id, index) {
    var obj = {};
    obj.workTaskId = id;
    villageSrv.deleteTaskSend(obj).then(function (res) {
      console.log(res);
      if (res.success) {
        vm.taskMemberList.splice(index, 1);
      }
    })
  }

  // 新增临时派发人员
  vm.addTaskTempMember = addTaskTempMember;
  function addTaskTempMember() {
    console.log(vm.taskMemberName);
    var postObj = {};
    vm.taskMemberList.push(vm.taskMemberName);
    if (vm.taskMemberName) {
      if (checktelephone(vm.taskMemberName) == -1) {
        toastr.info('请填写正确的手机号码')
      } else {
        postObj.communityId = vm.communityId;
        postObj.userNames = vm.taskMemberName;
        villageSrv.createTaskMember(postObj).then(function (res) {
          if (res.success) {
            console.log(res);
            vm.taskMemberName = '';
            getTaskMember();
          } else {
            toastr.info(res.message);
          }
        })
      }
    } else {
      console.log('请填写正确的手机号码');
    }
  }

  function checktelephone(cellPhone) {
    var RegCellPhone = /^1(3|4|5|7|8)\d{9}$/;
    var flag = cellPhone.search(RegCellPhone);
    return flag;
  }

  function checkTextTemp(text) {
    if (text.length > 10) {
      return -1;
    }
  }

  vm.save_taskMember = save_taskMember;
  function save_taskMember() {
    if (vm.taskMemberName) {
      if (checktelephone(vm.taskMemberName) == -1) {
        toastr.info('请填写正确的手机号码')
      } else {
        vm.taskMemberList.push(vm.taskMemberName);
        vm.taskMemberName = "";
        var postObj = {};
        postObj.communityId = vm.communityId;
        postObj.userNames = vm.taskMemberList.join('/');
        console.log(postObj);
        villageSrv.createTaskMember(postObj).then(function (res) {
          if (res.success) {
            console.log(res);
            getTaskMember();
          } else {
            toastr.info(res.message);
          }
        })
      }
    } else {
      console.log('请填写正确的手机号码');
    }
  }

  vm.addUnitMachine = addUnitMachine;
  function addUnitMachine() {
    var arr = ['1F', '2F', '3F', '4F'];
    var index = vm.locationArr.length;
    if (index < 4) {
      console.log(vm.locationArr);
      vm.locationArr.push(arr[index]);
      vm.lst = $filter("filter")(vm.unitList, arr[0]);
      console.log(vm.lst);
      for (var i = 0; i < vm.lst.length; i++) {
        vm.unitList.push({
          id: "",
          blockId: vm.lst[i].blockId,
          location: arr[index],
          unitName: vm.lst[i].unitName,
          unitId: vm.lst[i].unitId,
          deviceType: 1,
          communityId: vm.communityId,
          partitionId: vm.partitionId
        });
        vm.newUnitList.push({
          blockId: vm.lst[i].blockId,
          location: arr[index],
          unitName: vm.lst[i].unitName,
          unitId: vm.lst[i].unitId,
          deviceType: 1,
          communityId: vm.communityId,
          partitionId: vm.partitionId
        })
      }
      console.log(vm.unitList);
    } else {
      toastr.info('门口机列已达到上限');
    }
  }

  vm.deleteUnitMachine = deleteUnitMachine;
  function deleteUnitMachine(value, index) {
    console.log(value, index, vm.unitList);
    var obj = {};
    var objArray = [];
    for (var i = 0; i < vm.unitList.length; i++) {
      if (vm.unitList[i].location == value) {
        objArray.push(vm.unitList[i].id);
      }
    }
    obj.ids = objArray;
    console.log(obj);
    console.log(vm.locationArr);
    villageSrv.deleteMultiDeviceTask(obj).then(function (res) {
      if (res.success) {
        console.log(res);
        for (var j = 0; j < vm.locationArr.length; j++) {
          if (vm.locationArr[j] == value) {
            vm.locationArr.splice(j, 1);
          }
        }
      } else {
        toastr.info(res.message);
      }
    })
  }

  vm.save_appear = save_appear;
  function save_appear() {
    var obj = {};
    if (vm.wallMachineName) {
      vm.wallMachineList.push({
        location: vm.wallMachineName,
        deviceType: 0,
        communityId: vm.communityId,
        partitionId: vm.partitionId
      });
      vm.wallMachineName = "";
    }

    //save_taskMember();

    console.log(vm.wallMachineName);
    var unitMachineList = vm.newUnitList.concat(vm.wallMachineList);
    obj.list = unitMachineList;
    console.log(obj);
    villageSrv.createDeviceTask(obj).then(function (res) {
      if (res.success) {
        toastr.info('派发成功');
        $timeout(function () {
          cancel()
        }, 1000)
      } else {
        toastr.info(res.message);
      }
    })
  }
}

function roomCtl($scope, $rootScope, villageSrv, $modalInstance, items, toastr) {
  var vm = this;

  vm.model = items;

  // 树操作
  vm.try_adding_a_branch = try_adding_a_branch;
  vm.try_adding_some_branch = try_adding_some_branch;
  vm.try_update_a_branch = try_update_a_branch;
  vm.try_delete_a_branch = try_delete_a_branch;
  vm.try_get_some_roomNo = try_get_some_roomNo;

  vm.cancel = cancel;

  vm.check_add_branch_input = check_add_branch_input;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function check_add_branch_input() {
    if ($scope.dataAdd.length > 11) {
      $scope.dataAdd = $scope.dataAdd.substr(0, 10);
    }
  }

  function checkTextTemp(text) {
    if (text.length > 10) {
      return -1;
    }
  }

  function check_four_number(number){
    var numReg = /^\d{4}$/;
    if(numReg.test(number)){
      return 1;
    }else{
      return -1
    }
  }

  function try_adding_a_branch(model, end) {
    var b;
    var obj = {};
    if (checkTextTemp(model) == -1) {
      toastr.info('请输入10个字符之内')
    } else if(!model){
      toastr.info('内容不能为空')
    }
    else {
      b = tree.get_selected_branch();
      if (b.level == 1) {
        console.log('add level 2');
        obj.communityId = vm.model.communityId;
        obj.partitionName = model;
        console.log('level 2: ', obj);
        villageSrv.addPartition(obj).then(function (res) {
          console.log('添加分区成功: ', res);
          if (res.success) {
            return tree.add_branch(b, {
              label: model,
              level: 2,
              id: res.data.id
            });
          } else {
            toastr.info(res.message);
          }

        })
      } else if (b.level == 2) {
        var blockModel = model;
        obj.communityId = vm.model.communityId;
        obj.partitionId = b.id;
        obj.blockName = blockModel + '幢';
        console.log('level 3: ', obj);
        console.log(blockModel, parseInt(model), parseInt(end));

        if (end) {
          if (parseInt(model) == parseInt(end) + 1) return;
          villageSrv.addBlock(obj).then(function (res) {
            console.log('添加楼幢成功: ', res);
            if (res.success) {
              return tree.add_branch(b, {
                label: obj.blockName,
                level: 3,
                id: res.data.id
              });
            } else {
              toastr.info(res.message);
            }
          }).then(function () {
            try_adding_a_branch(parseInt(blockModel) + 1, parseInt(end));
          })
        } else {
          villageSrv.addBlock(obj).then(function (res) {
            console.log('添加楼幢成功: ', res);
            if (res.success) {
              return tree.add_branch(b, {
                label: obj.blockName,
                level: 3,
                id: res.data.id
              });
            } else {
              toastr.info(res.message);
            }
          })
        }
      } else if (b.level == 3) {
        console.log('add level 4');
        obj.unitName = model + '单元';
        obj.blockId = b.id;
        obj.blockName = b.label;
        console.log('level 4: ', obj);
        villageSrv.addUnit(obj).then(function (res) {
          console.log('添加单元成功: ', res);
          if (res.success) {
            return tree.add_branch(b, {
              label: obj.unitName,
              level: 4,
              id: res.data.id
            });
          } else {
            toastr.info(res.message);
          }
        })
      } else if (b.level == 4) {
        console.log('add level 5');
        if(check_four_number(model) != -1){
          obj.communityId = vm.model.communityId;
          obj.unitId = b.id;
          obj.code = addPreZero(model);
          console.log(obj.code);
          villageSrv.addRoomNo(obj).then(function (res) {
            console.log('添加房号成功: ', res);
            if (res.success) {
              return tree.add_branch(b, {
                label: obj.code,
                id: res.data.id,
                level: 5
              });
            } else {
              toastr.info(res.message);
            }
          })
        }else{
          toastr.info('房号应为4位数字');
        }

      }
    }
  };

  function addPreZero(num) {
    var t = (num + '').length,
      s = '';

    for (var i = 0; i < 4 - t; i++) {
      s += '0';
    }

    return s + num;
  }

  function try_adding_some_branch(start, end) {
    for (var i = start; i <= end; i++) {
      vm.try_adding_a_branch(i, end);
    }
  };

  function try_update_a_branch(model) {
    var b;
    var obj = {};
    b = tree.get_selected_branch();
    console.log(b);

    if (b.level == 2) {
      obj.partitionId = b.id;
      obj.partitionName = model;
      villageSrv.editPartition(obj).then(function (res) {
        console.log(res);
        b.label = model;
      })
    } else if (b.level == 3) {
      obj.communityId = vm.model.communityId;
      obj.blockId = b.id;
      obj.blockName = model;
      villageSrv.editBlock(obj).then(function (res) {
        console.log(res);
        b.label = model;
      })
    } else if (b.level == 4) {
      console.log('4');
      var p = tree.get_parent_branch(b);
      obj.unitId = b.id;
      obj.unitName = model;
      obj.blockId = p.id;
      obj.blockName = p.label;
      console.log(obj);
      villageSrv.editUnit(obj).then(function (res) {
        console.log(res);
        b.label = model;
      })
    }
  };

  function try_delete_a_branch() {
    var b, p;
    var obj = {};
    b = tree.get_selected_branch();
    p = tree.get_parent_branch(b);
    console.log('删除本条: ', b.id);
    if (b.level == 2) {
      obj.partitionId = b.id;
      if (b.children.length) {
        toastr.info('分区下有楼幢, 不能删除');
      } else {
        villageSrv.deletePartition(obj).then(function (res) {
          console.log(res);
          if (res.success) {
            removeObjWithArr(p.children, b);
          } else {
            toastr.info(res.message);
          }
        })
      }
    } else if (b.level == 3) {
      obj.blockId = b.id;
      if (b.children.length) {
        toastr.info('楼幢下有单元, 不能删除');
      } else {
        villageSrv.deleteBlock(obj).then(function (res) {
          console.log(res);
          if (res.success) {
            removeObjWithArr(p.children, b);
          } else {
            toastr.info(res.message);
          }
        })
      }
    }
    else if (b.level == 4) {
      obj.unitId = b.id;
      if (b.children.length) {
        toastr.info('单元下有房间, 不能删除');
      } else {
        villageSrv.deleteUnit(obj).then(function (res) {
          console.log(res);
          if (res.success) {
            removeObjWithArr(p.children, b);
          } else {
            toastr.info(res.message);
          }
        })
      }
    } else if (b.level == 5) {
      obj.roomNoId = b.id;
      villageSrv.deleteRoomNo(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          removeObjWithArr(p.children, b);
        } else {
          toastr.info(res.message);
        }
      })
    }
  };

  function try_get_some_roomNo(obj) {
    var b;
    b = tree.get_selected_branch();
    if (!b || b.level != 4) {
      alert("请选择单元");
    } else {
      obj.unitId = b.id;
      obj.communityId = vm.model.communityId;
      console.log(obj);
      villageSrv.addRoomNoMulti(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          getRoomNo(b, obj.unitId);
          toastr.info('房号添加成功');
        } else {
          toastr.info('房号添加失败');
        }
      })
    }
  }

  function removeObjWithArr(_arr, _obj) {
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
      if (_arr[i] == _obj) {
        if (i == 0) {
          _arr.shift(); //删除并返回数组的第一个元素
          return;
        } else if (i == length - 1) {
          _arr.pop();  //删除并返回数组的最后一个元素
          return;
        }
        else {
          _arr.splice(i, 1); //删除下标为i的元素
          return;
        }
      }
    }
  };

  $scope.my_tree = tree = {};

  $scope.my_data = [
    {
      label: vm.model.communityName,
      children: []
    }
  ];

  vm.getPartition = getPartition;
  vm.getData = getData;

  getPartition(vm.model.communityId);

  function getPartition(id) {
    villageSrv.getPartition(id).then(function (res) {
      console.log(res);
      var arr = [];
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          console.log(res.data[i].hasNext)
          arr.push({
            id: res.data[i].communityPartitionId,
            label: res.data[i].communityPartitionName,
            hasChild: res.data[i].hasNext,
            level: 2
          })
        }
        $scope.my_data[0].children = arr;
        console.log($scope.my_data);
      }
    })
  }

  vm.treeAddToggle = false;
  vm.roomMultiAdd = false;
  vm.twoInputToggle = false;
  function getData(b) {
    console.log(b);
    console.log(b.iconExpand)
    $scope.dataDelete = b.label;
    vm.treeAddToggle = true;
    switch (b.level) {
      case 1:
        $scope.dataAdd = "";
        vm.roomMultiAdd = false;
        vm.twoInputToggle = false;
        vm.placeholder = '输入分区: 分区一';
        break;
      case 2:
        $scope.dataAdd = "";
        vm.roomMultiAdd = false;
        vm.twoInputToggle = true;
        vm.placeholder = '输入楼幢号: 1';
        break;
      case 3:
        $scope.dataAdd = "";
        vm.roomMultiAdd = false;
        vm.twoInputToggle = false;
        vm.placeholder = '输入单元号: 1';
        break;
      case 4:
        $scope.dataAdd = "";
        vm.roomMultiAdd = true;
        vm.twoInputToggle = false;
        vm.placeholder = '输入房号: 0101';
        break;
      case 5:
        $scope.dataAdd = "";
        vm.roomMultiAdd = false;
        vm.twoInputToggle = false;
        vm.treeAddToggle = false;
        break;
      default:
        vm.placeholder = '';
    }
    if (!b.children.length) {
      if (b.level == 2) {
        getBlock(b, b.id);
      } else if (b.level == 3) {
        console.log('getData level 3:');
        getUnit(b, b.id);
      } else if (b.level == 4) {
        console.log('getData level 4:');
        getRoomNo(b, b.id);
      }
    }
  }

  function getBlock(branch, partitionId) {
    var arr = [];
    villageSrv.getBlock(partitionId).then(function (res) {
      console.log('获取楼幢: ', res);
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          arr.push({
            id: res.data[i].communityBlockId,
            label: res.data[i].communityBlockName,
            hasChild: res.data[i].hasNext,
            level: 3
          })
        }
        branch.children = arr;
        console.log($scope.my_data);
      }
    })
  }

  function getUnit(branch, blockId) {
    console.log('getUnit: ', branch);
    var arr = [];
    villageSrv.getUnit(blockId).then(function (res) {
      console.log('获取单元: ', res);
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          arr.push({
            id: res.data[i].unitId,
            label: res.data[i].unitName,
            hasChild: res.data[i].hasNext,
            level: 4
          })
        }
        branch.children = arr;
        console.log($scope.my_data);
      }
    })
  }

  function getRoomNo(branch, unitId) {
    console.log(unitId);
    var arr = [];
    villageSrv.getRoomNo(unitId).then(function (res) {
      console.log('获取房号: ', res);
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          arr.push({
            id: res.data[i].roomNoId,
            label: addPreZero(res.data[i].code),
            hasChild: res.data[i].hasNext,
            level: 5
          })
        }
        branch.children = arr;
        console.log($scope.my_data);
      }
    })
  }
}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('deviceApi', [])
  .factory('deviceSrv', deviceSrv);

deviceSrv.$inject = ['$q', '$http', 'httpSrv'];
function deviceSrv($q, $http, httpSrv) {
  var server = httpSrv.getHttpRoot();
  var deviceList = {
    getDevice: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/list/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },
    unbindDevice: function(sn){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/'+sn+'/unbind',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    }
  }
  return deviceList;
}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('doorApi', [])
  .factory('doorSrv', doorSrv);

doorSrv.$inject = ['$q', '$http', 'httpSrv'];
function doorSrv($q, $http, httpSrv) {
  var server = httpSrv.getHttpRoot();

  var doorList = {
    getResident: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/resident/list/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },
    getPublicCard: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/public/card/list/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },
    getPublicCardDetail: function(id, communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/public/card/'+id+'/detail/'+communityId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    }
  }

  return doorList;

}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('homeApi', [])
  .factory('homeSrv', homeSrv);

homeSrv.$inject = ['$q', '$http', 'httpSrv'];
function homeSrv($q, $http, httpSrv) {

  var server = httpSrv.getHttpRoot();

  var homeList = {
    getAreaDevice: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/area/device',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getAreaPartitionDevice: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/area/partition/device/list',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
  }

  return homeList;

}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('httpApi', [])
  .factory('httpSrv', httpSrv);

httpSrv.$inject = ['$q', '$http'];
function httpSrv() {
  //var server = "http://114.55.143.170:8085";
   var server = "http://192.168.23.241:8085";
  // var server = "http://116.62.39.38:8085";
  var list = {
    getHttpRoot: function(){
      return server;
    }
  };
  return list;
}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('logApi', [])
  .factory('logSrv', logSrv);

logSrv.$inject = ['$q', '$http', 'httpSrv'];
function logSrv($q, $http, httpSrv) {
  var server = httpSrv.getHttpRoot();
  var logList = {
    getUnlock: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/log/unlock/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },
    getAlarm: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/alarm/log/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    }
  };
  return logList;
}
/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('mainApi', [])
  .factory('mainSrv', mainSrv)

mainSrv.$inject = ['$q', '$http', 'httpSrv'];
function mainSrv($q, $http, httpSrv){
  var server = httpSrv.getHttpRoot();

  var mainList = {

    login: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/account/login',
        data: obj
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    logout: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/account/logout',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    logup: function(obj){
      var defer = $q.defer();
      console.log(obj);
      $http({
        method: 'POST',
        url: server + '/account/password/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    getAddress: function (){
      var defer = $q.defer();
      $http.get("../../data/data.json")
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getCommunity: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/query',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },

    getPartitions: function(communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/partition/list/'+communityId,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getBlocks: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/block/list/'+partitionId,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getUnits: function(blockId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/unit/list/'+blockId,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },
    getRoomNo: function(unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/unit/roomNo/list/'+unitId,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    // pagesNum , pagesSplit , pages, pageNo
    pagination: function(pagesNum, pagesSplit, pages, pageNo){

      if(pagesNum<=7){
        for(var i=0;i<pagesNum;i++){
          pages[i] = {text: i+1, active: false};
        }
        if(pages.length){
          pages[pageNo-1].active = true;
        }
      }else{
        //页码小于5的情况
        if(pageNo<5){
          for(var i=0;i<pagesSplit;i++){
            pages[i] = {text: i+1, active: false};
          }
          pages[pageNo-1].active = true;
        }
        //页码大于5 小于(全部页码-3)的情况
        else if(pageNo>=5&&pageNo<pagesNum-3){
          for(var i=pageNo-4, j=0;i<pageNo+3, j<7;i++, j++){
            pages[j] = {text: i+1, active: false};
          }
          pages[3].active = true; // 当大于5条信息时, 它的位置总是第4个
        }
        //最后三个页码
        else if(pageNo>=pagesNum-3){
          for(var i=pagesNum-7, j=0;i<pagesNum, j<7;i++, j++){
            pages[j] = {text: i+1, active: false};
          }
          pages[6-(pagesNum-pageNo)].active = true; // 最后3条信息的位置是: 7-(总共页码-当前页码)-1
        }
      }
    },

    getSearch: function(newobj, cb){
      var obj = newobj;
      for(var a in obj){
        if(obj[a]==""||!obj[a]||obj[a]=='undefined'){
          delete obj[a]
        }
      }
      var str = JSON.stringify(newobj);
      sessionStorage.filterList = str;
      cb(1, obj);
    }
  };

  return mainList;
}

/**
 * Created by zhongyuqiang on 2017/8/14.
 */
angular.module('villageApi', [])
  .factory('villageSrv', villageSrv);

villageSrv.$inject = ['$q', '$http', 'httpSrv'];
function villageSrv($q, $http, httpSrv){
  var server = httpSrv.getHttpRoot();

  var villageList = {
    getCommunity: function(pageNo, limit, obj){
      console.log(localStorage.wekerAreaToken);
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/query/list/'+pageNo+'/'+limit,
        params: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.log(error);
          defer.reject(error);
        });
      return defer.promise;
    },
    createCommunity: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/add',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editCommunity: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getPartition: function(id){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/partition/list/'+id,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    addPartition: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/partition/add',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editPartition: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/partition/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deletePartition: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/partition/delete',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getBlock: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/block/list/'+partitionId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    addBlock: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/block/add',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editBlock: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/block/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteBlock: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/block/delete',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    addUnit: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/add',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editUnit: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteUnit: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/delete',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getUnit: function(blockId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/unit/list/'+blockId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getRoomNo: function(unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/unit/roomNo/list/'+unitId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    addRoomNo: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/roomNo/add',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    addRoomNoMulti: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/roomNo/add/list',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editRoomNo: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + 'community/unit/roomNo/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteRoomNo: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/unit/roomNo/delete',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getArea: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/area/partition/list',
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getDeviceLocation: function(communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/location/partition/'+ communityId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    createTaskMember: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/task/distribution',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteTaskSend: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/task/distribution/delete',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getTask: function(communityId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/location/task/distribution/query/'+communityId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getDeviceTask: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/location/list/'+partitionId,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    createDeviceTask: function(obj){
      console.log(obj);
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/add',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + ' /device/location/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/delete',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteMultiDeviceTask: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/location/delete/list',
        data: obj,
        headers: {
          'token': localStorage.wekerAreaToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    }

  };
  return villageList;
}