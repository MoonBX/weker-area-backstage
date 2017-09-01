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