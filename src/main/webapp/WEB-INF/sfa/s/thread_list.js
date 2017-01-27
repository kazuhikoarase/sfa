'use strict';
!function() {

  var System = Java.type('java.lang.System');
  var ManagementFactory = Java.type('java.lang.management.ManagementFactory');
  var threadBean = ManagementFactory.getThreadMXBean();
  var ids = threadBean.getAllThreadIds();

  var threads = [];
  for (var i = 0; i < ids.length; i += 1) {
    var id = ids[i];
    var threadInfo = threadBean.getThreadInfo(id);
    var cpuTime = threadBean.getThreadCpuTime(id);
    var userTime = threadBean.getThreadUserTime(id);
    var time = System.nanoTime();

    threads.push({
      id : '' + threadInfo.getThreadId(),
      name : '' + threadInfo.getThreadName(),
      state : '' + threadInfo.getThreadState(),
      cpuTime : +cpuTime,
      userTime : +userTime,
      time : +time
    });
  }
  dto.resData.threads = threads;

}();
