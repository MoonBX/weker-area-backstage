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
  //'ivh.treeview',
  'angularBootstrapNavTree',
  //'ksSwiper',
  'toastr',
  'angularFileUpload',
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
(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('angularBootstrapNavTree', []);

  module.directive('abnTree', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template:
        "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">" +
        "<li ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\"" +
        "ng-animate=\"'abn-tree-animate'\" " +
        "ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'') + ' ' +row.classes.join(' ')\" " +
        "class=\"abn-tree-row\">" +
        "<div ng-click=\"user_clicks_branch(row.branch)\">" +
        "<i ng-class=\"row.tree_icon\" " +
        "ng-click=\"row.branch.expanded = !row.branch.expanded\" " +
        "class=\"indented tree-icon\"> " +
        "</i>" +
        "<input type='checkbox' ng-model='apple' ng-change='user_check(row.branch)' checked>" +
        "<span class=\"indented tree-label\">{{ row.label }} </span>" +
        "</div>" +
        "</li>" +
        "</ul>",
        replace: true,
        scope: {
          treeData: '=',
          onSelect: '&',
          initialSelection: '@',
          treeControl: '='
        },
        link: function(scope, element, attrs) {
          var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;
          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };
          if (attrs.iconExpand == null) {
            attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
          }
          if (attrs.iconCollapse == null) {
            attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
          }
          if (attrs.iconLeaf == null) {
            attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
          }
          if (attrs.expandLevel == null) {
            attrs.expandLevel = '3';
          }
          expand_level = parseInt(attrs.expandLevel, 10);
          if (!scope.treeData) {
            alert('no treeData defined for the tree!');
            return;
          }
          if (scope.treeData.length == null) {
            if (treeData.label != null) {
              scope.treeData = [treeData];
            } else {
              alert('treeData should be an array of root branches');
              return;
            }
          }
          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch, level) {
              var child, _i, _len, _ref, _results;
              f(branch, level);
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(do_f(child, level + 1));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));
            }
            return _results;
          };
          selected_branch = null;
          select_branch = function(branch) {
            if (!branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }
            if (branch !== selected_branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          scope.user_clicks_branch = function(branch) {
            if (branch !== selected_branch) {
              return select_branch(branch);
            }
          };
          scope.user_check = function(branch){
            console.log(this.row.branch);
            console.log(element);
            console.log(branch);
          };
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };
          scope.tree_rows = [];
          on_treeData_change = function() {
            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
            for_each_branch(function(b, level) {
              if (!b.uid) {
                return b.uid = "" + Math.random();
              }
            });
            for_each_branch(function(b) {
              var child, _i, _len, _ref, _results;
              if (angular.isArray(b.children)) {
                _ref = b.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(child.parent_uid = b.uid);
                }
                return _results;
              }
            });
            scope.tree_rows = [];
            for_each_branch(function(branch) {
              var child, f;
              if (branch.children) {
                if (branch.children.length > 0) {
                  f = function(e) {
                    if (typeof e === 'string') {
                      return {
                        label: e,
                        children: []
                      };
                    } else {
                      return e;
                    }
                  };
                  return branch.children = (function() {
                    var _i, _len, _ref, _results;
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      child = _ref[_i];
                      _results.push(f(child));
                    }
                    return _results;
                  })();
                }
              } else {
                return branch.children = [];
              }
            });
            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }
              if (branch.classes == null) {
                branch.classes = [];
              }
              if (!branch.noLeaf && (!branch.children || branch.children.length === 0)) {
                tree_icon = attrs.iconLeaf;
                if (__indexOf.call(branch.classes, "leaf") < 0) {
                  branch.classes.push("leaf");
                }
              } else {
                if (branch.expanded) {
                  tree_icon = attrs.iconCollapse;
                } else {
                  tree_icon = attrs.iconExpand;
                }
              }
              scope.tree_rows.push({
                level: level,
                branch: branch,
                label: branch.label,
                classes: branch.classes,
                tree_icon: tree_icon,
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            return _results;
          };
          scope.$watch('treeData', on_treeData_change, true);
          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {
              tree = scope.treeControl;
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;

                });
              };
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              tree.get_children = function(b) {
                return b.children;
              };
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };

              return tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };
            }
          }
        }
      };
    }
  ]);

}).call(this);

'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
  var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
  $provide.value("$locale", {
    "DATETIME_FORMATS": {
      "AMPMS": [
        "\u4e0a\u5348",
        "\u4e0b\u5348"
      ],
      "DAY": [
        "\u661f\u671f\u65e5",
        "\u661f\u671f\u4e00",
        "\u661f\u671f\u4e8c",
        "\u661f\u671f\u4e09",
        "\u661f\u671f\u56db",
        "\u661f\u671f\u4e94",
        "\u661f\u671f\u516d"
      ],
      "ERANAMES": [
        "\u516c\u5143\u524d",
        "\u516c\u5143"
      ],
      "ERAS": [
        "\u516c\u5143\u524d",
        "\u516c\u5143"
      ],
      "FIRSTDAYOFWEEK": 6,
      "MONTH": [
        "\u4e00\u6708",
        "\u4e8c\u6708",
        "\u4e09\u6708",
        "\u56db\u6708",
        "\u4e94\u6708",
        "\u516d\u6708",
        "\u4e03\u6708",
        "\u516b\u6708",
        "\u4e5d\u6708",
        "\u5341\u6708",
        "\u5341\u4e00\u6708",
        "\u5341\u4e8c\u6708"
      ],
      "SHORTDAY": [
        "\u5468\u65e5",
        "\u5468\u4e00",
        "\u5468\u4e8c",
        "\u5468\u4e09",
        "\u5468\u56db",
        "\u5468\u4e94",
        "\u5468\u516d"
      ],
      "SHORTMONTH": [
        "1\u6708",
        "2\u6708",
        "3\u6708",
        "4\u6708",
        "5\u6708",
        "6\u6708",
        "7\u6708",
        "8\u6708",
        "9\u6708",
        "10\u6708",
        "11\u6708",
        "12\u6708"
      ],
      "WEEKENDRANGE": [
        5,
        6
      ],
      "fullDate": "y\u5e74M\u6708d\u65e5EEEE",
      "longDate": "y\u5e74M\u6708d\u65e5",
      "medium": "y\u5e74M\u6708d\u65e5 ah:mm:ss",
      "mediumDate": "y\u5e74M\u6708d\u65e5",
      "mediumTime": "ah:mm:ss",
      "short": "yy/M/d ah:mm",
      "shortDate": "yy/M/d",
      "shortTime": "ah:mm"
    },
    "NUMBER_FORMATS": {
      "CURRENCY_SYM": "\u00a5",
      "DECIMAL_SEP": ".",
      "GROUP_SEP": ",",
      "PATTERNS": [
        {
          "gSize": 3,
          "lgSize": 3,
          "maxFrac": 3,
          "minFrac": 0,
          "minInt": 1,
          "negPre": "-",
          "negSuf": "",
          "posPre": "",
          "posSuf": ""
        },
        {
          "gSize": 3,
          "lgSize": 3,
          "maxFrac": 2,
          "minFrac": 2,
          "minInt": 1,
          "negPre": "\u00a4\u00a0-",
          "negSuf": "",
          "posPre": "\u00a4\u00a0",
          "posSuf": ""
        }
      ]
    },
    "id": "zh-cn",
    "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
  });
}]);
!function(e,i,r){"use strict";function t(){for(var e=[],i="0123456789abcdef",r=0;36>r;r++)e[r]=i.substr(Math.floor(16*Math.random()),1);e[14]="4",e[19]=i.substr(3&e[19]|8,1),e[8]=e[13]=e[18]=e[23]="-";var t=e.join("");return t}function a(){return{restrict:"E",transclude:!0,scope:{onReady:"&",slidesPerView:"=",slidesPerColumn:"=",spaceBetween:"=",parallax:"=",parallaxTransition:"@",paginationIsActive:"=",paginationClickable:"=",showNavButtons:"=",showScrollBar:"=",loop:"=",autoplay:"=",initialSlide:"=",containerCls:"@",wrapperCls:"@",paginationCls:"@",slideCls:"@",direction:"@",swiper:"=",overrideParameters:"="},controller:["$scope","$element","$timeout",function(e,r,a){var n=t();e.swiper_uuid=n;var s={slidesPerView:e.slidesPerView||1,slidesPerColumn:e.slidesPerColumn||1,spaceBetween:e.spaceBetween||0,direction:e.direction||"horizontal",loop:e.loop||!1,initialSlide:e.initialSlide||0,showNavButtons:!1};i.isUndefined(e.autoplay)||"number"!=typeof e.autoplay||(s=i.extend({},s,{autoplay:e.autoplay})),e.paginationIsActive===!0&&(s=i.extend({},s,{paginationClickable:e.paginationClickable||!0,pagination:"#paginator-"+e.swiper_uuid})),e.showNavButtons===!0&&(s.nextButton="#nextButton-"+e.swiper_uuid,s.prevButton="#prevButton-"+e.swiper_uuid),e.showScrollBar===!0&&(s.scrollbar="#scrollBar-"+e.swiper_uuid),e.overrideParameters&&(s=i.extend({},s,e.overrideParameters)),a(function(){var t=null;i.isObject(e.swiper)?(e.swiper=new Swiper(r[0].firstChild,s),t=e.swiper):t=new Swiper(r[0].firstChild,s),i.isUndefined(e.onReady)||e.onReady({swiper:t})})}],link:function(e,r){var t=e.swiper_uuid,a="paginator-"+t,n="prevButton-"+t,s="nextButton-"+t,l="scrollBar-"+t,o=r[0];i.element(o.querySelector(".swiper-pagination")).attr("id",a),i.element(o.querySelector(".swiper-button-next")).attr("id",s),i.element(o.querySelector(".swiper-button-prev")).attr("id",n),i.element(r[0].querySelector(".swiper-scrollbar")).attr("id",l)},template:'<div class="swiper-container {{containerCls}}"><div class="parallax-bg" data-swiper-parallax="{{parallaxTransition}}" ng-show="parallax"></div><div class="swiper-wrapper {{wrapperCls}}" ng-transclude></div><div class="swiper-pagination {{paginationCls}}"></div><div class="swiper-button-next" ng-show="showNavButtons"></div><div class="swiper-button-prev" ng-show="showNavButtons"></div><div class="swiper-scrollbar" ng-show="showScrollBar"></div></div>'}}function n(){return{restrict:"E",require:"^ksSwiperContainer",transclude:!0,scope:{sliderCls:"@"},template:'<div class="swiper-slide {{sliderCls}}" ng-transclude></div>',replace:!0}}i.module("ksSwiper",[]).directive("ksSwiperContainer",a).directive("ksSwiperSlide",n)}(window,angular,void 0);
/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.cascade', [])
  .directive('myCascade', myCascade);

function myCascade(){
  return {
    restrict: 'E',
    scope: {
      partitionId: '=',
      blockId: '=',
      unitId: '=',
      getBlocks: '&',
      getUnits: '&',
      partitions: '=',
      blocks: '=',
      units: '='
    },
    template: '<div class="pull-left w-sm m-r-sm"> <select ui-select2 ng-model="partitionId" data-placeholder="分区" ng-change="getBlocks({partitionId: partitionId})"> <option value=""></option><option ng-value="item.id" ng-repeat="item in partitions"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-sm" > <select ui-select2 name="louyu" ng-model="blockId" data-placeholder="楼宇" ng-change="getUnits({blockId: blockId})"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in blocks"> {{item.name}}幢 </option> </select> </div><div class="pull-left w-xs m-r-lg"> <select ui-select2 name="danyuan" ng-model="unitId" data-placeholder="单元"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in units"> {{item.name}}座 </option> </select> </div>'
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
    template: '<select ui-select2 ng-model="model" data-placeholder="{{placeholder}}"> <option value=""></option> <option ng-repeat="item in optList" ng-value="$index">{{item}}</select>'
  }
}
/**
 * Created by zhongyuqiang on 2017/7/26.
 */
angular.module('deviceMdl', [])
  .controller('deviceCtl', deviceCtl)
  .controller('dDetailCtl', dDetailCtl);

function deviceCtl($modal,$location,$state, deviceSrv,mainSrv, villageSrv, toastr){
  var vm = this;
  vm.openModal = openModal;
  vm.pageNo = parseInt($location.search().id);
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
      getDevice(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
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
  function getDevice(pageNo, obj){
    deviceSrv.getDevice(pageNo, 7, obj).then(function(res){
      console.log(res);

      vm.pages = [];
      if(res.success) {
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

  vm.unbindDevice = unbindDevice;
  function unbindDevice(sn){
    deviceSrv.unbindDevice(sn).then(function(res){
      if(res.success){
        toastr.info('解绑成功')
        getDevice(1);
      }else{
        toastr.info(res.message);
      }
    })
  }
}

function dDetailCtl(items){
  var vm = this;
  console.log(items);
  vm.model = items;
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

function householdCtl($modal,$location,$state, doorSrv,mainSrv){
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
      getResident(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
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
  function getPublicCard(pageNo){
    doorSrv.getPublicCard(pageNo, 7).then(function(res){
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

function hDetailCtl(items){
  var vm = this;
  console.log(items);
  vm.model = items;
}

function cDetailCtl(){
  var vm = this;
}
/**
 * Created by zhongyuqiang on 2017/8/16.
 */
angular.module('homeMdl', [])
  .controller('homeCtl', homeCtl);

function homeCtl(homeSrv){
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

function openCtl($modal, $location,$state, logSrv,mainSrv){
  var vm = this;
  vm.openModal = openModal;
  vm.unlockList = [];
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
      getUnlock(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
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
    logSrv.getUnlock(pageNo, 7, obj).then(function(res){
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
              res.data.list[i].type_cn = '呼叫';
              break;
            case 1:
              res.data.list[i].type_cn = '刷卡';
              break;
            case 2:
              res.data.list[i].type_cn = '密码';
              break;
            case 3:
              res.data.list[i].type_cn = 'APP';
              break;
            default:
              res.data.list[i].type_cn = '';
          }
        }
        vm.unlockList = res.data.list;
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
    logSrv.getAlarm(pageNo, 7, obj).then(function(res){
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

function oDetailCtl(items){
  var vm = this;

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
      mainVm.isLogin = true;
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

  function try_adding_a_branch(model) {
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
      console.log('add level 3');
      obj.communityId = vm.model.communityId;
      obj.partitionId = b.id;
      obj.blockName = model + '幢';
      console.log('level 3: ', obj);
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
            level: 5,
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
      vm.try_adding_a_branch(i);
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
  var server = "http://114.55.143.170:8085";
  //var server = "http://192.168.23.241:8085";
  //var server = "http://116.62.39.38:8085";
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

    getPartitions: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/block/partitions',
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
        url: server + '/community/block/'+partitionId+'/blocks',
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
        url: server + '/community/block/' + blockId + '/units',
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
      if(obj.unitId){
        obj.partitionId = "";
        obj.blockId = "";
      }else if(!obj.unitId&&obj.blockId){
        obj.partitionId = "";
      }else if(!obj.unitId&&!obj.blockId&&obj.partitionId){
        console.log('in');
      }

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