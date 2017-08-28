/**
 * Created by zhongyuqiang on 2017/7/25.
 */
angular.module('villageMdl', [])
  .controller('villageCtl', villageCtl)
  .controller('createCtl', createCtl)
  .controller('appearCtl', appearCtl)
  .controller('roomCtl', roomCtl);

function villageCtl($modal, $rootScope, $location, $state, villageSrv, mainSrv) {
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
      vm.arrayList = res.data;
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
    villageSrv.getCommunity(pageNo, 7, obj).then(function (res) {
      console.log('获取小区列表: ', res);
      vm.pages = [];
      vm.communityList = res.data.list;
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
    })
  }

  $rootScope.$on('refresh-village', function ($event) {
    getCommunity(1);
  })
}

function createCtl($rootScope, $scope, villageSrv, $modalInstance, items) {
  var vm = this;

  vm.getArea = getArea;
  vm.arrayList = [];
  vm.model = {};


  if (items) {
    console.log(items);
    vm.model = items;
    vm.createVillage = updateVillage;
  } else {
    vm.model.password = '123456';
    vm.createVillage = createVillage;
  }


  getArea();

  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function getArea() {
    villageSrv.getArea().then(function (res) {
      console.log(res);
      vm.arrayList = res.data;
    })
  }

  function createVillage(obj) {
    if ($scope.createVillageForm.$valid) {
      console.log(obj);
      villageSrv.createCommunity(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          $rootScope.$broadcast('refresh-village');
          cancel();
        } else {
          alert(res.message);
        }
      })
    } else {
      $scope.createVillageForm.submitted = true;
      console.log('表单未通过')
    }
  }

  function updateVillage(obj) {
    if ($scope.createVillageForm.$valid) {
      console.log(obj);
      villageSrv.editCommunity(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          $rootScope.$broadcast('refresh-village');
          cancel();
        } else {
          alert(res.message);
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

  vm.checkAllToggle = false
  vm.selectAll = selectAll;
  function selectAll() {
    vm.checkAllToggle = !vm.checkAllToggle;
    if(vm.checkAllToggle){
      for (var i = 0; i < vm.unitListGroup.length; i++) {
        vm.unitListGroup[i].select = true;
      }
    }else{
      for (var i = 0; i < vm.unitListGroup.length; i++) {
        vm.unitListGroup[i].select = false;
      }
    }
  }

  vm.selectCurrent = selectCurrent;
  function selectCurrent(obj) {
    obj.select = true;
  }

  vm.try_adding_unit = try_adding_unit;
  function try_adding_unit(location) {
    var obj = {};
    var objArr = [];
    for (var i = 0; i < vm.unitListGroup.length; i++) {
      if (vm.unitListGroup[i].select == true) {
        var locationIsExist = findArray(vm.unitListGroup[i].data, {location: location});
        if(locationIsExist == -1){
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
    if(obj.list.length){
      villageSrv.createDeviceTask(obj).then(function (res) {
        if (res.success) {
          getDeviceTask(vm.partitionId, vm.taskIndex);
          toastr.info('单元机派发成功');
        } else {
          toastr.info(res.message);
        }
      })
    }else{
      toastr.info('无可添加的单元机')
    }

  }

  vm.try_delete_unit = try_delete_unit;
  function try_delete_unit(location){
    var obj = {};
    var objArr = [];
    for (var i = 0; i < vm.unitListGroup.length; i++) {
      if (vm.unitListGroup[i].select == true) {
        var locationIsExist = findArray(vm.unitListGroup[i].data, {location: location});
        if(locationIsExist != -1){
          objArr.push(vm.unitListGroup[i].data[locationIsExist].id);
        }
      }
    }
    console.log(objArr);
    obj.ids = objArr;
    if(obj.ids.length){
      console.log(obj);
      villageSrv.deleteMultiDeviceTask(obj).then(function (res) {
        if (res.success) {
          toastr.info('删除成功');
          getDeviceTask(vm.partitionId, vm.taskIndex);
        } else {
          toastr.info(res.message);
        }
      })
    }else{
      toastr.info('无可删除的单元机')
    }

  }

  function findArray(array, feature) {
    var all = true;
    for(var index in array){
      var cur = array[index];
      if(feature instanceof Object){
        var allRight = true;
        for(var key in feature){
          var value = feature[key];
          if(cur[key] == value && !all) return index;
          if(all && cur[key] != value){
            allRight = false;
            break;
          }
        }
        if(allRight) return index;
      }else{
        if(cur == feature){
          return index;
        }
      }
    }
    return -1;
  }

  //增加围墙机
  vm.addWallMachine = addWallMachine;
  function addWallMachine() {
    console.log(vm.wallMachineName);
    var objArr = {};
    objArr.list = [];
    if(vm.wallMachineName){
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
    //vm.wallMachineList.push({
    //  location: vm.wallMachineName,
    //  deviceType: 0,
    //  communityId: vm.communityId,
    //  partitionId: vm.partitionId
    //});
    //vm.wallMachineName = '';
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
    }else {
      console.log('请填写正确的手机号码');
    }
  }

  function checktelephone(cellPhone) {
    var RegCellPhone = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3578]\d{9})$)/;
    var flag = cellPhone.search(RegCellPhone);
    return flag;
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
    //console.log(vm.locationArr);
    //console.log(vm.wallMachineList);
    //console.log(vm.unitList);
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

    save_taskMember();

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

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function try_adding_a_branch(model, end) {
    var b;
    var obj = {};
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

      if(end){
        if(parseInt(model) == parseInt(end)+1) return;
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
        }).then(function(){
          try_adding_a_branch(parseInt(blockModel) + 1, parseInt(end));
        })
      }else{
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
      obj.communityId = vm.model.communityId;
      obj.unitId = b.id;
      obj.code = addPreZero(model);
      console.log(obj.code);
      villageSrv.addRoomNo(obj).then(function (res) {
        console.log('添加房号成功: ', res);
        if (res.success) {
          return tree.add_branch(b, {
            label: obj.code,
            level: 5
          });
        } else {
          toastr.info(res.message);
        }
      })
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
          arr.push({
            id: res.data[i].communityPartitionId,
            label: res.data[i].communityPartitionName,
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
      console.log('b.level: ', b.level);
      if (b.level == 2) {
        //getBlock(b, b.id);
        var arr = [];
        villageSrv.getBlock(b.id).then(function (res) {
          console.log('获取楼幢: ', res);
          if (res.data) {
            for (var i = 0; i < res.data.length; i++) {
              arr.push({
                id: res.data[i].communityBlockId,
                label: res.data[i].communityBlockName,
                level: 3,
                children: []
              });
            }
          }
        }).then(function(){
          for (var j = 0; j < arr.length; j++) {
            (function(j){
              villageSrv.getUnit(arr[j].id).then(function(res){
                if(res.data.length){
                  for(var k=0;k<res.data.length;k++){
                    arr[j].children.push({
                      id: res.data[k].unitId,
                      label: res.data[k].unitName,
                      level: 4
                    });
                  }
                }
              })
            }(j))
          }
          b.children = arr;
          console.log($scope.my_data);
        })
      } else if (b.level == 3) {
        console.log('getData level 3:');
        //getUnit(b, b.id);
        console.log(b);
        var arr = b.children;
        for (var j = 0; j < arr.length; j++) {
          (function(j){
            console.log(arr[j]);
            villageSrv.getRoomNo(arr[j].id).then(function(res){
              console.log(res);
              if(res.data.length){
                console.log(arr[j]);
                for(var k=0;k<res.data.length;k++){
                  arr[j].children.push({
                    id: res.data[k].roomNoId,
                    label: addPreZero(res.data[k].code),
                    level: 5
                  });
                }
              }
            })
          }(j))
        }
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
            level: 5
          })
        }
        branch.children = arr;
        console.log($scope.my_data);
      }
    })
  }
}