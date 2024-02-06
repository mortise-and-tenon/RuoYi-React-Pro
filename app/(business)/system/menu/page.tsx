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
import type {
  ProColumns,
  ProFormInstance,
  ActionType,
} from "@ant-design/pro-components";
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
  ProFormDigit,
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
  Tag,
} from "antd";
import { useRouter } from "next/navigation";

import {
  faDownload,
  faPenToSquare,
  faToggleOff,
  faToggleOn,
  faUpload,
  faUsers,
  faCheck,
  faXmark,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useRef, useState } from "react";

//查询表格数据API
const queryAPI = "/api/system/menu/list";
//新建数据API
const newAPI = "/api/system/menu";
//修改数据API
const modifyAPI = "/api/system/menu";
//查询详情数据API
const queryDetailAPI = "/api/system/menu";
//删除API
const deleteAPI = "/api/system/menu";

export default function Menu() {
  const { push } = useRouter();

  //表格列定义
  const columns: ProColumns[] = [
    {
      title: "菜单名称",
      dataIndex: "menuName",
      order: 2,
    },
    {
      title: "排序",
      dataIndex: "orderNum",
      search: false,
    },
    {
      title: "图标",
      dataIndex: "icon",
      search: false,
    },
    {
      title: "排序",
      dataIndex: "orderNum",
      search: false,
    },
    {
      title: "权限标识",
      dataIndex: "perms",
      search: false,
    },
    {
      title: "组件路径",
      dataIndex: "component",
      search: false,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "select",
      render: (_, record) => {
        return (
          <Space>
            <Tag
              color={record.status === "0" ? "green" : "red"}
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
          text: "正常",
          status: "0",
        },
        1: {
          text: "停用",
          status: "1",
        },
      },
      order: 1,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      search: false,
    },
    {
      title: "操作",
      key: "option",
      search: false,
      render: (_, record) => [
        <Button
          key="modifyBtn"
          type="link"
          icon={<FontAwesomeIcon icon={faPenToSquare} />}
          onClick={() => onClickShowRowModifyModal(record)}
        >
          修改
        </Button>,
        <Button
          key="newBtn"
          type="link"
          icon={<PlusOutlined />}
          onClick={() => onClickAdd(record)}
        >
          新建
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
      ],
    },
  ];

  //0.查询表格数据

  //原始的可展开的所有行的 id
  const [defaultExpandKeys, setDefaultExpandKeys] = useState<any[]>([]);

  //控制行展开的数据
  const [expandKeys, setExpandKeys] = useState<any[]>([]);

  const queryTableData = async (params: any, sorter: any, filter: any) => {
    const searchParams = {
      ...params,
    };

    const queryParams = new URLSearchParams(searchParams);

    Object.keys(sorter).forEach((key) => {
      queryParams.append("orderByColumn", key);
      if (sorter[key] === "ascend") {
        queryParams.append("isAsc", "ascending");
      } else {
        queryParams.append("isAsc", "descending");
      }
    });

    const body = await fetchApi(`${queryAPI}?${queryParams}`, push);

    const firstLevel = getFirstLevel(body.data);

    firstLevel.forEach((first) => {
      getChildren(body.data, first);
    });

    const newExpandedKeys: any[] = [];
    const render = (treeDatas: any[]) => {
      // 获取到所有可展开的父节点
      treeDatas.map((item) => {
        if (item.children) {
          newExpandedKeys.push(item.menuId);
          render(item.children);
        }
      });
      return newExpandedKeys;
    };

    const keys = render(firstLevel);
    setDefaultExpandKeys(keys);
    setExpandKeys([]);
    return firstLevel;
  };

  const getFirstLevel = (data: any[]) => {
    const firstLevel: any[] = [];
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      if (item.parentId === 0) {
        firstLevel.push(item);
      }
    }
    return firstLevel;
  };

  const getChildren = (data: any[], parentNode: any) => {
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      if (item.parentId === parentNode.menuId) {
        parentNode.children.push(item);
        getChildren(data, item);
      }
    }
  };

  //1.新建

  const [showAddModal, setShowAddModal] = useState(false);

  //新建表单是否带有父节点id
  const [rowParentId, setRowParentId] = useState(0);

  //点击新建，如果从行点击新建，给定父节点
  const onClickAdd = (record?: any) => {
    setRowParentId(record.menuId);
    setShowAddModal(true);
  };

  const cancelAddModal = () => {
    setShowAddModal(false);
    setRowParentId(0);
  };

  //确定新建数据
  const executeAddData = async (values: any) => {
    const body = await fetchApi(newAPI, push, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (body != undefined) {
      if (body.code == 200) {
        message.success(body.msg);
        if (actionTableRef.current) {
          actionTableRef.current.reload();
        }
        setShowAddModal(false);
        return true;
      }

      message.error(body.msg);
      return false;
    }
    return false;
  };

  //2.修改

  //是否展示修改对话框
  const [isShowModifyDataModal, setIsShowModifyDataModal] = useState(false);

  //展示修改对话框
  const onClickShowRowModifyModal = (record: any) => {
    queryRowData(record);
    setIsShowModifyDataModal(true);
  };

  //修改数据表单引用
  const modifyFormRef = useRef<ProFormInstance>();

  //操作当前数据的附加数据
  const [operatRowData, setOperateRowData] = useState<{
    [key: string]: any;
  }>({});

  //查询并加载待修改数据的详细信息
  const queryRowData = async (record: any) => {
    const menuId = record.menuId;

    operatRowData["menuId"] = menuId;
    operatRowData["ancestors"] = record.ancestors;

    setOperateRowData(operatRowData);

    if (menuId !== undefined) {
      const body = await fetchApi(`${queryDetailAPI}/${menuId}`, push);

      if (body !== undefined) {
        if (body.code == 200) {
          modifyFormRef?.current?.setFieldsValue({
            //需要加载到修改表单中的数据
            parentId: body.data.parentId,
            deptName: body.data.deptName,
            orderNum: body.data.orderNum,
            leader: body.data.leader,
            phone: body.data.phone,
            email: body.data.email,
            status: body.data.status,
          });
        }
      }
    }
  };

  //确认修改数据
  const executeModifyData = async (values: any) => {
    values["menuId"] = operatRowData["menuId"];

    const body = await fetchApi(modifyAPI, push, {
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
        if (actionTableRef.current) {
          actionTableRef.current.reload();
        }
        setIsShowModifyDataModal(false);
        return true;
      }
      message.error(body.msg);
      return false;
    }
  };

  //3.展开/折叠

  //点击展开/折叠按钮
  const onClickExpandRow = () => {
    if (expandKeys.length > 0) {
      setExpandKeys([]);
    } else {
      setExpandKeys(defaultExpandKeys);
    }
  };

  //处理行的展开/折叠逻辑
  const handleExpand = (expanded: boolean, record: any) => {
    console.log("has keys:", expandKeys);
    let keys = [...expandKeys];

    if (expanded) {
      keys.push(record.menuId);
    } else {
      keys = keys.filter((key: number) => key !== record.menuId);
    }
    console.log("now keys:", keys);
    setExpandKeys(keys);
  };

  //4.导出

  //5.选择行

  //搜索栏显示状态
  const [showSearch, setShowSearch] = useState(true);
  //action对象引用
  const actionTableRef = useRef<ActionType>();
  //搜索表单对象引用
  const searchTableFormRef = useRef<ProFormInstance>();

  const getMenuList = async () => {
    const body = await fetchApi(queryAPI, push);
    if (body !== undefined) {
      const firstLevel = getFirstLevel(body.data);

      firstLevel.forEach((first) => {
        getChildren(body.data, first);
      });

      const root = {
        menuId: 0,
        menuName: "根目录",
        children: [],
      };

      firstLevel.forEach((first: any) => {
        root.children.push(first);
      });

      return [root];
    }
  };

  //点击删除按钮
  const onClickDeleteRow = (record: any) => {
    Modal.confirm({
      title: "系统提示",
      icon: <ExclamationCircleFilled />,
      content: `确定删除部门名称为“${record.deptName}”的数据项？`,
      onOk() {
        executeDeleteRow(record.menuId);
      },
      onCancel() {},
    });
  };

  //确定删除选中的部门
  const executeDeleteRow = async (roleId: any) => {
    const body = await fetchApi(`${deleteAPI}/${roleId}`, push, {
      method: "DELETE",
    });
    if (body !== undefined) {
      if (body.code == 200) {
        message.success("删除成功");
        //刷新列表
        if (actionTableRef.current) {
          actionTableRef.current.reload();
        }
      } else {
        message.error(body.msg);
      }
    }
  };

  const [isCatalog, setIsCatalog] = useState(true);
  const [isMenu, setIsMenu] = useState(false);
  const [isButton, setIsButton] = useState(false);

  const onChangeType = (e: any) => {
    const type = e.target.value;
    setIsCatalog(type === "C");
    setIsMenu(type === "M");
    setIsButton(type === "B");
  };

  return (
    <PageContainer title={false}>
      <ProTable
        formRef={searchTableFormRef}
        rowKey="menuId"
        columns={columns}
        expandable={{
          expandedRowKeys: expandKeys,
          onExpand: handleExpand,
        }}
        request={async (params: any, sorter: any, filter: any) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          const data = await queryTableData(params, sorter, filter);
          if (data !== undefined) {
            return Promise.resolve({
              data: data,
              success: true,
              total: data.length,
            });
          }
          return Promise.resolve({
            data: [],
            success: true,
          });
        }}
        pagination={false}
        search={
          showSearch
            ? {
                defaultCollapsed: false,
                searchText: "搜索",
              }
            : false
        }
        dateFormatter="string"
        actionRef={actionTableRef}
        toolbar={{
          actions: [
            <ModalForm
              key="addmodal"
              title="添加部门"
              open={showAddModal}
              trigger={
                <Button icon={<PlusOutlined />} type="primary">
                  新建
                </Button>
              }
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                  cancelAddModal();
                },
              }}
              submitTimeout={2000}
              onFinish={executeAddData}
            >
              <ProForm.Group>
                <ProFormTreeSelect
                  width="md"
                  name="parentId"
                  initialValue={rowParentId}
                  label="上级菜单"
                  placeholder="请选择上级菜单"
                  rules={[{ required: true, message: "请选择上级菜单" }]}
                  request={getMenuList}
                  fieldProps={{
                    filterTreeNode: true,
                    showSearch: true,
                    treeNodeFilterProp: "label",
                    fieldNames: {
                      label: "menuName",
                      value: "menuId",
                    },
                  }}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormRadio.Group
                  name="menuType"
                  width="sm"
                  label="类型"
                  initialValue="C"
                  onChange={onChangeType}
                  options={[
                    {
                      label: "目录",
                      value: "C",
                    },
                    {
                      label: "菜单",
                      value: "M",
                    },
                    {
                      label: "按钮",
                      value: "B",
                    },
                  ]}
                />
              </ProForm.Group>
              {(isCatalog || isMenu) && (
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="icon"
                    label="菜单图标"
                    placeholder="请输入菜单图标"
                  />
                </ProForm.Group>
              )}
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="menuName"
                  label="菜单名称"
                  placeholder="请输入菜单名称"
                  rules={[{ required: true, message: "请输入菜单名称" }]}
                />
                <ProFormDigit
                  fieldProps={{ precision: 0 }}
                  width="md"
                  name="orderNum"
                  initialValue="0"
                  label="排序"
                  placeholder="请输入排序"
                  rules={[{ required: true, message: "请输入排序" }]}
                />
              </ProForm.Group>
              {(isCatalog || isMenu) && (
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="path"
                    label="路由地址"
                    placeholder="请输入路由地址"
                    rules={[{ required: true, message: "请输入路由地址" }]}
                  />
                  <ProFormRadio.Group
                    name="isFrame"
                    width="sm"
                    label="是否外链"
                    initialValue="1"
                    options={[
                      {
                        label: "是",
                        value: "0",
                      },
                      {
                        label: "否",
                        value: "1",
                      },
                    ]}
                  />
                </ProForm.Group>
              )}

              {isMenu && (
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="perms"
                    label="权限字符"
                    placeholder="请输入权限字符"
                  />
                </ProForm.Group>
              )}

              <ProForm.Group>
                <ProFormRadio.Group
                  name="visible"
                  width="sm"
                  label="显示状态"
                  initialValue="0"
                  options={[
                    {
                      label: "显示",
                      value: "0",
                    },
                    {
                      label: "隐藏",
                      value: "1",
                    },
                  ]}
                />
                <ProFormRadio.Group
                  name="status"
                  width="sm"
                  label="菜单状态"
                  initialValue="0"
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
            </ModalForm>,
            <Button
              key="expand"
              icon={<FontAwesomeIcon icon={faArrowsUpDown} />}
              onClick={() => onClickExpandRow()}
            >
              折叠/展开
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
              onClick: (key: string | undefined) => {
                setShowSearch(!showSearch);
              },
            },
            {
              key: "refresh",
              tooltip: "刷新",
              icon: <ReloadOutlined />,
              onClick: (key: string | undefined) => {
                if (actionTableRef.current) {
                  actionTableRef.current.reload();
                }
              },
            },
          ],
        }}
      />
      <ModalForm
        key="modifymodal"
        title="修改部门"
        formRef={modifyFormRef}
        open={isShowModifyDataModal}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setIsShowModifyDataModal(false);
          },
        }}
        submitTimeout={2000}
        onFinish={executeModifyData}
      >
        <ProForm.Group>
          <ProFormTreeSelect
            width="md"
            name="parentId"
            label="上级菜单"
            placeholder="请选择上级菜单"
            rules={[{ required: true, message: "请选择上级菜单" }]}
            request={getMenuList}
            fieldProps={{
              filterTreeNode: true,
              showSearch: true,
              treeNodeFilterProp: "label",
              fieldNames: {
                label: "menuName",
                value: "menuId",
              },
            }}
          />
          <ProFormText
            width="md"
            name="deptName"
            label="部门名称"
            placeholder="请输入部门名称"
            rules={[{ required: true, message: "请输入部门名称" }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormDigit
            fieldProps={{ precision: 0 }}
            width="md"
            name="orderNum"
            initialValue="0"
            label="排序"
            placeholder="请输入排序"
            rules={[{ required: true, message: "请输入排序" }]}
          />
          <ProFormRadio.Group
            name="status"
            width="sm"
            label="状态"
            initialValue="0"
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
          <ProFormText
            width="md"
            name="leader"
            label="负责人"
            placeholder="请输入负责人"
          />
          <ProFormText
            width="md"
            name="phone"
            label="联系电话"
            placeholder="请输入联系电话"
            rules={[
              {
                pattern: /^1\d{10}$/,
                message: "请输入正确的手机号码",
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="email"
            label="联系邮箱"
            placeholder="请输入联系邮箱"
            rules={[{ type: "email", message: "请输入正确的邮箱地址" }]}
          />
        </ProForm.Group>
      </ModalForm>
      ,
    </PageContainer>
  );
}
