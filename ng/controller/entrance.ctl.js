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

function householdCtl($modal,$location,$state, doorSrv,mainSrv){
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
    doorSrv.getResident(pageNo, 7, obj).then(function(res){
      console.log(res);
      vm.pages = [];

      if(res.success){
        for(var i=0; i<res.data.list.length; i++){
          switch (res.data.list[i].userType) {
            case 0:
              res.data.list[i].userType_cn = '业主';
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
        vm.pagesNum = Math.ceil(res.data.total / 7);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 7;

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

function commonCtl($modal,$location,$state, doorSrv,mainSrv){
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
    doorSrv.getPublicCard(pageNo, 7, obj).then(function(res){
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
        vm.pagesNum = Math.ceil(res.data.total / 7);
        vm.pagesTotal = res.data.total;
        var pagesSplit = 7;

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