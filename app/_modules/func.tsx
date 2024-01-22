//拼接认证头数据
export function AuthHeader(token: string) {
  return "Bearer " + token;
}
