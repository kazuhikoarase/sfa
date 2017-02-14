
var Integer = java.lang.Integer;
var System = java.lang.System;
var File = java.io.File;
var StringWriter = java.io.StringWriter;
var PrintWriter = java.io.PrintWriter;
var BufferedInputStream = java.io.BufferedInputStream;
var FileInputStream = java.io.FileInputStream;

var basedir = project.getProperty("basedir");
var sout = new StringWriter();
var out = new PrintWriter(sout);

try {

  var buildSrc = function(dir, file) {

    var srcIn = new BufferedInputStream(new FileInputStream(file) );
    try {
      var b;
      out.print('  src.append("');
      while ( (b = srcIn.read() ) != -1) {
        var c = String.fromCharCode(b & 0xff);
        if (c == '\\') {
          out.print('\\\\');
        } else if (c == '"') {
          out.print('\\"');
        } else if (0x20 <= b && b <= 0x7e) {
          out.print(c);
        } else {
          out.print('\\');
          out.print(Integer.valueOf( (b >>> 6) & 0x7) );
          out.print(Integer.valueOf( (b >>> 3) & 0x7) );
          out.print(Integer.valueOf(b & 0x7) );
        }
      }
      out.println('\\n");');
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
