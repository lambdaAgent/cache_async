function Cache(obj){
  let _cache = obj;
  let api = {};
  api.put_cache = (string_path, value, ttl) => {
    recursiveAssign(_cache, value, string_path);
    //deleting TTL will not throw error at all, it' silent operation
    deleteTTL(_cache, string_path, ttl)
  };

  api.delete_cache = (string_path) => {
    recursiveDelete(_cache, string_path )
  }

  api.get_cache_promise = (string_path) => {
    return recursiveGet(_cache, string_path); // promise
  };

  return api;
}


function breakStringPath_toArray(string_path){
  return Promise.resolve(string_path.split('.'))
}


function recursiveAssign(mainObj, value, string_path){
    function recurseAssign(obj, value, array_path){
        if(array_path.length === 1)
        {   
            if(typeof obj !== 'object') throw new TypeError('Not an object')
            obj[array_path[0]] = {};
            obj[array_path[0]] = value;
            console.log('obj', mainObj)
        }
        else if(obj.hasOwnProperty(array_path[0])){
            recurseAssign(obj[array_path[0]], value, array_path.slice(1));
        } else {
            obj[array_path[0]] = {};
            recurseAssign(obj[array_path[0]], value, array_path.slice(1))
        }
    }
    
    breakStringPath_toArray(string_path)
        .then(array_path => {
        recurseAssign(mainObj, value, array_path)
        })
        .catch(console.error)
}

function recursiveDelete(mainObj, string_path, ttl){
    function recurseDelete(obj, array_path){
        if(array_path.length === 1)
        {   
            if(ttl) {
              obj[array_path[0]] = {};
              delete obj[array_path[0]];
              return;
            }
            if(typeof obj !== 'object') throw new TypeError('Not an object');
            if(!obj.hasOwnProperty(array_path[0])) throw new ReferenceError('Object has no key of ' + array_path.join('.')) 
            obj[array_path[0]] = {};
            delete obj[array_path[0]];
            console.log('delete obj', mainObj)
        }
        else if(obj.hasOwnProperty(array_path[0])){
            recurseDelete(obj[array_path[0]], array_path.slice(1));
        } else {
            obj[array_path[0]] = {};
            recurseDelete(obj[array_path[0]], array_path.slice(1))
        }
    }
    breakStringPath_toArray(string_path)
    .then(array_path => {
      recurseDelete(mainObj, array_path)
    })
    .catch(console.error)
}

function recursiveGet(mainObj, string_path){
    function recurseGet(obj, array_path){
        if(array_path.length === 1)
        {
          if(typeof obj !== 'object') throw new TypeError('Not an object')
          if(!obj.hasOwnProperty(array_path[0])) throw new ReferenceError('Object has no key of ' + array_path.join('.')) 
          return obj[array_path[0]]
        }
        else if(obj.hasOwnProperty(array_path[0])){
            return recurseGet(obj[array_path[0]], array_path.slice(1));
        } else {
            obj[array_path[0]] = {};
            return recurseGet(obj[array_path[0]], array_path.slice(1))
        }
    }
    return new Promise((resolve, reject) => {
     breakStringPath_toArray(string_path)
        .then(array_path => {
          const result = recurseGet(mainObj, array_path)
          resolve(result)
        })
        .catch(reject)
        })

}

function deleteTTL(obj, string_path, ttl){
    setTimeout(() => {
        recursiveDelete(obj, string_path, ttl)
    }, ttl) 
}


const cache = Cache({});

const Project = {
  name_project: 'bathroom',
  images: ['http://asdfsafd', 'http:asdfasfd']
};

cache.put_cache("test", Project, 1000);
cache.put_cache("test.hello", "world", 1000);
cache.put_cache("test.hi", "world", 5000);
cache.delete_cache('test.hello')
cache.get_cache_promise("test.hi")
 .then(console.log)
 .catch(err => {

 })

setTimeout(() => cache.get_cache_promise("test.hi")
 .then(console.log)
 .catch(err=> {
     
 }), 1100);
