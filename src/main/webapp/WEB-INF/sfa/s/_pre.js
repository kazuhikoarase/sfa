"use strict";
//Nashorn / Rhino compatible
if (typeof Java == 'undefined') {
  !function(Packages) {
    var cache = {};
    Java = {
      type : function(className) {
        if (!cache[className]) {
          var path = className.split(/\./g);
          var cls = Packages;
          for (var i = 0; i < path.length; i += 1) {
            cls = cls[path[i]];
          }
          cache[className] = cls;
        }
        return cache[className];
      }
    };
  }(Packages);
  java = Packages = undefined;
}

var dto = function() {
  var InputStreamReader = Java.type('java.io.InputStreamReader');
  var reqIn = new InputStreamReader(request.getInputStream(), "UTF-8");
  var c;
  var reqData = '';
  while ( (c = reqIn.read() ) != -1) {
    reqData += String.fromCharCode(c);
  }
  return {
    reqData : JSON.parse(reqData),
    resData : {}
  };
}();
