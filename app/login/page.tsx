"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Divider, message, Spin, theme } from "antd";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

import type { ProFormInstance } from "@ant-design/pro-components";

import Image from "next/image";

import { useEffect, useState, useRef } from "react";
import { LoginReq } from "../_modules/definies";
import { encrypt, decrypt } from "../_modules/func";

type Captcha = {
  img: string;
  uuid: string;
};

//cookies 记住的用户名 key
const cookie_username_key = "mortnon_username";
//cookies 记住的密码 key
const cookie_password_key = "mortnon_password";

export default function Login() {
  //验证码数据
  const [captcha, setCaptcha] = useState({} as Captcha);
  //是否展示验证码框
  const [showCaptcha, setShowCaptcha] = useState(false);
  //验证码加载状态
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  //获取验证码
  const getCaptcha = async () => {
    try {
      const response = await fetch("/api/captchaImage");
      if (response.ok) {
        const data = await response.json();

        setShowCaptcha(data.captchaEnabled);

        if (data.captchaEnabled) {
          const imagePrefix = "data:image/gif;base64,";

          const captchaData: Captcha = {
            img: imagePrefix + data.img,
            uuid: data.uuid,
          };

          setCaptcha(captchaData);
          setIsLoadingImg(false);
        }
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    getCaptcha();
    readUserNamePassword();
  }, []);

  const router = useRouter();

  //提交登录
  const userLogin = async (values: any) => {
    const loginData: LoginReq = {
      username: values.username,
      password: values.password,
      code: values.code,
      uuid: captcha.uuid,
    };

    //是否记住密码
    const autoLogin = values.autoLogin;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      //获得响应
      if (response.ok) {
        const data = await response.json();

        //登录成功
        if (data.code == 200) {
          message.success("登录成功");

          setCookie("token", data.token);

          //记住密码
          if (autoLogin) {
            rememberUserNamePassword(values.username, values.password);
          } else {
            removeUserNamePassword();
          }

          router.push("/");
        } else {
          message.open({
            type: "error",
            content: data.msg,
          });

          //异常，自动刷新验证码
          getCaptcha();
        }
      } else {
        const data = await response.json();

        message.open({
          type: "error",
          content: data.msg,
        });
      }
    } catch (error) {
      console.log("error:", error);
      message.open({
        type: "error",
        content: "登录发生异常，请重试",
      });
    } finally {
    }
  };

  //记住用户名密码到cookie
  const rememberUserNamePassword = (username: string, password: string) => {
    setCookie(cookie_username_key, encrypt(username));
    setCookie(cookie_password_key, encrypt(password));
  };

  //移除cookie中的用户名和密码
  const removeUserNamePassword = () => {
    deleteCookie(cookie_username_key);
    deleteCookie(cookie_password_key);
  };

  const loginFormRef = useRef<ProFormInstance>();

  //读取cookie中用户名密码，并填写到表单中
  const readUserNamePassword = () => {
    const username = getCookie(cookie_username_key);
    const password = getCookie(cookie_password_key);

    if (username !== undefined && password !== undefined) {
      if (loginFormRef) {
        loginFormRef.current.setFieldsValue({
          username: decrypt(username),
          password: decrypt(password),
          autoLogin: true,
        });
      }
    }
  };

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
          formRef={loginFormRef}
          backgroundImageUrl="/bg3.jpg"
          logo="https://static.dongfangzan.cn/img/mortnon.svg"
          title={(<span>MorTnon 若依后台管理</span>) as any}
          containerStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            backdropFilter: "blur(4px)",
          }}
          subTitle={
            <span style={{ color: "rgba(255,255,255,1)" }}>
              MorTnon，高质量的快速开发框架
            </span>
          }
          actions={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ color: "rgba(255,255,255,.6)" }}>
                ©{new Date().getFullYear()} Mortnon.
              </p>
            </div>
          }
          onFinish={userLogin}
        >
          <Divider>账号密码登录</Divider>
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
              placeholder={"用户名"}
              rules={[
                {
                  required: true,
                  message: "用户名不能为空",
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
              placeholder={"密码"}
              rules={[
                {
                  required: true,
                  message: "密码不能为空",
                },
              ]}
            />
            {showCaptcha && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
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
                      message: "验证码不能为空",
                    },
                  ]}
                />

                <div style={{ margin: "0 0 0 8px" }}>
                  <Spin spinning={isLoadingImg}>
                    {captcha.img === undefined ? (
                      <div style={{ width: 80, height: 40 }}></div>
                    ) : (
                      <Image
                        src={captcha.img}
                        width={80}
                        height={40}
                        alt="captcha"
                        onClick={getCaptcha}
                      />
                    )}
                  </Spin>
                </div>
              </div>
            )}
          </>
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              记住密码
            </ProFormCheckbox>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
}
