"use strict";

response.reset();
response.setContentType('application/json;charset=UTF-8');
var out = response.getWriter();
try {
  out.write(JSON.stringify(dto.resData));
} finally {
  out.close();
}
