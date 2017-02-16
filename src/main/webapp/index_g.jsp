<%@page import="java.io.File" %>
<%@page import="java.io.InputStream" %>
<%@page import="java.io.OutputStream" %>
<%@page import="java.io.FileInputStream" %>
<%@page import="java.io.BufferedInputStream" %>
<%@page import="java.io.BufferedOutputStream" %>
<%@page import="java.io.ByteArrayInputStream" %>
<%@page import="java.io.Reader" %>
<%@page import="java.io.Writer" %>
<%@page import="java.io.InputStreamReader" %>
<%@page import="java.util.Arrays" %>
<%@page import="java.util.List" %>
<%@page import="java.util.ArrayList" %>
<%@page import="java.util.Map" %>
<%@page import="java.util.HashMap" %>
<%@page import="javax.script.ScriptEngine" %>
<%@page import="javax.script.ScriptEngineManager" %>
<%!

private static final String baseDir = null;

private static final String[][] mimeTypes = {
  {".js", "text/javascript"},
  {".json", "application/json"},
  {".css", "text/css"},
  {".gif", "image/gif"},
  {".jpg", "image/jpg"},
  {".png", "image/png"}
}; 

private static final Map<String,byte[]> srcMap =
    new HashMap<String,byte[]>();

private final InputStream getResourceAsStream(String path)
throws Exception {
  byte[] src = srcMap.get(path);
  if (src != null) {
    return new ByteArrayInputStream(src);
  }
  //%%break%%
  File dir = new File(baseDir != null? baseDir :
    getServletContext().getRealPath("/WEB-INF/sfa") );
  File file = new File(dir, path);
  if (!file.exists() ) {
    return null;
  } else if (!file.getCanonicalPath().startsWith(dir.getCanonicalPath() ) ) {
    return null;
  }
  return new FileInputStream(file);
}

%><%

final String version = "%%version%%";
final String type = request.getParameter("type");

if ("c".equals(type) ) {

  String src = request.getParameter("src");

  InputStream in = getResourceAsStream("c/" + src);
  if (in == null) {
    response.sendError(HttpServletResponse.SC_NOT_FOUND);
    return;
  }

  in = new BufferedInputStream(in);

  try {

    response.reset();
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Pragma", "no-cache");
    response.setIntHeader("Expires", 0);

    String contentType = "application/octet-stream";
    for (String[] mimeType : mimeTypes) {
      if (src.endsWith(mimeType[0]) ) {
        contentType = mimeType[1];
        break;
      }
    }
    response.setContentType(contentType);

    OutputStream _out = new BufferedOutputStream(
        response.getOutputStream() );
    try {
      byte[] buf = new byte[4096];
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

  ScriptEngine se = new ScriptEngineManager().
      getEngineByName("javascript");

  List<String> svSrcList = new ArrayList<String>();
  if (se.get("JSON") == null) {
    svSrcList.add("_JSON.js");
  }
  svSrcList.add("_pre.js");
  svSrcList.add(request.getParameter("src") );
  svSrcList.add("_post.js");

  request.setAttribute("sfa-version", version);
  se.put("request", request);
  se.put("response", response);
  se.put("application", this);
  for (String src : svSrcList) {
    Reader in = new InputStreamReader(
        getResourceAsStream("s/" + src), "UTF-8");
    try {
      se.put(ScriptEngine.FILENAME, src);
      se.eval(in);
    } finally {
      in.close();
    }
  }

} else {

  String[] srcList = {
      "_jquery-3.1.1.min.js",
      "_main.js"
  };

  response.reset();
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Pragma", "no-cache");
  response.setIntHeader("Expires", 0);

  response.setContentType("text/html;charset=UTF-8");

  Writer _out = response.getWriter();
  try {
    _out.write("<!doctype html>");
    _out.write("<html>");
    _out.write("<head>");
    _out.write("<meta http-equiv=\"Content-Type\"");
    _out.write(" content=\"text/html;charset=UTF-8\" />");
    _out.write("<link rel=\"icon\" type=\"image/png\"");
    _out.write(" href=\"?type=c&src=_icon.png\" />");
    _out.write("<link rel=\"stylesheet\" type=\"text/css\"");
    _out.write(" href=\"?type=c&src=_style.css\" />");
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
//%%src%%
%>
