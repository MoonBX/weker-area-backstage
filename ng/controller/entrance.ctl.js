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
      backdrop: 'static',
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
      vm.block.communities = res.data;
    })
  }
  vm.getPartitions = getPartitions;
  function getPartitions(communityId){
    mainSrv.getPartitions(communityId).then(function(res){
      vm.block.partitions = res.data;
    })
  }

  vm.getBlocks = getBlocks;
  function getBlocks(partitionId){
    mainSrv.getBlocks(partitionId).then(function(res){
      vm.block.blocks = res.data;
    })
  }

  vm.getUnits = getUnits;
  function getUnits(blockId){
    mainSrv.getUnits(blockId).then(function(res){
      vm.block.units = res.data;
    })
  }
  vm.getRooms = getRooms;
  function getRooms(unitId){
    mainSrv.getRoomNo(unitId).then(function(res){
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
    vm.block.partitions = {};
    vm.block.blocks = {};
    vm.block.units = {};
    vm.block.rooms = {};
    //getResident(1);
    //$location.search('id', 1);
  }



  function getSearch(obj, cb) {
    if(obj.status == 0||obj.status == 1){
      obj.effectiveType = null;
    }
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
    if(obj){
      obj.areaId = localStorage.wekerAreaId;
    }else{
      obj = {areaId: localStorage.wekerAreaId};
    }
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
      backdrop: 'static',
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
      getPublicCard(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    //getPublicCard(1);
    //$location.search('id', 1);
  }

  function getSearch(obj, cb) {
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
    if(obj){
      obj.areaId = localStorage.wekerAreaId;
    }else{
      obj = {areaId: localStorage.wekerAreaId};
    }
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
      }
    })
  }

}

function hDetailCtl(items, $modalInstance){
  var vm = this;
  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
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
    return arrTemp;
  }

  if (items) {
    if(items.cardTypeName){
      var a = items.cardTypeName.split(' ');
      a.pop();
      items.cardTypeNameArr = listTemp(a);
    }
    vm.model = items;
  }
}

function cDetailCtl(items, $modalInstance, doorSrv){
  var vm = this;
  vm.cancel = cancel;

  vm.getCommonDetail = getCommonDetail;

  vm.id = items.id;
  vm.communityId = items.communityId;

  vm.detailList = {};

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  getCommonDetail(vm.id, vm.communityId);

  function getCommonDetail(id, communityId) {
    doorSrv.getPublicCardDetail(id, communityId).then(function (res) {
      vm.detailList = res.data;
    })
  }

}