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