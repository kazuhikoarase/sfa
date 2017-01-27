'use strict';
!function() {

  var ManagementFactory = Java.type('java.lang.management.ManagementFactory');
  var classLoadingBean = ManagementFactory.getClassLoadingMXBean();

  var rt = {};
  rt.info = [];
  rt.info.push({ key : 'LoadedClassCount',
    val : +classLoadingBean.getLoadedClassCount() });
  rt.info.push({ key : 'UnloadedClassCount',
    val : +classLoadingBean.getUnloadedClassCount() });
  rt.info.push({ key : 'TotalLoadedClassCount',
    val : +classLoadingBean.getTotalLoadedClassCount() });
  dto.resData.rt = rt;

}();
