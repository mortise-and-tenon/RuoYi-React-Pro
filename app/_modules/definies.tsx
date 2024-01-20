//登录请求
export type LoginReq = {
    username: string,
    password: string,
    code: string,
    uuid: string
}

//用户简单信息
export type UserInfo = {
    nickName:string,
    avatar: string,
}