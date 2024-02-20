"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReloadOutlined, ClearOutlined } from "@ant-design/icons";
import { Row, Col, Tooltip } from "antd";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import {
  faFloppyDisk,
  faKey,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchApi } from "@/app/_modules/func";

export default function CacheList() {
  const { push } = useRouter();

  return (
    <PageContainer title={false}>
      <Row gutter={8}>
        <Col span={8}>
          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faFloppyDisk} />
                <span style={{ marginLeft: 6 }}>缓存列表</span>
              </>
            }
            extra={
              <Tooltip title="刷新">
                <a>
                  <ReloadOutlined />
                </a>
              </Tooltip>
            }
            headerBordered
            bordered
            hoverable
          >
            1
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faKey} />
                <span style={{ marginLeft: 6 }}>键名列表</span>
              </>
            }
            extra={
              <Tooltip title="刷新">
                <a>
                  <ReloadOutlined />
                </a>
              </Tooltip>
            }
            headerBordered
            bordered
            hoverable
          >
            2
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faFileLines} />
                <span style={{ marginLeft: 6 }}>缓存内容</span>
              </>
            }
            extra={
              <Tooltip title="清空">
                <a>
                  <ClearOutlined />
                </a>
              </Tooltip>
            }
            headerBordered
            bordered
            hoverable
          >
            3
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
}
