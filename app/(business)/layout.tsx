"use client";

import type { ProSettings } from "@ant-design/pro-components";
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";

import { Input, Button } from "antd";

import Link from "next/link";

import defaultProps from "./_defaultProps";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pathname, setPathname] = useState("/index");

  const settings: ProSettings | undefined = {
    // fixSiderbar: true,
    layout: "mix",
    // splitMenus: true,
  };
  return (
    <ProLayout
      title="MorTnon RouYi"
      logo="https://static.dongfangzan.cn/img/mortnon.svg"
      {...defaultProps}
      onMenuHeaderClick={(e) => console.log(e)}
      menuItemRender={(item, dom) => (
        <div
          onClick={() => {
            setPathname(item.path || "/index");
          }}
        >
          <Link href={item.path}>{dom}</Link>
        </div>
      )}
      location={{
        pathname,
      }}
      avatarProps={{
        src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        size: "small",
        title: "Mortnon",
      }}
      actionsRender={(props) => {
        if (props.isMobile) return [];
        return [
          props.layout !== "side" && document.body.clientWidth > 1400 ? (
            <div
              key="SearchOutlined"
              aria-hidden
              style={{
                display: "flex",
                alignItems: "center",
                marginInlineEnd: 24,
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Input
                style={{
                  borderRadius: 4,
                  marginInlineEnd: 12,
                  backgroundColor: "rgba(0,0,0,0.03)",
                }}
                prefix={
                  <SearchOutlined
                    style={{
                      color: "rgba(0, 0, 0, 0.15)",
                    }}
                  />
                }
                placeholder="搜索方案"
                variant="borderless"
              />
              <PlusCircleFilled
                style={{
                  color: "var(--ant-primary-color)",
                  fontSize: 24,
                }}
              />
            </div>
          ) : undefined,
          <InfoCircleFilled key="InfoCircleFilled" />,
          <QuestionCircleFilled key="QuestionCircleFilled" />,
          <GithubFilled key="GithubFilled" />,
        ];
      }}
      menuFooterRender={(props) => {
        if (props?.collapsed) return undefined;
        return (
          <div
            style={{
              textAlign: "center",
              paddingBlockStart: 12,
            }}
          >
            <div>©2024 Mortnon.</div>
          </div>
        );
      }}
      {...settings}
    >
      <PageContainer>{children}</PageContainer>
    </ProLayout>
  );
}
