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