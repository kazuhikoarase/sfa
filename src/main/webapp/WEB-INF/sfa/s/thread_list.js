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
  var mem = [];
  var it = ManagementFactory.getMemoryPoolMXBeans().iterator();
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
  var threadInfoList = ManagementFactory.getThreadMXBean().
      dumpAllThreads(false, false);
  var threads = [];
  for (var i = 0; i < threadInfoList.length; i += 1) {
    var threadInfo = threadInfoList[i];
    threads.push({
      id : '' + threadInfo.getThreadId(),
      name : '' + threadInfo.getThreadName()
    });
  }
  dto.resData.threads = threads;
  
}();
