'use strict';
!function() {

  var ManagementFactory = Java.type('java.lang.management.ManagementFactory');
  var runtimeBean = ManagementFactory.getRuntimeMXBean();
  var classLoadingBean = ManagementFactory.getClassLoadingMXBean();

  var rt = {};
  rt.info = [];
  rt.info.push({ key : 'Name', val : '' + runtimeBean.getName() });
  rt.info.push({ key : 'VmName', val : '' + runtimeBean.getVmName() });
  rt.info.push({ key : 'VmVendor', val : '' + runtimeBean.getVmVendor() });
  rt.info.push({ key : 'VmVersion', val : '' + runtimeBean.getVmVersion() });
  rt.info.push({ key : 'SpecName',
    val : '' + runtimeBean.getSpecName() });
  rt.info.push({ key : 'SpecVendor',
    val : '' + runtimeBean.getSpecVendor() });
  rt.info.push({ key : 'SpecVersion',
    val : '' + runtimeBean.getSpecVersion() });
  rt.info.push({ key : 'LoadedClassCount',
    val : '' + classLoadingBean.getLoadedClassCount() });
  rt.info.push({ key : 'UnloadedClassCount',
    val : '' + classLoadingBean.getUnloadedClassCount() });
  rt.info.push({ key : 'TotalLoadedClassCount',
    val : '' + classLoadingBean.getTotalLoadedClassCount() });

  rt.props = {};
  var props = runtimeBean.getSystemProperties().entrySet().toArray();
  for (var i = 0; i < props.length; i += 1) {
    var prop = props[i];
    rt.props['' + prop.getKey()] = '' + prop.getValue();
  }
  dto.resData.rt = rt;

}();
