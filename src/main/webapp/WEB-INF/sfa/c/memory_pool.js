'use strict';
!function() {

  $('#memoryPoolTab').text('Memory Pool');

  var style = {
    initColor : '#ffcc00',
    usedColor : '#00ff00',
    committedColor : '#ccffcc',
    maxColor : '#ff0000'
  };

  var createUsageTable = function(usage, max) {
    var $tbody = $('<tbody></tbody>');
    var append = function(label, value, color) {
      var $tr = $('<tr></tr>');
      $tr.append($('<td></td>').css('text-align', 'right').
          append($('<span></span>').text(label) ).
          append($('<span></span>').
              css('display', 'inline-block').
              css('margin', '0px 4px 0px 4px').
              css('border', '1px solid #999999').
              css('width', '4px').css('height', '4px').
              css('background-color', color) ).
          append($('<span></span>').text(':') ) );
      $tr.append($('<td></td>').css('text-align', 'right').
          css('width', '80px').
          text(sfa.formatNumber(value) ) );
      $tbody.append($tr);
    };
    append('init', usage.init, style.initColor);
    append('used', usage.used, style.usedColor);
    append('committed', usage.committed, style.committedColor);
    append('max', usage.max, style.maxColor);
    return $('<table></table>').addClass('layout').append($tbody);
  };

  var createUsageGraph = function(usage, max) {
    var drawLine = function(x, color) {
      $svg.append(sfa.createSVGElement('path').
          attr('d', 'M' + x + ' 0L' + x + ' ' + h).
          css('stroke-width', 2).css('stroke', color).css('fill', 'none') );
    };
    var w = 160;
    var h = 10;
    var $svg = sfa.createSVG(w, h);
    $svg.append(sfa.createSVGElement('rect').
        attr({x:0, y:0, width:w, height:h}).
        css('stroke', 'none').css('fill', '#cccccc') );
    $svg.append(sfa.createSVGElement('rect').
        attr({x:0, y:0, width: ~~(w * usage.committed / max), height:h}).
        css('stroke', 'none').css('fill', style.committedColor) );
    $svg.append(sfa.createSVGElement('rect').
        attr({x:0, y:0, width: ~~(w * usage.used / max), height:h}).
        css('stroke', 'none').css('fill', style.usedColor) );
    drawLine(~~(w * usage.init / max), style.initColor);
    drawLine(~~(w * usage.max / max) - 1, style.maxColor);
    return $svg;
  };

  var update = function() {
    sfa.invokeServer('memory_pool.js').done(function(data) {

      var $thead = $('<thead></thead>');
      !function() {
        var $tr = $('<tr></tr>');
        $tr.append($('<th></th>').text('Name') );
        $tr.append($('<th></th>').text('Type') );
        $tr.append($('<th></th>').text('Usage') );
        $tr.append($('<th></th>').text('Peak usage') );
        $tr.append($('<th></th>').text('Collection usage') );
        $thead.append($tr);
      }();

      var $tbody = $('<tbody></tbody>');
      $.each(data.mem, function(i, mem) {
        var $tr = $('<tr></tr>');
        $tr.append($('<td></td>').text(mem.name) );
        $tr.append($('<td></td>').text(mem.type) );
        var max = mem.usage.max;
        if (mem.peakUsage) {
          max = Math.max(max, mem.peakUsage.max);
        }
        if (mem.collectionUsage) {
          max = Math.max(max, mem.collectionUsage.max);
        }
        var append = function(usage) {
          if (usage) {
            $tr.append($('<td></td>').
                append(createUsageGraph(usage, max) ).
                append(createUsageTable(usage, max) ) );
          } else {
            $tr.append($('<td></td>') );
          }
        };
        append(mem.usage);
        append(mem.peakUsage);
        append(mem.collectionUsage);

        $tbody.append($tr);
      });

      $('#memoryPool').children().remove();
      $('#memoryPool').append($('<table></table>').addClass('flat').
          append($thead).append($tbody) );
      var date = new Date();
      date.setTime(data.date);
      $('#memoryPool').append($('<span></span>').addClass('timestamp').
          text(sfa.formatDate(date) ) );

    }).fail(function(data) {

    });
  };

  var updateHandler = function() {
    update();
    window.setTimeout(updateHandler, 5000);
  };
  updateHandler();

}();
