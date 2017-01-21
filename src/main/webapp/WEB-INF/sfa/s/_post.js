"use strict";

response.reset();
response.setHeader('Cache-Control', 'no-cache');
response.setHeader('Pragma', 'no-cache');
response.setIntHeader('Expires', 0);
response.setContentType('application/json;charset=UTF-8');

var out = response.getWriter();
try {
  out.write(JSON.stringify(dto.resData) );
} finally {
  out.close();
}
