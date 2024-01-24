"use client";

import { fetchApi, fetchFile } from "@/app/_modules/func";
import {
  ClearOutlined,
  DeleteOutlined,
  ImportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ProColumns, ProFormInstance } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Space, Tag, Checkbox } from "antd";
import { useRouter } from "next/navigation";

import {
  faCheck,
  faXmark,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState, useRef } from "react";

export type TableListItem = {
  operId: string;
  title: string;
  businessType: string;
  operName: string;
  operIp: string;
  operLocation: string;
  status: string;
  operTime: string;
  costTime: string;
};

//表格列定义
const columns: ProColumns<TableListItem>[] = [
  {
    title: "日志编号",
    dataIndex: "operId",
    search: false,
  },
  {
    title: "系统模块",
    dataIndex: "title",
    order: 9,
  },
  {
    title: "操作类型",
    dataIndex: "businessType",
    order: 7,
    valueEnum: {
      1: {
        text: "新增",
        status: "1",
      },
      2: {
        text: "修改",
        status: "2",
      },
      3: {
        text: "删除",
        status: "3",
      },
      4: {
        text: "授权",
        status: "4",
      },
      5: {
        text: "导出",
        status: "5",
      },
      6: {
        text: "导入",
        status: "6",
      },
      7: {
        text: "强退",
        status: "7",
      },
      8: {
        text: "生成代码",
        status: "8",
      },
      9: {
        text: "清空数据",
        status: "9",
      },
      0: {
        text: "其他",
        status: "0",
      },
    },
  },
  {
    title: "操作人员",
    dataIndex: "operName",
    sorter: true,
    order: 8,
  },
  {
    title: "操作地址",
    dataIndex: "operIp",
    order: 10,
  },
  {
    title: "操作地点",
    dataIndex: "operLocation",
    search: false,
  },
  {
    title: "操作状态",
    dataIndex: "status",
    valueType: "select",
    render: (_, record) => {
      return (
        <Space>
          <Tag
            color={record.status == 0 ? "green" : "red"}
            icon={
              record.status == 0 ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faXmark} />
              )
            }
          >
            {_}
          </Tag>
        </Space>
      );
    },
    valueEnum: {
      0: {
        text: "成功",
        status: "0",
      },
      1: {
        text: "失败",
        status: "1",
      },
    },
    order: 6,
  },
  {
    title: "操作日期",
    dataIndex: "operTime",
    valueType: "datetime",
    search: false,
    sorter: true,
  },
  {
    title: "操作日期",
    dataIndex: "operTimeRange",
    valueType: "dateRange",
    hideInTable: true,
    order: 5,
    search: {
      transform: (value) => {
        return {
          "params[beginTime]": `${value[0]} 23:59:59`,
          "params[endTime]": `${value[1]} 23:59:59`,
        };
      },
    },
  },
  {
    title: "消耗时间",
    dataIndex: "costTime",
    sorter: true,
    search: false,
    render: (_, record) => {
      return <span>{_}毫秒</span>;
    },
  },
  {
    title: "操作",
    key: "option",
    search: false,
    render: () => [<a key="link">详情</a>],
  },
];

export default function OperLog() {
  const { push } = useRouter();

  //查询日志数据
  const getLog = async (params, sorter, filter) => {
    const searchParams = {
      pageNum: params.current,
      ...params,
    };

    delete searchParams.current;

    console.log("params:", searchParams);

    const body = await fetchApi(
      `/api/monitor/operlog/list?${new URLSearchParams(searchParams)}`,
      push
    );
    console.log("data:", body);
    return body;
  };

  //选中行操作
  const [selectedRowKeys, setSelectedRowKeys] = useState<[]>([]);
  const rowSelection = {
    onChange: (newSelectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${newSelectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  //搜索栏显示状态
  const [showSearch, setShowSearch] = useState(true);
  //action对象引用
  const actionRef = useRef<ProFormInstance>();
  //表单对象引用
  const formRef = useRef<ProFormInstance>();

  //当前页数和每页条数
  const [page, setPage] = useState(1);
  const defualtPageSize = 10;
  const [pageSize, setPageSize] = useState(defualtPageSize);

  const pageChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  //导出日志文件
  const exportTable = async () => {
    if (formRef.current) {
      const formData = new FormData();

      const data = {
        pageNum: page,
        pageSize: pageSize,
        ...formRef.current.getFieldsValue(),
      };

      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      await fetchFile(
        "/api/monitor/operlog/export",
        push,
        {
          method: "POST",
          body: formData,
        },
        "operlog.xlsx"
      );
    }
  };

  return (
    <PageContainer>
      <ProTable<TableListItem>
        formRef={formRef}
        rowKey={(record) => record.operId}
        rowSelection={{
          selectedRowKeys,
          ...rowSelection,
        }}
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          const data = await getLog(params, sorter, filter);
          if (data !== undefined) {
            return Promise.resolve({
              data: data.rows,
              success: true,
              total: data.total,
            });
          }
          return Promise.resolve({
            data: [],
            success: true,
          });
        }}
        pagination={{
          pageSize: defualtPageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: pageChange,
        }}
        search={
          showSearch
            ? {
                defaultCollapsed: false,
                searchText: "搜索",
              }
            : false
        }
        dateFormatter="string"
        actionRef={actionRef}
        toolbar={{
          actions: [
            <Button key="danger" danger icon={<DeleteOutlined />}>
              删除
            </Button>,
            <Button key="clear" danger icon={<ClearOutlined />}>
              清空
            </Button>,
            <Button
              key="export"
              type="primary"
              icon={<ImportOutlined />}
              onClick={exportTable}
            >
              导出
            </Button>,
          ],
          settings: [
            {
              key: "switch",
              icon: showSearch ? (
                <FontAwesomeIcon icon={faToggleOn} />
              ) : (
                <FontAwesomeIcon icon={faToggleOff} />
              ),
              tooltip: showSearch ? "隐藏搜索栏" : "显示搜索栏",
              onClick: (key: string) => {
                setShowSearch(!showSearch);
              },
            },
            {
              key: "refresh",
              tooltip: "刷新",
              icon: <ReloadOutlined />,
              onClick: (key: string) => {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              },
            },
          ],
        }}
      />
    </PageContainer>
  );
}
