"use client";

import { fetchApi, fetchFile } from "@/app/_modules/func";
import {
  CaretDownOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  KeyOutlined,
  LoadingOutlined,
  CloudUploadOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import type { ProColumns, ProFormInstance } from "@ant-design/pro-components";
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from "@ant-design/pro-components";
import type { TreeDataNode, MenuProps, UploadProps, GetProp } from "antd";
import {
  Button,
  Col,
  Flex,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  Tree,
  Dropdown,
  Form,
  Upload,
  Typography,
  Checkbox,
} from "antd";
import { useRouter } from "next/navigation";

import {
  faDownload,
  faPenToSquare,
  faToggleOff,
  faToggleOn,
  faUpload,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useRef, useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const { Dragger } = Upload;

export type OptionType = {
  label: string;
  value: string | number;
};

export default function Role() {
  const { push } = useRouter();

  useEffect(() => {
  }, []);

  //控制行的状态值的恢复
  const [rowStatusMap, setRowStatusMap] = useState<{ [key: number]: boolean }>(
    {}
  );

  //表格列定义
  //表格列定义
  const columns: ProColumns[] = [
    {
      title: "角色编号",
      dataIndex: "roleId",
      search: false,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      order: 4,
    },
    {
      title: "权限字符",
      dataIndex: "roleKey",
      order: 3,
    },
    {
      title: "显示顺序",
      dataIndex: "roleSort",
      search: false,
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
              checked={rowStatusMap[record.roleId]}
              disabled={record.roleId == 1}
              onChange={(checked, event) => {
                showSwitchRoleStatusModal(checked, record);
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
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
      render: (_, record) => {
        if (record.roleId != 1)
          return [
            <Button
              key="modifyBtn"
              type="link"
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={() => showRowModifyModal(record)}
            >
              修改
            </Button>,
            <Button
              key="deleteBtn"
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onClickDeleteRow(record)}
            >
              删除
            </Button>,
            <Dropdown
              key="moreDrop"
              menu={{
                items: [
                  {
                    key: "1",
                    label: (
                      <a
                        onClick={() => {
                          modifyRole(record);
                        }}
                      >
                        数据权限
                      </a>
                    ),
                    icon: <KeyOutlined />,
                  },
                  {
                    key: "2",
                    label: (
                      <a
                        onClick={() =>
                          push(`/system/role/auth/${record.roleId}`)
                        }
                      >
                        分配用户
                      </a>
                    ),
                    icon: <FontAwesomeIcon icon={faUsers} />,
                  },
                ],
              }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  更多
                  <CaretDownOutlined />
                </Space>
              </a>
            </Dropdown>,
          ];
      },
    },
  ];

  //是否展示修改角色对话框
  const [showModifyRoleModal, setShowModifyRoleModal] = useState(false);

  //展示修改用户对话框
  const showRowModifyModal = (record?) => {
    queryRoleInfo(record);
    setShowModifyRoleModal(true);
  };

  //是否展示修改角色权限
  const [showModifyRolePermissionModal, setShowModifyRolePermissionModal] = useState(false);

  //重置密码表单引用
  const [pwdFormRef] = Form.useForm();

  const modifyRole = (record) => {
    attachRowdata["roleId"] = record.roleId;
    attachRowdata["roleName"] = record.roleName;
    setAttachRowdata(attachRowdata);

    setShowModifyRolePermissionModal(true);
  };

  //确认重置密码
  const confirmModifyUserPwd = () => {
    pwdFormRef.submit();
  };

  //取消重置密码
  const cancelModifyUserPwd = () => {
    setShowModifyRolePermissionModal(false);
  };

  //执行修改分配权限
  const executeModifyUserPwd = async (values) => {
    setShowModifyRolePermissionModal(false);
    values["roleId"] = attachRowdata["roleId"];
    const body = await fetchApi("/api/system/user/resetPwd", push, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (body != undefined) {
      if (body.code == 200) {
        message.success(`修改${attachRowdata["roleName"]}权限成功`);
      } else {
        message.error(body.msg);
      }
    }
    pwdFormRef.resetFields();
  };

  //查询用户数据
  const getList = async (params, sorter, filter) => {
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

    const body = await fetchApi(`/api/system/role/list?${queryParams}`, push);

    if (body !== undefined) {
      body.rows.forEach((row) => {
        setRowStatusMap({ ...rowStatusMap, [row.roleId]: row.status === "0" });
      });
    }

    return body;
  };

  //展示切换角色状态对话框
  const showSwitchRoleStatusModal = (checked: boolean, record) => {
    setRowStatusMap({ ...rowStatusMap, [record.roleId]: checked });

    Modal.confirm({
      title: "系统提示",
      icon: <ExclamationCircleFilled />,
      content: `确认要${checked ? "启用" : "停用"}"${record.roleName}"角色吗？`,
      onOk() {
        executeSwitchStatus(checked, record.roleId, () => {
          setRowStatusMap({ ...rowStatusMap, [record.roleId]: !checked });
        });
      },
      onCancel() {
        setRowStatusMap({ ...rowStatusMap, [record.roleId]: !checked });
      },
    });
  };

  //确认变更角色状态
  const executeSwitchStatus = async (
    checked: boolean,
    roleId: string,
    erroCallback: () => {}
  ) => {
    const modifyData = {
      roleId: roleId,
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
    getCheckboxProps: (record) => ({
      disabled: record.roleId == 1,
    }),
  };


  //确定新建角色
  const executeAddUser = async (values) => {
    const body = await fetchApi("/api/system/role", push, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (body != undefined) {
      if (body.code == 200) {
        message.success(body.msg);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      }

      message.error(body.msg);
      return false;
    }
    return false;
  };

  //修改角色表单引用
  const modifyFormRef = useRef<ProFormInstance>();

  

  //操作角色的附加数据
  const [attachRowdata, setAttachRowdata] = useState<{ [key: string]: any }>(
    {}
  );

  //查询用户信息
  const queryRoleInfo = async (record?) => {
    const roleId = record !== undefined ? record.roleId : selectedRow.roleId;
    const roleName =
      record !== undefined ? record.roleName : selectedRow.roleName;

    attachRowdata["roleId"] = roleId;
    attachRowdata["roleName"] = roleName;

    setAttachRowdata(attachRowdata);

    if (roleId !== undefined) {
      const body = await fetchApi(`/api/system/role/${roleId}`, push);

      if (body !== undefined) {
        if (body.code == 200) {

          modifyFormRef?.current?.setFieldsValue({
            nickName: body.data.nickName,
            deptId: body.data.deptId,
            phonenumber: body.data.phonenumber,
            email: body.data.email,
            sex: body.data.sex,
            status: body.data.status,
            postIds: body.postIds,
            roleIds: body.roleIds,
            remark: body.data.remark,
          });
        }
      }
    }
  };

  //确认修改角色
  const executeModifyRole = async (values) => {
    values["roleId"] = attachRowdata["roleId"];
    values["roleName"] = attachRowdata["roleName"];

    const body = await fetchApi("/api/system/role", push, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (body !== undefined) {
      if (body.code == 200) {
        message.success(body.msg);
        //刷新列表
        if (actionRef.current) {
          actionRef.current.reload();
        }
        return true;
      }
      message.error(body.msg);
      return false;
    }
  };

  //点击删除按钮
  const onClickDeleteRow = (record?) => {
    const roleId =
      record != undefined ? record.roleId : selectedRowKeys.join(",");
    Modal.confirm({
      title: "系统提示",
      icon: <ExclamationCircleFilled />,
      content: `是否确认删除角色编号为“${roleId}”的数据项？`,
      onOk() {
        executeDeleteRow(roleId);
      },
      onCancel() {},
    });
  };

  //确定删除选中的角色
  const executeDeleteRow = async (roleId) => {
    const body = await fetchApi(`/api/system/role/${roleId}`, push, {
      method: "DELETE",
    });
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
        "/api/system/role/export",
        push,
        {
          method: "POST",
          body: formData,
        },
        `role_${new Date().getTime()}.xlsx`
      );
    }
  };

  return (
    <PageContainer title={false}>
      <ProTable
        formRef={formRef}
        rowKey={(record) => record.roleId}
        rowSelection={{
          selectedRowKeys,
          ...rowSelection,
        }}
        columns={columns}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const data = await getList(params, sorter, filter);
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
            <ModalForm
              key="addmodal"
              title="添加角色"
              trigger={
                <Button icon={<PlusOutlined />} type="primary">
                  新建
                </Button>
              }
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
              }}
              submitTimeout={2000}
              onFinish={async (values) => {
                return executeAddUser(values);
              }}
            >
                <ProFormText
                  width="md"
                  name="nickName"
                  label="用户昵称"
                  placeholder="请输入用户昵称"
                  rules={[{ required: true, message: "请输入用户昵称" }]}
                />
            </ModalForm>,
            <ModalForm
              key="modifymodal"
              title="修改角色"
              formRef={modifyFormRef}
              trigger={
                <Button
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  disabled={!rowCanModify}
                  onClick={() => showRowModifyModal()}
                >
                  修改
                </Button>
              }
              open={showModifyRoleModal}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                  setShowModifyRoleModal(false);
                },
              }}
              submitTimeout={2000}
              onFinish={async (values) => {
                return executeModifyRole(values);
              }}
            >
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="nickName"
                  label="用户昵称"
                  placeholder="请输入用户昵称"
                  rules={[{ required: true, message: "请输入用户昵称" }]}
                />
              </ProForm.Group>
            </ModalForm>,

            <Button
              key="danger"
              danger
              icon={<DeleteOutlined />}
              disabled={!rowCanDelete}
              onClick={() => onClickDeleteRow()}
            >
              删除
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

      <Modal
        title={`修改${attachRowdata["roleName"]}数据权限`}
        open={showModifyRolePermissionModal}
        onOk={confirmModifyUserPwd}
        onCancel={cancelModifyUserPwd}
      >
        <Form
          form={pwdFormRef}
          onFinish={async (values) => {
            return executeModifyUserPwd(values);
          }}
        >
          <Form.Item
            label="新密码"
            name="password"
            rules={[{ required: true, message: "请输入新密码" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
