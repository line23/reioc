var path = require('path');
	
var Req = function(){
	self          = this;
	this.settings = {};

	this.stack = [];
}, self;

Req.prototype._buildPathToModule = function(namespace, moduleName) {
	if(this.settings.namespaces[namespace]){
		var modulePath = this.settings.namespaces[namespace].path;
		return path.join(this.settings.rootPath, modulePath, moduleName);
	}
};
Req.prototype.instanceModule = function(path){
	var module = require(path);
	this._injectDependencies(module);
	return module;
};

Req.prototype._injectDependencies = function(module){
	if(module.$inject && module.$inject.length && !module.$__injected){
		module.$get = {};
		module.$inject.forEach(function(dependencyName){
			var dependency = self.get(dependencyName);
			module.$get[dependencyName] = dependency;
		});
		module.$__injected = true;
	}
};
// set up module 
Req.prototype.config = function(settings){
	this.settings = settings;
};
Req.prototype.get = function(serviceName) {
	// split namespace and module's name
	var pathArr    = serviceName.split('/');
	// get module's name
	var moduleName = pathArr.pop();
	// get namespace
	var namespace  = pathArr.join('/');

	// if module has been visited
	if(this.stack.indexOf(serviceName) !== -1){
		// print error for circular dependencies
		var stack = ' ';
		this.stack.forEach(function(stackElName){
			stack += stackElName + ' >>> ';
		});

		stack += serviceName;
		throw new Error("Circular dependency! stack:" + stack);
	}

	this.stack.push(serviceName);
	var module = this.instanceModule(this._buildPathToModule(namespace, moduleName));
	this.stack.pop();

	return module;
};

module.exports = new Req();

