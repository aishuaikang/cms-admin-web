export interface Message {
  id: string;
  title: string;
  type: number;
  content: string;
  businessId: string;
  sendTime: string;
  readFlag: number;
  createTime: string;
  updateTime: string;
  addresser: {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
  };
}
