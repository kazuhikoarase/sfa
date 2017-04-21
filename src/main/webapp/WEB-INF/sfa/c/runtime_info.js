'use strict';
!function() {

  $('#runtimeInfoTab').text('Runtime Info');

  var createInfoTable = function(data) {

    var $thead = $('<thead></thead>');
    !function() {
      var $tr = $('<tr></tr>');
      $tr.append($('<th></th>').text('\u00a0') );
      $tr.append($('<th></th>').text('\u00a0') );
      $thead.append($tr);
    }();

    var $tbody = $('<tbody></tbody>');
    $.each(data.rt.info, function(i, info) {
      var $tr = $('<tr></tr>');
      $tr.append($('<td></td>').css('text-align', 'right').
          text(info.key + ' :') );
      $tr.append($('<td></td>').text(info.val) );
      $tbody.append($tr);
    });

    return $('<table></table>').addClass('flat').
      append($thead).append($tbody);
  };

  var createPropTable = function(data) {

    var props = [];
    for (var key in data.rt.props) {
      props.push({key : key, val : data.rt.props[key]});
    }
    props.sort(function(p1, p2) {
      return p1.key < p2.key? -1 : 1;
    });

    var $thead = $('<thead></thead>');
    !function() {
      var $tr = $('<tr></tr>');
      $tr.append($('<th></th>').text('\u00a0') );
      $tr.append($('<th></th>').text('\u00a0') );
      $thead.append($tr);
    }();

    var $tbody = $('<tbody></tbody>');
    $.each(props, function(i, prop) {
      var $tr = $('<tr></tr>');
      $tr.append($('<td></td>').css('text-align', 'right').
          css('white-space', 'nowrap').
          text(prop.key + ' :') );
      $tr.append($('<td></td>').text(prop.val) );
      $tbody.append($tr);
    });

    return $('<table></table>').addClass('flat').
      append($thead).append($tbody);
  };

  sfa.startLoader(function(loader) {
    sfa.invokeServer('runtime_info.js').done(function(data) {

      $('#runtimeInfo').children().remove();
      $('#runtimeInfo').append(createInfoTable(data) );
      $('#runtimeInfo').append($('<h3></h3>').text('System Properties') );
      $('#runtimeInfo').append(createPropTable(data) );
      var date = new Date();
      date.setTime(data.date);
      $('#runtimeInfo').append($('<span></span>').addClass('timestamp').
          text(sfa.formatDate(date) ) );

    }).fail(function(data) {

    }).always(function(data) {
      loader.end();
    });
  }, 5 * 60000);

}();
