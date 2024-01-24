"use client";

import { fetchApi, fetchFile } from "@/app/_modules/func";
import {
  ClearOutlined,
  DeleteOutlined,
  EyeOutlined,
  ImportOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import type { ProColumns, ProFormInstance } from "@ant-design/pro-components";
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Modal, Space, Tag, message } from "antd";
import { useRouter } from "next/navigation";

import {
  faCheck,
  faToggleOff,
  faToggleOn,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRef, useState } from "react";

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

export default function OperLog() {
  const { push } = useRouter();

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
      render: (_, record) => [
        <Button
          key={record.operId}
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showRowModal(record)}
        >
          详情
        </Button>,
      ],
    },
  ];

  //查询日志数据
  const getLog = async (params, sorter, filter) => {
    const searchParams = {
      pageNum: params.current,
      ...params,
    };

    delete searchParams.current;

    const body = await fetchApi(
      `/api/monitor/operlog/list?${new URLSearchParams(searchParams)}`,
      push
    );
    console.log("data:", body);
    return body;
  };

  //删除按钮是否可用，选中行时才可用
  const [rowCanDelete, setRowCanDelete] = useState(false);

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
      setRowCanDelete(newSelectedRowKeys && newSelectedRowKeys.length > 0);
    },
  };

  //是否打开删除日志数据对话框
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //是否处于确认状态中
  const [confirmLoading, setConfirmLoading] = useState(false);

  //是否打开清空日志对话框
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  //点击删除按钮
  const onClickDeleteRow = () => {
    setIsDeleteModalOpen(true);
  };

  //点击清空按钮
  const onClickClear = () => {
    setIsClearModalOpen(true);
  };

  //关闭删除日志对话框
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  //关闭清空日志对话框
  const closeClearModal = () => {
    setIsClearModalOpen(false);
  };

  //确定删除选中的日志数据
  const executeDeleteRow = async () => {
    setConfirmLoading(true);
    const body = await fetchApi(
      `/api/monitor/operlog/${selectedRowKeys.join(",")}`,
      push,
      {
        method: "DELETE",
      }
    );
    if (body !== undefined) {
      if (body.code == 200) {
        message.success("删除成功");
        setIsDeleteModalOpen(false);
      } else {
        message.error(body.msg);
      }
    }
    setConfirmLoading(false);
  };

  //确定清空日志数据
  const executeClear = async () => {
    setConfirmLoading(true);

    const body = await fetchApi("/api/monitor/operlog/clean", push, {
      method: "DELETE",
    });

    if (body !== undefined) {
      if (body.code == 200) {
        message.success("清空成功");
        setIsClearModalOpen(false);
      } else {
        message.error(body.msg);
      }
    }

    setConfirmLoading(false);
  };

  //控制是否展示行详情模态框
  const [isModalOpen, setIsModalOpen] = useState(false);

  //关闭行详情展示
  function closeRowModal() {
    setIsModalOpen(false);
  }

  const [selectedRow, setSelectedRow] = useState(undefined as any);

  //展示行详情
  function showRowModal(record) {
    setIsModalOpen(true);
    setSelectedRow(record);
  }

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
            <Button
              key="danger"
              danger
              icon={<DeleteOutlined />}
              disabled={!rowCanDelete}
              onClick={onClickDeleteRow}
            >
              删除
            </Button>,
            <Button
              key="clear"
              danger
              icon={<ClearOutlined />}
              onClick={onClickClear}
            >
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
      <Modal
        title={
          <>
            <ExclamationCircleFilled style={{ color: "#faad14" }} /> 系统提示
          </>
        }
        open={isDeleteModalOpen}
        onOk={executeDeleteRow}
        onCancel={closeDeleteModal}
        confirmLoading={confirmLoading}
      >
        是否确认删除日志编号为“{selectedRowKeys.join(",")}”的数据项？
      </Modal>

      <Modal
        title={
          <>
            <ExclamationCircleFilled style={{ color: "#faad14" }} /> 系统提示
          </>
        }
        open={isClearModalOpen}
        onOk={executeClear}
        onCancel={closeClearModal}
        confirmLoading={confirmLoading}
      >
        是否确认清空所有操作日志数据项？
      </Modal>

      {selectedRow !== undefined && (
        <Modal
          title="操作日志详情"
          footer={<Button onClick={closeRowModal}>关闭</Button>}
          open={isModalOpen}
          onCancel={closeRowModal}
        >
          <ProDescriptions column={10}>
            <ProDescriptions.Item span={3} label="操作模块">
              {selectedRow.title} /
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={2}
              valueEnum={{
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
              }}
            >
              {selectedRow.businessType}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={5} label="请求地址">
              {selectedRow.operUrl}
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={6}>
            <ProDescriptions.Item span={3} label="登录信息">
              {selectedRow.operName}/{selectedRow.operIp}/
              {selectedRow.operLocation}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={3} label="请求方式">
              {selectedRow.requestMethod}
            </ProDescriptions.Item>

            <ProDescriptions.Item span={6} label="操作方法">
              {selectedRow.method}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={6} label="请求参数">
              {selectedRow.operParam}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={6} label="返回参数">
              {selectedRow.jsonResult}
            </ProDescriptions.Item>
          </ProDescriptions>

          <ProDescriptions column={8}>
            <ProDescriptions.Item
              span={2}
              label="操作状态"
              valueEnum={{
                0: {
                  text: "成功",
                  status: "0",
                },
                1: {
                  text: "失败",
                  status: "1",
                },
              }}
            >
              {selectedRow.status}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="消耗时间">
              {selectedRow.costTime}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={4} label="操作时间">
              {selectedRow.operTime}
            </ProDescriptions.Item>
          </ProDescriptions>
          {selectedRow.errorMsg && (
            <ProDescriptions>
              <ProDescriptions.Item label="异常信息">
                {selectedRow.errorMsg}
              </ProDescriptions.Item>
            </ProDescriptions>
          )}
        </Modal>
      )}
    </PageContainer>
  );
}
