<%@page import="java.io.File" %>
<%@page import="java.io.FileInputStream" %>
<%@page import="java.io.InputStreamReader" %>
<%@page import="java.io.Writer" %>
<%@page import="java.io.Reader" %>
<%@page import="java.io.StringReader" %>
<%@page import="java.util.Map" %>
<%@page import="java.util.HashMap" %>
<%@page import="javax.script.ScriptEngine" %>
<%@page import="javax.script.ScriptEngineManager" %>
<%!

private final String baseDir = null;

private final String[] srcList = {
    "jquery-3.1.1.min.js",
    "main.js"
  };

private static final Map<String,String> srcMap =
    new HashMap<String,String>();

private final Reader getResourceAsReader(String path)
throws Exception {
  String src = srcMap.get(path);
  if (src != null) {
    return new StringReader(src);
  }
  File dir = new File(baseDir != null? baseDir :
    getServletContext().getRealPath("/WEB-INF/sfa") );
  File file = new File(dir, path);
  if (!file.exists() ) {
    return null;
  } else if (!file.getCanonicalPath().startsWith(dir.getCanonicalPath() ) ) {
    return null;
  }
  return new InputStreamReader(new FileInputStream(file), "UTF-8");
}

%><%

final String type = request.getParameter("type");

if ("c".equals(type) ) {

  String src = request.getParameter("src");

  Reader in = getResourceAsReader("c/" + src);
  if (in == null) {
    response.sendError(HttpServletResponse.SC_NOT_FOUND);
    return;
  }

  try {

    response.reset();
    if (src.endsWith(".js") ) {
      response.setContentType("text/javascript;charset=UTF-8");
    } else if (src.endsWith(".json") ) {
      response.setContentType("application/json;charset=UTF-8");
    } else if (src.endsWith(".css") ) {
      response.setContentType("text/css;charset=UTF-8");
    } else {
      response.setContentType("text/plain;charset=UTF-8");
    }

    Writer _out = response.getWriter();
    try {
      char[] buf = new char[4096];
      int len;
      while ( (len = in.read(buf) ) != -1) {
        _out.write(buf, 0, len);
      }
    } finally {
      _out.close();
    }
  } finally {
    in.close();
  }

} else if ("s".equals(type) ) {

  String[] svSrcList = {
      "_pre.js",
      request.getParameter("src"),
      "_post.js" };
  ScriptEngine se = new ScriptEngineManager().
      getEngineByName("javascript");
  se.put("request", request);
  se.put("response", response);
  for (String src : svSrcList) {
    Reader in = getResourceAsReader("s/" + src);
    try {
      se.put(ScriptEngine.FILENAME, src);
      se.eval(in);
    } finally {
      in.close();
    }
  }

} else {

  response.reset();
  response.setContentType("text/html;charset=UTF-8");

  Writer _out = response.getWriter();
  try {
    _out.write("<!doctype html>");
    _out.write("<html>");
    _out.write("<head>");
    _out.write("<meta http-equiv=\"Content-Type\"");
    _out.write(" content=\"text/html;charset=UTF-8\" />");
    _out.write("<link rel=\"stylesheet\" type=\"text/css\"");
    _out.write(" href=\"?type=c&src=style.css\" />");
    for (String src : srcList) {
      _out.write("<script src=\"?type=c&src=");
      _out.write(src);
      _out.write("\"></script>");
    }
    _out.write("</head>");
    _out.write("<body>");
    _out.write("</body>");
    _out.write("</html>");
  } finally {
    _out.close();
  }
}
%><%!
//src
%>
