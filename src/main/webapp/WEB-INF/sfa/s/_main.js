'use strict';
!function() {
  var version = '' + request.getAttribute('sfa-version');
  dto.resData.version = version != '%%version%%' ? version : 'debug';
}();

