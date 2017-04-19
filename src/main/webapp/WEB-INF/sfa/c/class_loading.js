'use strict';
!function() {

  $('#classLoadingTab').text('Class Loading');

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
      $tr.append($('<td></td>').css('text-align', 'right').
          text(sfa.formatNumber(info.val) ) );
      $tbody.append($tr);
    });

    return $('<table></table>').addClass('flat').
      append($thead).append($tbody);
  };

  var update = function(next) {
    sfa.invokeServer('class_loading.js').done(function(data) {

      $('#classLoading').children().remove();
      $('#classLoading').append(createInfoTable(data) );
      var date = new Date();
      date.setTime(data.date);
      $('#classLoading').append($('<span></span>').addClass('timestamp').
          text(sfa.formatDate(date) ) );

    }).fail(function(data) {

    }).always(function(data) {
      next();
    });
  };

  var updateHandler = function() {
    update(function() {
      window.setTimeout(updateHandler, 60000);
    });
  };
  updateHandler();

}();
