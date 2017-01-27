'use strict';
!function() {

  var getUsage = function(usage) {
    return usage? {
      init : +usage.getInit(),
      used : +usage.getUsed(),
      committed : +usage.getCommitted(),
      max : +usage.getMax()
    } : null;
  };

  var ManagementFactory = Java.type('java.lang.management.ManagementFactory');
  var it = ManagementFactory.getMemoryPoolMXBeans().iterator();

  var mem = [];
  while (it.hasNext() ) {
    var item = it.next();
    mem.push({
      name : '' + item.getName(),
      type : '' + item.getType(),
      usage : getUsage(item.getUsage() ),
      peakUsage : getUsage(item.getPeakUsage() ),
      collectionUsage : getUsage(item.getCollectionUsage() ),
    });
  }
  dto.resData.mem = mem;

}();
