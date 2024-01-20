"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Divider, Spin, theme, message } from "antd";
import { useRouter } from "next/navigation";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../authProvider";
import { LoginReq } from "../_modules/definies";

type Captcha = {
  img: string;
  uuid: string;
};

export default function Login() {
  //验证码数据
  const [captcha, setCaptcha] = useState({} as Captcha);
  //是否展示验证码框
  const [showCaptcha, setShowCaptcha] = useState(false);
  //验证码加载状态
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  const { setIsLogin, setUserToken } = useContext(AuthContext);

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
  }, []);

  const router = useRouter();

  //提交登录
  const userLogin = async (values) => {
    const loginData: LoginReq = {
      username: values.username,
      password: values.password,
      code: values.code,
      uuid: captcha.uuid,
    };

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        console.log("resp:", data);

        if (data.code == 200) {
          message.open({
            type: "success",
            content: "登录成功",
          });

          setIsLogin(true);
          setUserToken(data.token);

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
          backgroundImageUrl="./bg.jpg"
          logo="https://static.dongfangzan.cn/img/mortnon.svg"
          title={
            <span style={{ color: "rgba(255,255,255,1)" }}>MorTnon RuoYi</span>
          }
          containerStyle={{
            backgroundColor: "rgba(0,0,0,0)",
            backdropFilter: "blur(4px)",
          }}
          subTitle={
            <span style={{ color: "rgba(255,255,255,.8)" }}>
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
          <Divider style={{ color: "rgba(255,255,255,1)" }}>
            账号密码登录
          </Divider>
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
              placeholder={"密码: admin123"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
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
                      message: "请输入验证码!",
                    },
                  ]}
                />

                <div style={{ margin: "0 0 0 8px" }}>
                  <Spin spinning={isLoadingImg}>
                    {captcha.img === undefined ? (
                      <div style={{ width: 80, height: 40 }}></div>
                    ) : (
                      <img
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
              自动登录
            </ProFormCheckbox>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
}
