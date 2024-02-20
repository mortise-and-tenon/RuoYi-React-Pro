"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReloadOutlined, ClearOutlined } from "@ant-design/icons";
import { Row, Col, Tooltip, Table,Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import {
  faFloppyDisk,
  faKey,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchApi } from "@/app/_modules/func";

//查询缓存
const queryCacheAPI = "/api/monitor/cache/getNames";

export default function CacheList() {
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [cacheData, setCacheData] = useState([]);

  //查询缓存
  const queryCache = async () => {
    const body = await fetchApi(queryCacheAPI, push);
    if (body !== undefined) {
      if (body.code == 200) {
        setCacheData(body.data);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    queryCache();
  }, []);

  //缓存列定义
  const cacheColumns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "缓存名称",
      dataIndex: "cacheName",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => [
        <Button
          key="deleteBtn"
          type="link"
          danger
          icon={<DeleteOutlined />}
          // onClick={() => onClickDeleteRow(record)}
        >
          
        </Button>,
      ],
    },
  ];

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
            <Table
              dataSource={cacheData}
              columns={cacheColumns}
              loading={isLoading}
            />
            ;
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
