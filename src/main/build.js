
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
      out.print('"');
      while ( (b = srcIn.read() ) != -1) {
        var c = String.fromCharCode(b & 0xff);
        if (c == '\\') {
          out.print('\\\\');
        } else if (c == '"') {
          out.print('\\"');
        } else if (c == '\b') {
          out.print('\\b');
        } else if (c == '\t') {
          out.print('\\t');
        } else if (c == '\n') {
          out.print('\\n');
        } else if (c == '\f') {
          out.print('\\f');
        } else if (c == '\r') {
          out.print('\\r');
        } else if (0x20 <= b && b <= 0x7e &&
            c != '<' && c != '>' && c != ']') {
          out.print(c);
        } else {
          out.print('\\');
          out.print(Integer.valueOf( (b >>> 6) & 0x7) );
          out.print(Integer.valueOf( (b >>> 3) & 0x7) );
          out.print(Integer.valueOf(b & 0x7) );
        }
      }
      out.print('"');
    } finally {
      srcIn.close();
    }
  };

  var outputSrc = function(dir) {
    var files = new File(new File(basedir, 'WEB-INF/sfa'), dir).listFiles();
    for (var i = 0; i < files.length; i += 1) {
      var file = files[i];
      if (!file.isFile() ) {
        continue;
      }
      out.print('    srcMap.put("');
      out.print(dir + '/' + file.getName() );
      out.print('", ');
      buildSrc(dir, file);
      out.println('.getBytes("ISO-8859-1") );');
    }
  };

  out.println('static {');
  out.println('  try {');
  outputSrc('c');
  outputSrc('s');
  out.println('  } catch(Exception e) {');
  out.println('    throw new RuntimeException(e);');
  out.println('  }');
  out.println('}');

} finally {
  out.close();
}
project.setProperty("srcString", sout.toString() );
