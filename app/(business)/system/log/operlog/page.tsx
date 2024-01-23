"use client";

import { EllipsisOutlined, PlusOutlined,SearchOutlined,DeleteOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ProTable,
  TableDropdown,
  PageContainer,
} from "@ant-design/pro-components";
import { Button, Dropdown, Space, Tag } from "antd";
import { useRef } from "react";


import {faArrowsRotate} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

type LogItem = {
    operId:number|string,
    title: string,
    businessType: number|string,
    operName:string,
    operIp:string,
    operLocation:string,
    status:number|string,
    operTime:string,
    costTime:number,
};

//列定义
const columns: ProColumns<LogItem>[] = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "日志编号",
    dataIndex: "operId",
    search: false,
  },
//   {
//     title: "系统模块",
//     dataIndex: "title",
//   },
//   {
//     title: "操作类型",
//     dataIndex: "businessType",
//     valueType: "select",
//     valueEnum: {
//       add: {
//         text: "新增",
//         status: 1,
//       },
//       modify: {
//         text: "修改",
//         status: 2,
//       },
//       delete: {
//         text: "删除",
//         status: 3,
//       },
//       auth: {
//         text: "授权",
//         status: 4,
//       },
//       export: {
//         text: "导出",
//         status: 5,
//       },
//       import: {
//         text: "导入",
//         status: 6,
//       },
//       quit: {
//         text: "强退",
//         status: 7,
//       },
//       code: {
//         text: "生成代码",
//         status: 8,
//       },
//       clear: {
//         text: "清空数据",
//         status: 9,
//       },
//       other: {
//         text: "其他",
//         status: 0,
//       },
//     },
//   },
//   {
//     title: "操作人员",
//     dataIndex: "operName",
//   },
//   {
//     title: "操作地址",
//     dataIndex: "operIp",
//   },
//   {
//     title: "操作地点",
//     dataIndex: "operLocation",
//     search: false,
//   },
//   {
//     title: "操作状态",
//     dataIndex: "status",
//     valueType: "select",
//     valueEnum: {
//       success: {
//         text: "成功",
//         status: 0,
//       },
//       failure: {
//         text: "失败",
//         status: 1,
//       },
//     },
//   },
//   {
//     title: "操作日期",
//     dataIndex: "operTime",
//     valueType: "dateRange",
//     hideInTable: true,
//     search: {
//       transform: (value) => {
//         return {
//           startTime: value[0],
//           endTime: value[1],
//         };
//       },
//     },
//   },
//   {
//     title: "消耗时间",
//     key: "costTime",
//     search: false,
//   },
];

export default function Operlog() {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<LogItem>
        columns={columns}
        // actionRef={actionRef}
        cardBordered
        // request={async (params, sort, filter) => {
        //   console.log(sort, filter);
        //   await waitTime(2000);
        //   return request<{
        //     data: GithubIssueItem[];
        //   }>("https://proapi.azurewebsites.net/github/issues", {
        //     params,
        //   });
        // }}
        // editable={{
        //   type: "multiple",
        // }}
        // columnsState={{
        //   persistenceKey: "pro-table-singe-demos",
        //   persistenceType: "localStorage",
        //   defaultValue: {
        //     option: { fixed: "right", disable: true },
        //   },
        //   onChange(value) {
        //     console.log("value: ", value);
        //   },
        // }}
        // rowKey="id"
        // search={{
        //   labelWidth: "auto",
        // }}
        // options={{
        //   setting: {
        //     listsHeight: 400,
        //   },
        // }}
        // form={{
        //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        //   syncToUrl: (values, type) => {
        //     if (type === "get") {
        //       return {
        //         ...values,
        //         created_at: [values.startTime, values.endTime],
        //       };
        //     }
        //     return values;
        //   },
        // }}
        // pagination={{
        //   pageSize: 5,
        //   onChange: (page) => console.log("page:",page),
        // }}
        // dateFormatter="string"
        // toolBarRender={() => [
        //   <Button key="delete" icon={<DeleteOutlined />}>删除</Button>,
        //   <Button key="clear" type="primary">
        //     清空
        //   </Button>,
        //   <Button key="export" type="primary">
        //   导出
        // </Button>,
        // ]}
      />
    </PageContainer>
  );
}
