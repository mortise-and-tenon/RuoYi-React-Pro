"use client";

import { fetchApi, fetchFile } from "@/app/_modules/func";
import {
  ClearOutlined,
  DeleteOutlined,
  EyeOutlined,
  ImportOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
  UnlockOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ProColumns, ProFormInstance } from "@ant-design/pro-components";
import {
  PageContainer,
  ProDescriptions,
  ProTable,
  ProCard,
  ProForm,
  ModalForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormCheckbox,
  ProFormRadio,
  ProFormTextArea,
} from "@ant-design/pro-components";
import {
  Button,
  Modal,
  Space,
  Tag,
  message,
  Flex,
  Input,
  Row,
  Col,
  Switch,
} from "antd";
import { useRouter } from "next/navigation";

import {
  faCheck,
  faToggleOff,
  faToggleOn,
  faXmark,
  faDownload,
  faUpload,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRef, useState } from "react";
import { Tooltip } from "@/node_modules/antd/es/index";

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

export default function User() {
  const { push } = useRouter();

  //控制行的状态值的恢复
  const [rowStatusMap, setRowStatusMap] = useState<{ [key: number]: boolean }>(
    {}
  );

  //表格列定义
  const columns: ProColumns<TableListItem>[] = [
    {
      title: "用户编号",
      dataIndex: "userId",
      search: false,
    },
    {
      title: "用户名称",
      dataIndex: "userName",
      order: 4,
    },
    {
      title: "用户昵称",
      dataIndex: "nickName",
      search: false,
    },
    {
      title: "部门名称",
      key: "deptName",
      search: false,
      render: (text, record) => record.dept.deptName,
    },

    {
      title: "手机号",
      dataIndex: "phonenumber",
      order: 3,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      order: 2,
      valueEnum: {
        0: {
          text: "正常",
          status: "0",
        },
        1: {
          text: "停用",
          status: "1",
        },
      },
      render: (text, record) => {
        return (
          <Space>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={record.status === "0"}
              checked={rowStatusMap[record.userId]}
              disabled={record.userId == 1}
              onChange={(checked, event) => {
                showSwitchUserStatusModal(checked, record);
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "datetime",
      search: false,
      sorter: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTimeRange",
      valueType: "dateRange",
      hideInTable: true,
      order: 1,
      search: {
        transform: (value) => {
          return {
            "params[beginTime]": `${value[0]} 00:00:00`,
            "params[endTime]": `${value[1]} 23:59:59`,
          };
        },
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

  //查询用户数据
  const getUser = async (params, sorter, filter) => {
    const searchParams = {
      pageNum: params.current,
      ...params,
    };

    delete searchParams.current;

    const queryParams = new URLSearchParams(searchParams);

    Object.keys(sorter).forEach((key) => {
      queryParams.append("orderByColumn", key);
      if (sorter[key] === "ascend") {
        queryParams.append("isAsc", "ascending");
      } else {
        queryParams.append("isAsc", "descending");
      }
    });

    const body = await fetchApi(`/api/system/user/list?${queryParams}`, push);
    console.log("data:", body);

    if (body !== undefined) {
      body.rows.forEach((row) => {
        setRowStatusMap({ ...rowStatusMap, [row.userId]: row.status === "0" });
      });
    }

    return body;
  };

  //展示切换用户状态对话框
  const showSwitchUserStatusModal = (checked: boolean, record) => {
    setRowStatusMap({ ...rowStatusMap, [record.userId]: checked });

    Modal.confirm({
      title: "系统提示",
      icon: <ExclamationCircleFilled />,
      content: `确认要${checked ? "启用" : "停用"}"${record.userName}"用户吗？`,
      onOk() {
        executeSwitchStatus(checked, record.userId, () => {
          setRowStatusMap({ ...rowStatusMap, [record.userId]: !checked });
        });
      },
      onCancel() {
        setRowStatusMap({ ...rowStatusMap, [record.userId]: !checked });
      },
    });
  };

  //确认变更用户状态
  const executeSwitchStatus = async (
    checked: boolean,
    userId: string,
    erroCallback: () => {}
  ) => {
    const modifyData = {
      userId: userId,
      status: checked ? "0" : "1",
    };
    const body = await fetchApi(`/api/system/user/changeStatus`, push, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifyData),
    });

    if (body !== undefined) {
      if (body.code == 200) {
        message.success(body.msg);
      } else {
        message.error(body.msg);
        erroCallback();
      }
    }
  };

  //是否展示添加用户对话框
  const [showAddModal, setShowAddModal] = useState(false);

  //删除按钮是否可用，选中行时才可用
  const [rowCanDelete, setRowCanDelete] = useState(false);

  //选中行操作
  const [selectedRowKeys, setSelectedRowKeys] = useState<[]>([]);
  const [selectedRow, setSelectedRow] = useState(undefined as any);

  //修改按钮是否可用
  const [rowCanModify, setRowCanModify] = useState(false);

  const rowSelection = {
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setRowCanDelete(newSelectedRowKeys && newSelectedRowKeys.length > 0);

      if (newSelectedRowKeys && newSelectedRowKeys.length == 1) {
        setSelectedRow(selectedRows[0]);
        setRowCanModify(true);
      } else {
        setRowCanModify(false);
        setSelectedRow(undefined);
      }
    },
  };

  //确定新建用户
  const confirmAddUser = () => {};

  //关闭新建对话框
  const cancelAddUser = () => {
    setShowAddModal(false);
  };

  //点击修改按钮
  const onClickModifyRow = () => {
    console.log("修改");
  };

  //点击删除按钮
  const onClickDeleteRow = () => {
    Modal.confirm({
      title: "系统提示",
      icon: <ExclamationCircleFilled />,
      content: `是否确认删除用户编号为“${selectedRowKeys.join(",")}”的数据项？`,
      onOk() {
        executeDeleteRow();
      },
      onCancel() {},
    });
  };

  //点击导入按钮
  const onClickImport = () => {
    console.log("row:", selectedRow);
    Modal.confirm({
      title: "系统提示",
      icon: <ExclamationCircleFilled />,
      content: `导入`,
      onOk() {
        executeImport();
      },
      onCancel() {},
    });
  };

  //确定删除选中的日志数据
  const executeDeleteRow = async () => {
    const body = await fetchApi(
      `/api/system/user/${selectedRowKeys.join(",")}`,
      push,
      {
        method: "DELETE",
      }
    );
    if (body !== undefined) {
      if (body.code == 200) {
        message.success("删除成功");

        //删除按钮变回不可点击
        setRowCanDelete(false);
        //选中行数据重置为空
        setSelectedRowKeys([]);
        //刷新列表
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(body.msg);
      }
    }
  };

  //确认修改
  const executeModify = async () => {};

  //确定导入
  const executeImport = async (userName: string) => {
    const body = await fetchApi(
      `/api/monitor/logininfor/unlock/${userName}`,
      push
    );

    if (body !== undefined) {
      if (body.code == 200) {
        message.success("解锁成功");
        //刷新列表
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(body.msg);
      }
    }
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

  //导出用户
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
        "/api/system/user/export",
        push,
        {
          method: "POST",
          body: formData,
        },
        "user.xlsx"
      );
    }
  };

  return (
    <PageContainer>
      <Row gutter={{ xs: 8, sm: 8, md: 8 }}>
        <Col xs={24} sm={6} md={6}>
          <ProCard>
            <Input placeholder="请输入部门名称" />
          </ProCard>
        </Col>
        <Col xs={24} sm={18} md={18}>
          <ProTable<TableListItem>
            formRef={formRef}
            rowKey={(record) => record.userId}
            rowSelection={{
              selectedRowKeys,
              ...rowSelection,
            }}
            columns={columns}
            request={async (params, sorter, filter) => {
              // 表单搜索项会从 params 传入，传递给后端接口。
              console.log(params, sorter, filter);
              const data = await getUser(params, sorter, filter);
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
                <ModalForm<{
                  name: string;
                  company: string;
                }>
                  title="添加用户"
                  trigger={
                    <Button icon={<PlusOutlined />} type="primary">
                      新建
                    </Button>
                  }
                  // layout="horizontal"
                  // form={form}
                  autoFocusFirstInput
                  modalProps={{
                    destroyOnClose: true,
                    // onCancel: () => console.log('run'),
                  }}
                  submitTimeout={2000}
                  onFinish={async (values) => {
                    await waitTime(2000);
                    console.log(values.name);
                    message.success("提交成功");
                    return true;
                  }}
                >
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="nickName"
                      label="用户昵称"
                      placeholder="请输入用户昵称"
                    />

                    <ProFormText
                      width="md"
                      name="company"
                      label="归属部门"
                      placeholder="请选择归属部门"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="phoneNumber"
                      label="手机号码"
                      placeholder="请输入手机号码"
                    />
                    <ProFormText
                      width="md"
                      name="email"
                      label="邮箱"
                      placeholder="请输入邮箱"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="userName"
                      label="用户名称"
                      placeholder="请输入用户名称"
                    />
                    <ProFormText.Password
                      width="md"
                      name="password"
                      label="用户密码"
                      placeholder="请输入用户密码"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormSelect
                      request={async () => [
                        {
                          value: "chapter",
                          label: "盖章后生效",
                        },
                      ]}
                      width="md"
                      name="sex"
                      label="用户性别"
                    />
                    <ProFormRadio.Group
                      name="status"
                      width="sm"
                      label="状态"
                      value="0"
                      options={[
                        {
                          label: "正常",
                          value: "0",
                        },
                        {
                          label: "停用",
                          value: "1",
                        },
                      ]}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormSelect
                      request={async () => [
                        {
                          value: "chapter",
                          label: "盖章后生效",
                        },
                      ]}
                      width="md"
                      name="position"
                      label="岗位"
                    />
                    <ProFormSelect
                      request={async () => [
                        {
                          value: "chapter",
                          label: "盖章后生效",
                        },
                      ]}
                      width="md"
                      name="role"
                      label="角色"
                    />
                  </ProForm.Group>
                  
                    <ProFormTextArea
                      name="comment"
                      width="xl"
                      layout="horizontal"
                      label="备注"
                      placeholder="请输入内容"
                      // fieldProps={inputTextAreaProps}
                    />
                 
                </ModalForm>,
                <Button
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  disabled={!rowCanModify}
                  onClick={onClickModifyRow}
                >
                  修改
                </Button>,
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
                  key="import"
                  type="primary"
                  icon={<FontAwesomeIcon icon={faUpload} />}
                  onClick={onClickImport}
                >
                  导入
                </Button>,
                <Button
                  key="export"
                  type="primary"
                  icon={<FontAwesomeIcon icon={faDownload} />}
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
        </Col>
      </Row>
    </PageContainer>
  );
}
