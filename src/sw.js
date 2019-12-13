// importScripts('./dexie.min.js');

let requests = [];
self.addEventListener('message', function (event) {
  if (event.data.type && event.data.type === 'online') {
    requests.forEach(function (serialized) {
      deserialize(serialized).then(function (request) {
        fetch(request).then(function (response) {
          response.json().then(function (res) {
            self.clients.matchAll().then(function(all) {
              all.forEach(function(client) {
                client.postMessage(res);
              });
            });
          });
        });
      });
    });
  }
});
// Listen to fetch requests
self.addEventListener('fetch', function (event) {
  // We will cache all POST requests, but in the real world, you will probably filter for
  // specific URLs like if(... || event.request.url.href.match(...))
  if (event.request.method === "POST") {

    // // Init the cache. We use Dexie here to simplify the code. You can use any other
    // // way to access IndexedDB of course.
    // var db = new Dexie("post_cache");
    // db.version(1).stores({
    //   post_cache: 'key,response,timestamp'
    // });

    if (!navigator.onLine) {
      serialize(event.request).then(function (serialized) {
        requests.push(serialized);
        console.log(requests);
        // event.respondWith(new Response(event.request.body));
      });
    }
    // event.respondWith(
    //   // First try to fetch the request from the server
    //   fetch(event.request.clone())
    //     .then(function (response) {
    //       // If it works, put the response into IndexedDB
    //       cachePut(event.request.clone(), response.clone(), db.post_cache);
    //       return response;
    //     })
    //     .catch(function () {
    //       // If it does not work, return the cached response. If the cache does not
    //       // contain a response for our request, it will give us a 503-response
    //       return cacheMatch(event.request.clone(), db.post_cache);
    //     })
    // );
  }
});

function sendInOrder(requests) {
  console.log(requests);
  var sending = requests.reduce(function (prevPromise, serialized) {
    return prevPromise.then(function () {
      return deserialize(serialized).then(function (request) {
        return fetch(request);
      });
    });
  }, Promise.resolve());
  return sending;
}

// Serialize is a little bit convolved due to headers is not a simple object.
function serialize(request) {
  var headers = {};
  // `for(... of ...)` is ES6 notation but current browsers supporting SW, support this
  // notation as well and this is the only way of retrieving all the headers.
  for (var entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }
  var serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  };

  // Only if method is not `GET` or `HEAD` is the request allowed to have body.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request.clone().text().then(function (body) {
      serialized.body = body;
      return Promise.resolve(serialized);
    });
  }
  return Promise.resolve(serialized);
}

// Compared, deserialize is pretty simple.
function deserialize(data) {
  return Promise.resolve(new Request(data.url, data));
}
