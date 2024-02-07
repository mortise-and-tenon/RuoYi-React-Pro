import { ReactNode } from "react";

import {
  ApiOutlined,
  BookOutlined,
  ChromeFilled,
  CodeOutlined,
  EditOutlined,
  GithubOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  MessageOutlined,
  MonitorOutlined,
  QuestionCircleFilled,
  SearchOutlined,
  ToolOutlined,
  UserOutlined,
  ExclamationCircleFilled,
  AreaChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  SlidersOutlined,
  PhoneOutlined,
  AndroidOutlined,
  AppleOutlined,
  WindowsOutlined,
  ChromeOutlined,
  WechatOutlined,
  AccountBookOutlined,
  BankOutlined,
  BugOutlined,
  CarOutlined,
  ClearOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  FormatPainterOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
  WifiOutlined,
} from "@ant-design/icons";

import {
  faAddressCard,
  faBookAtlas,
  faChalkboardUser,
  faDatabase,
  faDesktop,
  faFileWaveform,
  faGear,
  faList,
  faLocationArrow,
  faMemory,
  faReceipt,
  faRectangleList,
  faSitemap,
  faTableCells,
  faThumbtack,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//登录请求
export type LoginReq = {
  username: string;
  password: string;
  code: string;
  uuid: string;
};

//用户简单信息定义
export type UserInfo = {
  nickName: string;
  avatar: string;
};

//用户详细信息
export type UserDetailInfo = {
  userName: string;
  phonenumber: string;
  email: string;
  deptName: string;
  postGroup: string;
  roleName: string;
  nickName: string;
  sex: number | string;
  createTime: string;
};

//路由/菜单定义
export type RouteInfo = {
  path: string;
  name?: string;
  icon?: ReactNode;
  routes?: Array<RouteInfo>;
};

export type IconType = {
  [key: string]: ReactNode;
};

//图标映射
export const IconMap: IconType = {
  system: <FontAwesomeIcon icon={faGear} />,
  monitor: <MonitorOutlined />,
  tool: <ToolOutlined />,
  guide: <FontAwesomeIcon icon={faLocationArrow} />,
  user: <UserOutlined />,
  peoples: <FontAwesomeIcon icon={faUsers} />,
  treetable: <FontAwesomeIcon icon={faList} />,
  tree: <FontAwesomeIcon icon={faSitemap} />,
  post: <FontAwesomeIcon icon={faAddressCard} />,
  dict: <FontAwesomeIcon icon={faBookAtlas} />,
  edit: <EditOutlined />,
  message: <MessageOutlined />,
  log: <BookOutlined />,
  online: <FontAwesomeIcon icon={faChalkboardUser} />,
  job: <FontAwesomeIcon icon={faThumbtack} />,
  druid: <FontAwesomeIcon icon={faFileWaveform} />,
  server: <FontAwesomeIcon icon={faDesktop} />,
  redis: <FontAwesomeIcon icon={faDatabase} />,
  redislist: <FontAwesomeIcon icon={faMemory} />,
  build: <FontAwesomeIcon icon={faTableCells} />,
  code: <CodeOutlined />,
  swagger: <ApiOutlined />,
  form: <FontAwesomeIcon icon={faRectangleList} />,
  logininfor: <FontAwesomeIcon icon={faReceipt} />,
  areachart: <AreaChartOutlined />,
  pie: <PieChartOutlined />,
  barchart: <BarChartOutlined />,
  linechart: <LineChartOutlined />,
  slider: <SlidersOutlined />,
  phone: <PhoneOutlined />,
  android: <AndroidOutlined />,
  apple: <AppleOutlined />,
  window: <WindowsOutlined />,
  chrome: <ChromeOutlined />,
  wechat: <WechatOutlined />,
  account: <AccountBookOutlined />,
  bank: <BankOutlined />,
  bug: <BugOutlined />,
  car: <CarOutlined />,
  clear: <ClearOutlined />,
  cloud: <CloudOutlined />,
  command: <CodeOutlined />,
  map: <EnvironmentOutlined />,
  experiment: <ExperimentOutlined />,
  painter: <FormatPainterOutlined />,
  home: <HomeOutlined />,
  mail: <MailOutlined />,
  shop: <ShoppingCartOutlined />,
  sync: <SyncOutlined />,
  wifi: <WifiOutlined />,
};
