var user = {};

// Vendor
// =====================================
const { combineReducers, applyMiddleware, createStore } = Redux;
const { Provider, connect } = ReactRedux;

// Utils
// =====================================
const debounceAction = (thunk, key, time = 500) => { 
    return Object.assign(thunk, { meta: { debounce: { time, key }}});
};

const pushImmutable = (array, item) => {
    var newArray= (array || []).slice();
    newArray.push(item);
    return newArray;
};

const contains = (array, item) => array.indexOf(item) !== -1;

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const sortBy = (arr, prop) => {
    return arr.sort((a, b) => {
        if (a[prop] > b[prop]) return 1;
        if (a[prop] < b[prop]) return -1;
        return 0;
    });
}

const incrementName = (list, name, activeIndex) => {
    // const pattern = /(\(\d+\))/g;
    // const getNum = (a) => {
    //     return +(a.Name.match(pattern) || ['(0)'])[0]
    //         .replace('(', '')
    //         .replace(')', '');
    // }

    // let nextNum = -1;
    // list.map(getNum)
    //     .sort()
    //     .some((num, i) => {
    //         const exists = list.filter(a => a.Name.indexOf(`(${num})`) !== -1)[0];
    //         if (!exists) {
    //             nextNum = num;
    //             return true;
    //         }
    //     });
    
    // if (existingMatch) {
    //     // Get an added extension if it already exists
    //     let num = 1;
    //     const matches = existingMatch.Name.match(pattern);
    //     const numMatch = matches
    //         ? matches[matches.length - 1] || '(0)'
    //         : '(0)';

    //     num = numMatch
            

    //     num = +num + 1;
    //     name = name.replace(numMatch, '');
    //     name += `(${num})`;
    // }

    // return name;
}
