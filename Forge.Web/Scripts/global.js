let user = {};

// Vendor
// =====================================
const { combineReducers, applyMiddleware, createStore } = Redux;
const { Provider, connect } = ReactRedux;


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
