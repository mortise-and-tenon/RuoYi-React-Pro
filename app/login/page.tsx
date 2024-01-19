"use client";
import {
  LockOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText
} from "@ant-design/pro-components";
import { Button, Divider, theme } from "antd";

import Image from "next/image";
import { useEffect, useState } from "react";

type Captcha = {
  img: string,
  uuid:string
}

export default function Login() {
  const [captcha,setCaptcha]= useState({} as Captcha);

  const getCaptcha = async ()=>{
    try {
      const response = await fetch("/api/captchaImage");
      if (response.ok) {
        const data = await response.json();
        console.log("data:",data);

        const imagePrefix ="data:image/gif;base64,";

        const captchaData:Captcha = {
          img:imagePrefix + data.img,
          uuid: data.uuid,
        }
        
        setCaptcha(captchaData);
        
      } else {

      }
    } catch (error) {

    } finally {
      
    }
  }

  useEffect(()=>{
    getCaptcha();
  },[]);

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
            placeholder={"用户名: admin or user"}
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
            placeholder={"密码: ant.design"}
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          />
          <div style={{
             display: 'flex',
             justifyContent: 'center',
             flexDirection: 'row',
          }}>
          <ProFormText
              name="code"
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
              placeholder={"验证码"}
              rules={[
                {
                  required: true,
                  message: "请输入验证码!",
                },
              ]}
            />
            <div style={{margin: "0 0 0 8px"}}>
            <img src={captcha.img} width={80} height={40} alt="captcha" onClick={getCaptcha}/>
            </div>
            </div>
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
