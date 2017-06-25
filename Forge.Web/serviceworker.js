//var version = '0.0.1';

//self.addEventListener('install', function (evt) {
//    evt.waitUntil(
//        caches.open('forge').then(function (cache) {
//            return cache.addAll([
//                '/',
//                '/Account/Index',
//                //'/Designer',

//                '/Scripts/vendor-js',
//                '/Scripts/app-js',
//                '/Styles/main-css',
//                '/Styles/Fonts/font-awesome.min.css',
//                '/Styles/fonts/fontawesome-webfont.woff2'
//            ]);
//        }));
//});

//self.addEventListener('fetch', function (event) {
//    var request = event.request;

//    // Remove query string & hash from request URL.
//    var url = new URL(request.url);
//    url.search = '';
//    url.fragment = '';
//    console.log(request)

//    // Create a new request with that cleaned URL
//    // to be used as a cache match.
//    var cleanRequest = new Request(url, {
//        //method: request.method,
//        //headers: request.headers,
//        mode: request.mode,
//        //credentials: request.credentials,
//        //cache: request.cache,
//        redirect: request.redirect,
//        //referrer: request.referrer,
//        //integrity: request.integrity,
//    });
    
//    event.respondWith(
//        caches.match(cleanRequest).then(function (response) {
//            console.log(cleanRequest.url, response);
//            return response || fetch(request);
//        })
//    );
//});
