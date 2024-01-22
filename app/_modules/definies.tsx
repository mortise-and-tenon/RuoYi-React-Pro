import { ReactNode } from "react"

//登录请求
export type LoginReq = {
    username: string,
    password: string,
    code: string,
    uuid: string
}

//用户简单信息定义
export type UserInfo = {
    nickName:string,
    avatar: string,
}

//路由/菜单定义
export type RouteInfo = {
    path:string,
    name?:string,
    icon?: ReactNode,
    routes?: Array<RouteInfo>
}