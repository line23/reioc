### Installation

```
$ npm install reioc
```

### How to use

You need to configure reioc with rootPath and namespaces. This configuration must be inside app.js top-level file.
```javascript
require('reioc').config({
    rootPath: __dirname,
    namespaces:{
      // Namespace: { path: path/to/modules/folder }
      services: { path: 'services/test'}
    }
});

var TestService = require('reioc').get('services/testService');
```
inside /services/test/testService.js:
```javascript
var TestService = function(settings) {
	this.foo = new TestService.$get['services/fooService']();
};

TestService.$inject = ['services/fooService']; // 'services/' => namespace, 'fooService' => fooService.js, located in 'services' namespace path ({path: 'services/test'}), i.e fooService => services/test/fooService.js
module.exports = TestService;
```
/services/test/fooService.js:
```javascript
var FooService = function() {
  // omitted for brevity
};
module.exports = FooService;
```
