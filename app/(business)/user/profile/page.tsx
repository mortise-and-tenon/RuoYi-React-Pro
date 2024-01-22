"use client";

import { UserDetailInfo } from "@/app/_modules/definies";
import {
  PageContainer,
  ProCard,
  ProDescriptions,
} from "@ant-design/pro-components";
import { Divider, Upload, message, Flex, Row, Col } from "antd";

import type { GetProp, UploadProps } from "antd";

import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { faSitemap, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";

const user: UserDetailInfo = {
  userName: "admin",
  phonenumber: "13012345678",
  email: "awu@qq.com",
  deptName: "研发部",
  postGroup: "董事长",
  roleName: "超级管理员",
  nickName: "若依",
  sex: 1,
  createTime: "2023-04-23 16:11:38",
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(
    "https://images.bookhub.tech/avatar/avatar1.jpeg"
  );

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <PageContainer>
      <ProCard gutter={[16, 16]}>
        <ProCard
          colSpan="30%"
          title="个人信息"
          headerBordered
          bordered
          hoverable
        >
          <Row>
            <Col md={8} xs={0}></Col>
            <Col md={8} xs={24}>
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
            <Col md={8} xs={0}></Col>
          </Row>
        <Divider/>
          <ProDescriptions column={1}>
            <ProDescriptions.Item
              label={
                <>
                  <UserOutlined />
                  用户名
                </>
              }
            >
              {user.userName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={
                <>
                  <PhoneOutlined />
                  手机号码
                </>
              }
            >
              {user.phonenumber}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={
                <>
                  <MailOutlined />
                  用户邮箱
                </>
              }
            >
              {user.email}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={
                <>
                  <FontAwesomeIcon icon={faSitemap} />
                  所属部门
                </>
              }
            >
              {user.deptName}/{user.postGroup}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={
                <>
                  <FontAwesomeIcon icon={faUsers} />
                  所属角色
                </>
              }
            >
              {user.roleName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label={
                <>
                  <CalendarOutlined />
                  创建日期
                </>
              }
            >
              {user.createTime}
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
        <ProCard title="基本资料" headerBordered bordered hoverable>
          Auto
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
