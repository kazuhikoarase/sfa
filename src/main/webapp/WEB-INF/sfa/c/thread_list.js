'use strict';
!function() {

  $('#threadListTab').text('Thread List');

  var lastDate = 0;
  var lastThreads = {};
  
  var threadComparator = function(t1, t2) {
    var u1 = typeof t1.cpuUsage;
    var u2 = typeof t2.cpuUsage;
    if (u1 == 'number' && u2 != 'number') {
      return -1;
    } else if (u1 != 'number' && u2 == 'number') {
      return 1;
    } else if (u1 == 'number' && u2 == 'number') {
      if (t1.cpuUsage != t2.cpuUsage) {
        return t1.cpuUsage > t2.cpuUsage? -1 : 1;
      }
    }
    return t1.id > t2.id? -1 : 1; 
  };

  var update = function() {
    sfa.invokeServer('thread_list.js').done(function(data) {

      var dt = (data.date - lastDate) * 10000;
      $.each(data.threads, function(i, thread) {
        var lastThread = lastThreads['' + thread.id];
        if (lastThread) {
          thread.cpuUsage = (thread.cpuTime - lastThread.cpuTime) / dt;
          thread.userUsage = (thread.userTime - lastThread.userTime) / dt;
        }
      });

      data.threads.sort(threadComparator);

      lastDate = data.date;
      lastThreads = {};
      $.each(data.threads, function(i, thread) {
        lastThreads['' + thread.id] = thread;
      });

      var $thead = $('<thead></thead>');
      !function() {
        var $tr = $('<tr></tr>');
        $tr.append($('<th></th>').text('ID') );
        $tr.append($('<th></th>').text('Name') );
        $tr.append($('<th></th>').text('State') );
        $tr.append($('<th></th>').text('Cpu(%)') );
        $tr.append($('<th></th>').text('User(%)') );
        $thead.append($tr);
      }();

      var $tbody = $('<tbody></tbody>');
      $.each(data.threads, function(i, thread) {

        var getUsage = function(id) {
          var usage = thread[id];
          return typeof usage == 'number'? sfa.formatNumber(usage, 1) : '-';
        };

        var $tr = $('<tr></tr>');
        $tr.append($('<td></td>').
            css('text-align', 'right').text(thread.id) );
        $tr.append($('<td></td>').text(thread.name) );
        $tr.append($('<td></td>').text(thread.state) );
        $tr.append($('<td></td>').
            css('text-align', 'right').
            css('padding-right', '20px').text(getUsage('cpuUsage') ) );
        $tr.append($('<td></td>').
            css('text-align', 'right').
            css('padding-right', '20px').text(getUsage('userUsage') ) );

        $tbody.append($tr);
      });

      $('#threadList').children().remove();
      $('#threadList').append($('<table></table>').addClass('flat').
          append($thead).append($tbody) );
      var date = new Date();
      date.setTime(data.date);
      $('#threadList').append($('<span></span>').addClass('timestamp').
          text(sfa.formatDate(date) ) );

    }).fail(function(data) {

    });
  };

  var updateHandler = function() {
    update();
    window.setTimeout(updateHandler, 2000);
  };
  updateHandler();

}();
