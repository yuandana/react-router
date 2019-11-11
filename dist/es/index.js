function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * 区分是否为 react 组件 或 react 函数组件
 *
 * @param {*} obj
 */
// const isExtendsReactComponent = obj => {
//     if (!obj) {
//         return false;
//     }
//     // return Object.getPrototypeOf(obj) === React.Component;
//     if (obj.prototype && obj.prototype.isReactComponent) {
//         return true;
//     }
//     if (typeof obj === 'function' && obj.length <= 1) {
//         return true;
//     }
//     return false;
// };

/**
 *
 * @param {*} nextState
 * @param {*} replace
 * @param {*} callback
 * @param {*} options
 */
var beforeEachHook = function beforeEachHook(nextState, replace, callback) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var oriOnEnter = options.oriOnEnter,
      beforeEach = options.beforeEach,
      afterEach = options.afterEach,
      onUpdate = options.onUpdate;

  var callbackFunc = function callbackFunc() {
    callback();
    afterEach && typeof afterEach === 'function' && afterEach(nextState);
    onUpdate && typeof onUpdate === 'function' && onUpdate(nextState);
  };

  var nextFunc = function nextFunc() {
    if (oriOnEnter && typeof oriOnEnter === 'function') {
      oriOnEnter(nextState, replace, callbackFunc);
    } else {
      callbackFunc();
    }
  };

  if (beforeEach && typeof beforeEach === 'function') {
    // nextState.router = router;
    beforeEach(nextState, replace, nextFunc);
  } else {
    nextFunc();
  }
};
/**
 *
 */


var redirectHandler = function redirectHandler(nextState, replace, redirect) {
  var nextRedirect = redirect;
  var params = nextState.params; // 支持 redirect/:xxx 的形式

  Object.keys(params).forEach(function (key) {
    var patt = new RegExp("/:".concat(key), 'g');

    if (nextRedirect.search(patt) !== -1) {
      if (params[key]) {
        nextRedirect = nextRedirect.replace(patt, "/".concat(params[key]));
      }
    }
  });
  replace(nextRedirect);
};

var componentEncodeHandler = function componentEncodeHandler(obj, component) {
  if (!component) {
    return;
  } // let key = isExtendsReactComponent(component) ? 'component' : 'getComponent';


  obj['component'] = component;
};

var nameEncodeHandler = function nameEncodeHandler(obj, name) {
  if (!name) {
    return;
  }

  obj['name'] = name;
};

var pathEncodeHandler = function pathEncodeHandler(obj, path) {
  obj['path'] = path;
};

var metaEncodeHandler = function metaEncodeHandler(obj, meta) {
  if (!meta) {
    return;
  }

  obj['meta'] = meta;
};
/**
 * 全局的 oldPathname cache
 *
 * 用于每次. onEnterEncode 执行次数判断及控制
 */


var oldPathname = null;

var onEnterEncodeHandler = function onEnterEncodeHandler(obj, options) {
  var oriOnEnter = options.oriOnEnter,
      beforeEach = options.beforeEach,
      afterEach = options.afterEach,
      onUpdate = options.onUpdate,
      redirect = options.redirect,
      _options$router = options.router,
      router = _options$router === void 0 ? {} : _options$router;
  var path = router.path;

  var onEnterHook = function onEnterHook() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var nextState = args[0],
        replace = args[1];
    var _nextState$location = nextState.location,
        location = _nextState$location === void 0 ? {} : _nextState$location,
        _nextState$routes = nextState.routes,
        routes = _nextState$routes === void 0 ? [] : _nextState$routes;
    var lastMatchRoutes = routes && routes[routes.length - 1] && routes[routes.length - 1];
    var matchPath = lastMatchRoutes && lastMatchRoutes.path;
    var nextPathname = location.pathname; // 处理重定向

    if (redirect && (matchPath && matchPath === path || path === '*') && nextPathname !== redirect) {
      redirectHandler(nextState, replace, redirect);
    } // 处理 beforeEachHook


    if (nextPathname !== oldPathname) {
      // 触发 beforeEach
      beforeEachHook.apply(void 0, args.concat([{
        oriOnEnter: oriOnEnter,
        beforeEach: beforeEach,
        afterEach: afterEach,
        onUpdate: onUpdate
      }]));
      oldPathname = nextPathname;
    }
  }; // 用于辅助当路由为 /a/b -> /a 时，
  // 不再触发 /a onEnter
  // 已至于无法完成 /a 所包含的 redirect 问题


  var onChangeHook = function onChangeHook() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var prevState = args[0],
        nextState = args[1],
        replace = args[2],
        callback = args[3];
    var prevPathname = prevState.location.pathname;
    var nextPathname = nextState.location.pathname;

    if (redirect && prevPathname !== nextPathname && prevPathname.indexOf(nextPathname) !== -1 && (nextPathname === "/".concat(path) || nextPathname === path || path === '*')) {
      redirectHandler(nextState, replace, redirect);
    }

    callback();
  };

  obj['onEnter'] = onEnterHook;
  obj['onChange'] = onChangeHook;
};

var routerHandler = function routerHandler(router, beforeEach, afterEach, onUpdate) {
  if (!router) {
    return;
  }

  var result = {};
  var name = router.name,
      path = router.path,
      component = router.component,
      redirect = router.redirect,
      children = router.children,
      onEnter = router.onEnter,
      meta = router.meta; // name

  nameEncodeHandler(result, name); // path

  pathEncodeHandler(result, path); // meta

  metaEncodeHandler(result, meta); // component|getComponent

  componentEncodeHandler(result, component); // onEnter

  onEnterEncodeHandler(result, {
    oriOnEnter: onEnter,
    beforeEach: beforeEach,
    afterEach: afterEach,
    onUpdate: onUpdate,
    redirect: redirect,
    path: path,
    router: router
  }); // childrenRoutes

  if (children && children.length > 0) {
    var childRoutes = [];
    children.forEach(function (childrenItem) {
      var path = childrenItem.path;

      if (path === '') {
        var indexRoute = routerHandler(childrenItem, beforeEach, afterEach);
        var resultIndexRoute = result.indexRoute;
        var nextIndexRoute = Object.assign({}, resultIndexRoute, indexRoute);
        result.indexRoute = nextIndexRoute;
      } else {
        childRoutes.push(routerHandler(childrenItem, beforeEach, afterEach));
      }
    });
    result.childRoutes = childRoutes;
  }

  return result;
};

var reactRouterConfigHandler = function reactRouterConfigHandler(router, beforeEach, afterEach, onUpdate) {
  return router && routerHandler(router, beforeEach, afterEach, onUpdate);
};

var RouterX =
/*#__PURE__*/
function () {
  function RouterX(__config) {
    _classCallCheck(this, RouterX);

    this.__config = __config;
    this.__beforeEachCache = null;
    this.__afterEachCache = null;
    this.__onUpdateCache = null;
  }

  _createClass(RouterX, [{
    key: "beforeEach",
    value: function beforeEach(callback) {
      this.__beforeEachCache = callback;
    }
  }, {
    key: "afterEach",
    value: function afterEach(callback) {
      this.__afterEachCache = callback;
    }
  }, {
    key: "onUpdate",
    value: function onUpdate(callback) {
      this.__onUpdateCache = callback;
    }
  }, {
    key: "config",
    get: function get() {
      var __config = this.__config,
          __beforeEachCache = this.__beforeEachCache,
          __afterEachCache = this.__afterEachCache,
          __onUpdateCache = this.__onUpdateCache;
      return reactRouterConfigHandler(__config, __beforeEachCache, __afterEachCache, __onUpdateCache);
    }
  }]);

  return RouterX;
}();

export default RouterX;
