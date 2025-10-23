/**
 * 统一API响应格式
 */

// 成功响应
const successResponse = (data = null, msg = '操作成功') => {
  return {
    code: 0,
    msg: msg,
    data: data
  };
};

// 失败响应
const errorResponse = (msg = '操作失败', code = -1) => {
  return {
    code: code,
    msg: msg,
    data: null
  };
};

module.exports = {
  successResponse,
  errorResponse
};