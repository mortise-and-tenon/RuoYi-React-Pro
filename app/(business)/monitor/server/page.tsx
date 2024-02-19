"use client";

import { fetchApi } from "@/app/_modules/func";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Statistic, Divider, Table } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  faMicrochip,
  faMemory,
  faServer,
  faMugHot,
  faHardDrive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//查询API
const queryAPI = "/api/monitor/server";

export default function Server() {
  const { push } = useRouter();
  const [data, setData] = useState(undefined as any);

  const columns: TableProps["columns"] = [
    {
      title: "盘符路径",
      dataIndex: "dirName",
      key: "dirName",
    },
    {
      title: "文件系统",
      dataIndex: "sysTypeName",
      key: "sysTypeName",
    },
    {
      title: "盘符类型",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "总大小",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "可用大小",
      dataIndex: "free",
      key: "free",
    },
    {
      title: "已用大小",
      dataIndex: "used",
      key: "used",
    },
    {
      title: "已用百分比",
      dataIndex: "usage",
      key: "usage",
      render: (text) => <>{text}%</>,
    },
  ];

  //查询数据
  const queryData = async () => {
    const body = await fetchApi(queryAPI, push);
    if (body !== undefined) {
      if (body.code == 200) {
        console.log("data:", body.data);
        setData(body.data);
      }
    }
  };

  useEffect(() => {
    queryData();
  }, []);

  return (
    <PageContainer title={false}>
      {data !== undefined && (
        <ProCard gutter={[16, 16]} style={{ marginBlockStart: 16 }} wrap>
          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faMicrochip} />
                <span style={{ marginLeft: 6 }}>CPU</span>
              </>
            }
            direction="row"
            bordered
            hoverable
          >
            <ProCard>
              <Statistic title="核心数" value={data.cpu.cpuNum} />
            </ProCard>
            <Divider type="vertical" />
            <ProCard>
              <Statistic title="用户使用率" value={data.cpu.used} suffix="%" />
            </ProCard>
            <Divider type="vertical" />
            <ProCard>
              <Statistic title="系统使用率" value={data.cpu.sys} suffix="%" />
            </ProCard>
            <Divider type="vertical" />
            <ProCard>
              <Statistic title="当前空闲率" value={data.cpu.free} suffix="%" />
            </ProCard>
          </ProCard>

          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faMemory} />
                <span style={{ marginLeft: 6 }}>内存</span>
              </>
            }
            direction="row"
            bordered
            hoverable
          >
            <ProCard title="总内存">
              <Statistic title="内存" value={data.mem.total} suffix="G" />
              <Statistic title="JVM" value={data.jvm.total} suffix="M" />
            </ProCard>
            <ProCard title="已用内存">
              <Statistic title="内存" value={data.mem.used} suffix="G" />
              <Statistic title="JVM" value={data.jvm.used} suffix="M" />
            </ProCard>
            <ProCard title="剩余内存">
              <Statistic title="内存" value={data.mem.free} suffix="G" />
              <Statistic title="JVM" value={data.jvm.free} suffix="M" />
            </ProCard>
            <ProCard title="使用率">
              <Statistic
                title="内存"
                value={data.mem.usage}
                suffix="%"
                valueStyle={{ color: "#cf1322" }}
              />
              <Statistic title="JVM" value={data.jvm.usage} suffix="%" />
            </ProCard>
          </ProCard>

          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faServer} />
                <span style={{ marginLeft: 6 }}>服务器信息</span>
              </>
            }
            direction="row"
            bordered
            hoverable
          >
            <ProCard>
              <Statistic title="服务器名称" value={data.sys.computerName} />
            </ProCard>
            <ProCard>
              <Statistic title="服务器IP" value={data.sys.computerIp} />
            </ProCard>
            <ProCard>
              <Statistic title="操作系统" value={data.sys.osName} />
            </ProCard>
            <ProCard>
              <Statistic title="系统架构" value={data.sys.osArch} />
            </ProCard>
          </ProCard>

          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faMugHot} />
                <span style={{ marginLeft: 6 }}>Java虚拟机信息</span>
              </>
            }
            direction="row"
            bordered
            hoverable
          >
            <ProCard>
              <Statistic title="名称" value={data.jvm.name} />
              <Statistic title="版本" value={data.jvm.version} />
              <Statistic title="安装路径" value={data.jvm.home} />
              <Statistic title="项目路径" value={data.sys.userDir} />
            </ProCard>
            <ProCard>
              <Statistic title="启动时间" value={data.jvm.startTime} />
              <Statistic title="运行时长" value={data.jvm.runTime} />
              <Statistic title="运行参数" value={data.jvm.inputArgs} />
            </ProCard>
          </ProCard>

          <ProCard
            title={
              <>
                <FontAwesomeIcon icon={faHardDrive} />
                <span style={{ marginLeft: 6 }}>磁盘状态</span>
              </>
            }
            bordered
            hoverable
          >
            <Table columns={columns} dataSource={data.sysFiles} />
          </ProCard>
        </ProCard>
      )}
    </PageContainer>
  );
}
