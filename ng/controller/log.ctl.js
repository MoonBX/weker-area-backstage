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

function openCtl($modal, $location,$state, logSrv, mainSrv){
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
      }


    })
  }
}

function removeCtl($location,$state, logSrv,mainSrv){
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