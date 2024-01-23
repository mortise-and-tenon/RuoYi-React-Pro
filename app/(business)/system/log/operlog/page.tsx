"use client";

import { fetchApi } from '@/app/_modules/func';
import { ClearOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';


export type TableListItem = {
  key: number;
  operId: string;
  title: string;
  businessType: string;
  operName:string,
  operIp:string,
  operLocation:string,
  status:string,
  operTime:string,
  costTime:string,
};
const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    operId: 'AppName',
    title: "模块",
    businessType: "1",
    operName: "0",
    operIp:"127.0.0.1",
    operLocation:"四川",
    status: "success",
    operTime:"2024-01-23 14:25:37",
    costTime: "10ms"
  });
}

//表格列定义
const columns: ProColumns<TableListItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '日志编号',
    dataIndex: 'operId',
    search:false,
  },
  {
    title: '系统模块',
    dataIndex: 'title',
  },
  {
    title: '操作类型',
    dataIndex: 'businessType',
    valueEnum: {
      add: {
        text: "新增",
        status: "1",
      },
      modify: {
        text: "修改",
        status: "2",
      },
      delete: {
        text: "删除",
        status: "3",
      },
      auth: {
        text: "授权",
        status: "4",
      },
      export: {
        text: "导出",
        status: "5",
      },
      import: {
        text: "导入",
        status: "6",
      },
      quit: {
        text: "强退",
        status: "7",
      },
      code: {
        text: "生成代码",
        status: "8",
      },
      clear: {
        text: "清空数据",
        status: "9",
      },
      other: {
        text: "其他",
        status: "0",
      },
    }
  },
  {
    title: "操作人员",
    dataIndex: "operName",
  },
  {
    title: "操作地址",
    dataIndex: "operIp",
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
    valueEnum: {
      success: {
        text: "成功",
        status: "0",
      },
      failure: {
        text: "失败",
        status: "1",
      },
    },
  },
  {
    title: "操作日期",
    dataIndex: "operTime",
    valueType: "dateTimeRange",
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: "消耗时间",
    dataIndex: "costTime",
    search: false,
  },
  {
    title: "操作",
    key: 'option',
    search:false,
    render: () => [
      <a key="link">详情</a>,
    ],
  }
];

export default function OperLog() {
  const {push} = useRouter();

  const getLog= async (params, sorter, filter)=>{
    const searchParams = {
      pageNum: params.current,
      pageSize:params.pageSize,
    }
    
    const body = await fetchApi(`/api/monitor/operlog/list?${new URLSearchParams(searchParams)}`,push);
    console.log("data:",body);
    return body;
  }
  return (
    <PageContainer>
    <ProTable<TableListItem>
      columns={columns}
      request={async (params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        console.log(params, sorter, filter);
        const data = await getLog(params,sorter,filter);
        return Promise.resolve({
          data: data.rows,
          success: true,
          total: data.total,
        });
      }}
      rowKey="key"
      pagination={{
        showQuickJumper: true,
      }}
      search={{
        defaultCollapsed: false,
        searchText:"搜索"
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button key="danger" danger icon={<DeleteOutlined />}>
          删除
        </Button>,
        <Button key="clear" danger icon={<ClearOutlined />}>清空</Button>,
        <Button type="primary" key="primary" icon={<ImportOutlined />}>
          导出
        </Button>,
      ]}
    />
    </PageContainer>
  );
};