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
import type { TreeDataNode } from "antd";
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
} from "antd";
import { useRouter } from "next/navigation";

import {
  faDownload,
  faPenToSquare,
  faToggleOff,
  faToggleOn,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useRef, useState } from "react";

const { Search } = Input;

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

export type OptionType = {
  label: string;
  value: string | number;
};

export default function User() {
  const { push } = useRouter();

  //新建用户预置密码值
  const [defaultPassword, setDefaultPassword] = useState("");

  useEffect(() => {
    queryDefaultPassword();
    queryPostion();
    queryOrgTree();
  }, []);

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

    //如果有组织id，添加相应查询参数
    if (searchDeptId != 0) {
      queryParams.append("deptId", searchDeptId.toString());
    }

    const body = await fetchApi(`/api/system/user/list?${queryParams}`, push);

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

  //查询用的组织id
  const [searchDeptId, setSearchDeptId] = useState(0);

  //选择组织树执行过滤
  const selectOrgData = (selectedDeptKey, e) => {
    if (selectedDeptKey && selectedDeptKey.length > 0) {
      setSearchDeptId(selectedDeptKey[0]);
    } else {
      setSearchDeptId(0);
    }

    formRef.current.submit();
  };

  //用于搜索的组织选择数据
  const [orgTreeData, setOrgTreeData] = useState([] as Array<TreeDataNode>);

  //用于对话框的组织选择数据
  const [orgSelectData, setOrgSelectData] = useState([]);

  //查询组织树
  const queryOrgTree = async () => {
    const body = await fetchApi("/api/system/user/deptTree", push);
    if (body !== undefined) {
      setOrgTreeData(generateOrgTree(body.data));
      setSearchValue("");
      setOrgSelectData(body.data);
    }
  };

  //搜索部门的值
  const [searchValue, setSearchValue] = useState("");

  //搜索组织树数据
  const onSearchDept = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("search:", e.target.value);
    setSearchValue(e.target.value);
  };

  //搜索过滤后的组织树展示数据
  const filterOrgTree = useMemo(() => {
    const loop = (data: TreeDataNode[]): TreeDataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    const data = loop(orgTreeData);
    console.log("filter:", data);
    return data;
  }, [orgTreeData, searchValue]);

  const generateOrgTree = (orgData: []) => {
    const children: Array<TreeDataNode> = new Array<TreeDataNode>();

    orgData.forEach((parent) => {
      const hasChild = parent.children && parent.children.length > 0;
      const node: TreeDataNode = {
        title: parent.label,
        key: parent.id,
      };

      children.push(node);

      if (hasChild) {
        generateOrgChildTree(parent.children, node);
      }
    });
    return children;
  };

  const generateOrgChildTree = (orgData: [], parent: TreeDataNode) => {
    const children: Array<TreeDataNode> = new Array<TreeDataNode>();
    orgData.forEach((item) => {
      const hasChild = item.children && item.children.length > 0;
      const node: TreeDataNode = {
        title: item.label,
        key: item.id,
        isLeaf: !hasChild,
      };

      children.push(node);

      if (hasChild) {
        generateOrgChildTree(item.children, node);
      }
    });

    parent.children = children;
    return parent;
  };

  //查询性别分类
  const querySexType = async () => {
    const body = await fetchApi(
      "/api/system/dict/data/type/sys_user_sex",
      push
    );
    if (body !== undefined) {
      return body.data;
    }
  };

  //查询新建用户预置密码
  const queryDefaultPassword = async () => {
    const body = await fetchApi(
      "/api/system/config/configKey/sys.user.initPassword",
      push
    );
    if (body !== undefined) {
      setDefaultPassword(body.msg);
    }
  };

  //岗位数据
  const [positionValue, setPositionValue] = useState<{ [key: number]: string }>(
    {}
  );

  //角色数据
  const [roleValue, setRoleValue] = useState<{ [key: number]: string }>({});

  //查询岗位
  const queryPostion = async () => {
    const body = await fetchApi("/api/system/user/", push);

    if (body !== undefined) {
      body.posts.forEach((post) => {
        positionValue[post.postId] = post.postName;
        setPositionValue(positionValue);
      });
      body.roles.forEach((role) => {
        roleValue[role.roleId] = role.roleName;
        setRoleValue(roleValue);
      });
    }
  };

  //确定新建用户
  const executeAddUser = async (values) => {
    const body = await fetchApi("/api/system/user", push, {
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

  //修改用户表单引用
  const modifyFormRef = useRef<ProFormInstance>();

  //待修改用户的岗位可选数据
  const modifyPositionValue: Array<OptionType> = new Array<OptionType>();
  //待修改用户的角色可选数据
  const modifyRoleValue: Array<OptionType> = new Array<OptionType>();

  const requestModifyPositionValue = async () => {
    return modifyPositionValue;
  };

  const requestModifyRoleValue = async () => {
    return modifyRoleValue;
  };

  //查询用户信息
  const queryUserInfo = async () => {
    if (selectedRow !== undefined) {
      const body = await fetchApi(
        `/api/system/user/${selectedRow.userId}`,
        push
      );

      if (body !== undefined) {
        if (body.code == 200) {
          body.posts.forEach((post) => {
            const option: OptionType = {
              label: post.postName,
              value: post.postId,
            };
            modifyPositionValue.push(option);
          });
          body.roles.forEach((role) => {
            const option: OptionType = {
              label: role.roleName,
              value: role.roleId,
            };
            modifyRoleValue.push(option);
          });

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

  //确认修改用户
  const executeModifyUser = async (values) => {
    values["userId"] = selectedRow["userId"];
    values["userName"] = selectedRow["userName"];
    console.log("modify:", values);
    const body = await fetchApi("/api/system/user", push, {
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

  //确定删除选中的用户
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

  //确定导入
  const executeImport = async () => {
    const body = await fetchApi(`/api/`, push);

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
    <PageContainer title={false}>
      <Row gutter={{ xs: 8, sm: 8, md: 8 }}>
        <Col xs={24} sm={6} md={6}>
          <ProCard>
            <Input
              placeholder="输入部门名称搜索"
              prefix={<SearchOutlined />}
              onChange={onSearchDept}
            />
            {filterOrgTree.length > 0 ? (
              <Flex>
                <Tree
                  switcherIcon={<CaretDownOutlined />}
                  defaultExpandAll
                  onSelect={selectOrgData}
                  treeData={filterOrgTree}
                />
              </Flex>
            ) : (
              <Flex justify="center" style={{ marginTop: "16px" }}>
                <Spin />
              </Flex>
            )}
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
                <ModalForm
                  title="添加用户"
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
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="nickName"
                      label="用户昵称"
                      placeholder="请输入用户昵称"
                      rules={[{ required: true, message: "请输入用户昵称" }]}
                    />

                    <ProFormTreeSelect
                      width="md"
                      name="deptId"
                      label="归属部门"
                      placeholder="请选择归属部门"
                      request={async () => {
                        return orgSelectData;
                      }}
                      fieldProps={{
                        filterTreeNode: true,
                        showSearch: true,
                        treeNodeFilterProp: "label",
                        fieldNames: {
                          label: "label",
                          value: "id",
                        },
                      }}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="phonenumber"
                      label="手机号码"
                      placeholder="请输入手机号码"
                      rules={[
                        {
                          pattern: /^1\d{10}$/,
                          message: "请输入正确的手机号码",
                        },
                      ]}
                    />
                    <ProFormText
                      width="md"
                      name="email"
                      label="邮箱"
                      placeholder="请输入邮箱"
                      rules={[
                        { type: "email", message: "请输入正确的邮箱地址" },
                      ]}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="userName"
                      label="用户名称"
                      placeholder="请输入用户名称"
                      rules={[{ required: true, message: "请输入用户名称" }]}
                    />
                    <ProFormText.Password
                      width="md"
                      name="password"
                      label="用户密码"
                      initialValue={defaultPassword}
                      placeholder="请输入用户密码"
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormSelect
                      width="md"
                      name="sex"
                      label="用户性别"
                      request={querySexType}
                      fieldProps={{
                        fieldNames: {
                          label: "dictLabel",
                          value: "dictValue",
                        },
                      }}
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
                      width="md"
                      name="postIds"
                      label="岗位"
                      fieldProps={{
                        mode: "multiple",
                      }}
                      valueEnum={positionValue}
                    />
                    <ProFormSelect
                      width="md"
                      name="roleIds"
                      label="角色"
                      fieldProps={{
                        mode: "multiple",
                      }}
                      valueEnum={roleValue}
                    />
                  </ProForm.Group>

                  <ProFormTextArea
                    name="remark"
                    width="688px"
                    layout="horizontal"
                    label="备注"
                    placeholder="请输入内容"
                  />
                </ModalForm>,
                <ModalForm
                  title="修改用户"
                  formRef={modifyFormRef}
                  trigger={
                    <Button
                      icon={<FontAwesomeIcon icon={faPenToSquare} />}
                      disabled={!rowCanModify}
                      onClick={queryUserInfo}
                    >
                      修改
                    </Button>
                  }
                  autoFocusFirstInput
                  modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {},
                  }}
                  submitTimeout={2000}
                  onFinish={async (values) => {
                    return executeModifyUser(values);
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

                    <ProFormTreeSelect
                      width="md"
                      name="deptId"
                      label="归属部门"
                      placeholder="请选择归属部门"
                      request={async () => {
                        return orgSelectData;
                      }}
                      fieldProps={{
                        filterTreeNode: true,
                        showSearch: true,
                        treeNodeFilterProp: "label",
                        fieldNames: {
                          label: "label",
                          value: "id",
                        },
                      }}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormText
                      width="md"
                      name="phonenumber"
                      label="手机号码"
                      placeholder="请输入手机号码"
                      rules={[
                        {
                          pattern: /^1\d{10}$/,
                          message: "请输入正确的手机号码",
                        },
                      ]}
                    />
                    <ProFormText
                      width="md"
                      name="email"
                      label="邮箱"
                      placeholder="请输入邮箱"
                      rules={[
                        { type: "email", message: "请输入正确的邮箱地址" },
                      ]}
                    />
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormSelect
                      width="md"
                      name="sex"
                      label="用户性别"
                      request={querySexType}
                      fieldProps={{
                        fieldNames: {
                          label: "dictLabel",
                          value: "dictValue",
                        },
                      }}
                    />
                    <ProFormRadio.Group
                      name="status"
                      width="sm"
                      label="状态"
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
                      width="md"
                      name="postIds"
                      label="岗位"
                      fieldProps={{
                        mode: "multiple",
                      }}
                      //   valueEnum={modifyPositionValue}
                      request={requestModifyPositionValue}
                    />
                    <ProFormSelect
                      width="md"
                      name="roleIds"
                      label="角色"
                      fieldProps={{
                        mode: "multiple",
                      }}
                      //   valueEnum={modifyRoleValue}
                      request={requestModifyRoleValue}
                    />
                  </ProForm.Group>

                  <ProFormTextArea
                    name="remark"
                    width="688px"
                    layout="horizontal"
                    label="备注"
                    placeholder="请输入内容"
                  />
                </ModalForm>,

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
