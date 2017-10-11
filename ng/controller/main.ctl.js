/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('mainMdl', [])
  .controller('mainCtl', mainCtl);

function mainCtl($scope, $rootScope, $location, $state, $timeout, $modal, cfpLoadingBar, mainSrv, toastr){
  var mainVm = this;

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
        //toastr.info('请先登录')
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
    mainSrv.login(obj).then(function(data){
      if(data.success){
        cfpLoadingBar.start();
        localStorage.wekerAreaToken = data.data.token;
        localStorage.wekerAreaname = data.data.areaName;
        localStorage.wekerAreaId = data.data.areaId;
        mainVm.wekerUsername = localStorage.wekerAreaname;
        $timeout(function(){
          window.location.href = '/#/index';
          cfpLoadingBar.complete();
        }, 1000);
        mainVm.isLoginError = false;
      }else{
        mainVm.isLoginError = true;
      }

    })
  }

  function logout(){
    mainSrv.logout().then(function(data){
      localStorage.removeItem('wekerAreaToken');
      localStorage.removeItem('wekerUsername');
      localStorage.removeItem('wekerAreaId');
      window.location.href = '/#/login';
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
      })
    }else{
      $scope.updateForm.submitted = true;
    }
  }

  function switchNavItem(index){
    mainVm.currentNav = mainVm.asideArr[index];
    for(var i=0;i<mainVm.asideArr.length;i++){
      if(index == i){
        mainVm.currentNav.isActive = !mainVm.currentNav.isActive;
      }else{
        mainVm.asideArr[i].isActive = false;
      }
    }
    if(sessionStorage.filterList){
      sessionStorage.removeItem('filterList');
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
    //toastr.info('登录信息失效, 请重新登录');
  });

  function openModal(template, controller){
    $modal.open({
      templateUrl: './views' + template + '.html',
      controller: controller,
      size: 'sm'
    })
  }
}