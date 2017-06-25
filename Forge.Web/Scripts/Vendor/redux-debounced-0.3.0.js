var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root) {
    var timers = {};

    var middleware = function middleware() {
        return function (dispatch) {
            return function (action) {
                var _action$meta = action.meta;
                _action$meta = _action$meta === undefined ? {} : _action$meta;
                var _action$meta$debounce = _action$meta.debounce,
                    debounce = _action$meta$debounce === undefined ? {} : _action$meta$debounce,
                    type = action.type;
                var time = debounce.time,
                    _debounce$key = debounce.key,
                    key = _debounce$key === undefined ? type : _debounce$key,
                    _debounce$cancel = debounce.cancel,
                    cancel = _debounce$cancel === undefined ? false : _debounce$cancel;


                var shouldDebounce = time && key || cancel && key;

                if (!shouldDebounce) {
                    return dispatch(action);
                }

                if (timers[key]) {
                    clearTimeout(timers[key]);
                }

                if (!cancel) {
                    timers[key] = setTimeout(function () {
                        dispatch(action);
                    }, time);
                }
            };
        };
    };

    middleware._timers = timers;

    root.ReduxDebounce = middleware;
})((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window || undefined);
//(function(root){
//    let timers = {};

//    const middleware = () => dispatch => action => {
//        const { meta: { debounce={} } = {}, type } = action;
//        const { time, key = type, cancel = false } = debounce;

//        const shouldDebounce = (time && key) || (cancel && key);

//        if (!shouldDebounce) {
//            return dispatch(action);
//        }

//        if (timers[key]) {
//            clearTimeout(timers[key]);
//        }

//        if (!cancel) {
//            timers[key] = setTimeout(() => {
//                dispatch(action);
//            }, time);
//        }
//    };

//    middleware._timers = timers;

//    root.ReduxDebounce = middleware;
//})((typeof window === 'object' && window) || this);