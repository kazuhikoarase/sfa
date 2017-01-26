"use strict";
$(function() {

  var assertEquals = function(expected, actual) {
    if (expected !== actual) {
      throw 'expected ' + expected + ' but ' + actual;
    }
  };

  var formatNumber = function(n) {
    var neg = n < 0;
    if (neg) {
      n = -n;
    }
    var sn = '' + Math.floor(n);
    var s = '';
    while (sn.length > 3) {
      s = ',' + sn.substring(sn.length - 3) + s;
      sn = sn.substring(0, sn.length - 3);
    }
    s = sn + s;
    if (neg) {
      s = '-' + s;
    }
    return s;
  };

  var formatDate = function() {
    var nToS = function(n, digit) {
      var s = '' + n;
      while (s.length < digit) {
        s = '0' + s;
      }
      return s;
    };
    return function(date) {
      return nToS(date.getFullYear(), 4) + '/' +
        nToS(date.getMonth() + 1, 2) + '/' +
        nToS(date.getDate(), 2) + ' ' +
        nToS(date.getHours(), 2) + ':' +
        nToS(date.getMinutes(), 2) + ':' +
        nToS(date.getSeconds(), 2);
    };
  }();
  
  assertEquals('0', formatNumber(0) );
  assertEquals('0', formatNumber(-0) );
  assertEquals('123', formatNumber(123) );
  assertEquals('1,234', formatNumber(1234) );
  assertEquals('-1,234', formatNumber(-1234) );
  assertEquals('2,783,641,600', formatNumber(2783641600) );
  assertEquals('1970/01/01 09:00:00', function(){
    var date = new Date();
    date.setTime(0);
    return formatDate(date);
  }() );

  var createSVGElement = function(tagName) {
    return $(document.createElementNS(
        'http://www.w3.org/2000/svg', tagName) );
  };

  var createSVG = function(w, h) {
    return createSVGElement('svg').
      attr({ width: w, height: h, viewBox: '0 0 ' + w + ' ' + h });
  };

  var loadModule = function(src) {
    return $.ajax({
      type : 'GET',
      url : '?type=c&src=' + src + '&t=' + new Date().getTime() 
    });
  };

  var invokeServer = function(src, data) {
    return $.ajax({
      type : 'POST',
      url : '?type=s&src=' + src,
      contentType : 'application/json',
      data : JSON.stringify(data || {})
    });
  };

  sfa.formatNumber = formatNumber;
  sfa.formatDate = formatDate;
  sfa.createSVGElement = createSVGElement;
  sfa.createSVG = createSVG;
  sfa.invokeServer = invokeServer;

  invokeServer('main.js').done(function(data) {

    document.title = 'SFA | Memory Pool View';
    $('BODY').append($('<span></span>').
        attr('id', 'appVersion').text('build: ' + data.version) );

    loadModule('memory_pool.js');
  });
});

var sfa = {};
