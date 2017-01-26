'use strict';
!function() {

  var ManagementFactory = Java.type('java.lang.management.ManagementFactory');
  var threadBean = ManagementFactory.getThreadMXBean();
  var ids = threadBean.getAllThreadIds();
  var threads = [];
  for (var i = 0; i < ids.length; i += 1) {
    var id = ids[i];
    var threadInfo = threadBean.getThreadInfo(id);
    threads.push({
      id : '' + threadInfo.getThreadId(),
      name : '' + threadInfo.getThreadName(),
      state : '' + threadInfo.getThreadState(),
      cpuTime : +threadBean.getThreadCpuTime(id),
      userTime : +threadBean.getThreadUserTime(id)
    });
  }
  dto.resData.threads = threads;

}();
