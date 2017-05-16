// // -------------------------------------------------
// // <Designer />
// // 
// // =====================
// // |       a   b       |
// // =====================
// // | 1 |     2     | 3 |
// // |   |           |   |
// // |   |           |   |
// // =====================
// // a: Designer.Summary
// // b: Designer.Tabs
// // 1: Designer.Definitions
// // 2: Designer.Stage
// // 3: Designer.Settings
// //
// // --------------------------------------------------
// // =====================================
// // Presentation
// // =====================================
// const __Designer = React.createClass({
//     // -----------------------------
//     render: function () {

//         return (
//             <div className='designer'>

//                 {/* Game Information & Navigation */}
//                 <Designer.Summary />
//                 <Designer.Tabs />

//                 <div className='designer__views'>
//                     {/* Stage & Controls */}
//                     <Designer.List />
//                     <Designer.Stage />
//                 </div>

//             </div>
//         );
//     },

//     // -----------------------------
//     componentWillMount: function(){
//         // Model comes from C# -
//         // Set data into store with dispatch.
//         const { dispatch, id } = this.props;
//         dispatch(coreActions.fetchGame(id));
//     },

//     // -----------------------------
//     componentWillReceiveProps: function(nextProps){
//         const game = nextProps.Game;
//         if (game && game.Name) document.title = `${game.Name} - Forge | Designer`;
//     }
// });

// // =====================================
// // Container
// // =====================================
// const Designer = connect(
//     state => { return { ...state.core } }
// )(__Designer);

// // =====================================
// // Root
// // =====================================
// Designer.Provider = (props) => (
//     <Provider store={store}>
//         <Designer {...props} />
//     </Provider>
// );
