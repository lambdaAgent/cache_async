

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
