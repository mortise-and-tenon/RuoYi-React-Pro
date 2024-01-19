"use client";
import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  setAlpha,
} from "@ant-design/pro-components";
import { Button, Divider, Space, Tabs, message, theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";

export default function Login() {
  const { token } = theme.useToken();

  return (
    <ProConfigProvider>
      <div
        style={{
          backgroundColor: "white",
          height: "100vh",
        }}
      >
        <LoginFormPage
          // backgroundImageUrl="https://source.unsplash.com/random?wallpapers"
          backgroundImageUrl="./bg.jpg"
          logo="https://static.dongfangzan.cn/img/mortnon.svg"
          // backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title={<span style={{color: 'rgba(255,255,255,1)'}}>MorTnon RuoYi</span>}
          containerStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            backdropFilter: "blur(4px)",
          }}
          subTitle={<span style={{color: 'rgba(255,255,255,.8)'}}>MorTnon，高质量的快速开发框架</span>}
          actions={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p style={{color: 'rgba(255,255,255,.6)'}}>
              ©{new Date().getFullYear()} Mortnon.
              </p>
            </div>
          }
        >
          <Divider style={{color: "rgba(255,255,255,1)"}}>账号密码登录</Divider>
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"用户名: admin"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"密码: mortnon"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: "right",
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
}
