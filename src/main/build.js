var String = java.lang.String;
var Integer = java.lang.Integer;
var System = java.lang.System;
var File = java.io.File;
var StringWriter = java.io.StringWriter;
var PrintWriter = java.io.PrintWriter;
var BufferedReader = java.io.BufferedReader;
var InputStreamReader = java.io.InputStreamReader;
var FileInputStream = java.io.FileInputStream;

var basedir = project.getProperty("basedir");
var sout = new StringWriter();
var out = new PrintWriter(sout);
try {

  var buildSrc = function(dir, file) {

    var srcIn = new BufferedReader(new InputStreamReader(
        new FileInputStream(file), 'UTF-8') );
    try {
      var line;
      while ( (line = srcIn.readLine() ) != null) {
        out.print('  src.append("');
        for (var i = 0; i < line.length(); i += 1) {
          var c = '' + line.substring(i, i + 1);
          var code = +line.charAt(i);
          if (c == '\\') {
            out.print('\\\\');
          } else if (c == '"') {
            out.print('\\"');
          } else if (0x20 <= code && code <= 0x7e) {
            out.print(c);
          } else {
            out.print(String.format('\\u%04x', Integer.valueOf(code) ) );
          }
        }
        out.println('\\n");');
      }
    } finally {
      srcIn.close();
    }
  };

  var outputSrc = function(offset, dir) {
    var files = new File(new File(basedir, 'WEB-INF/sfa'), dir).listFiles();
    for (var i = 0; i < files.length; i += 1) {
      var file = files[i];
      if (!file.isFile() ) {
        continue;
      }
      out.println('private static void initSrc' + (offset + i) + '() {');
      out.println('  StringBuilder src = new StringBuilder();');
      buildSrc(dir, file);
      out.print('  srcMap.put("');
      out.print(dir + '/' + file.getName() );
      out.println('", src.toString() );');
      out.println('}');
    }
    return files.length;
  };

  var numSources = 0;
  numSources += outputSrc(numSources, 'c');
  numSources += outputSrc(numSources, 's');
  out.println('static {');
  for (var i = 0; i < numSources; i += 1) {
    out.println('  initSrc' + i + '();');
  }
  out.println('}');

} finally {
  out.close();
}
project.setProperty("srcString", sout.toString() );
