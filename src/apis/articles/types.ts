// 类型(1站内新闻 2外部链接)
export enum ArticleType {
  站内新闻 = 1,
  外部链接,
}

// 所属栏目(1行业新闻 2合规百灵 3政策法规)
export enum ArticleChannel {
  行业新闻 = 1,
  合规百灵,
  政策法规,
}

// 状态(0未发布 1已发布)
export enum ArticleStatus {
  未发布,
  已发布,
}

// 操作类型(0保存草稿 1保存发布)
export enum ArticleOperate {
  保存草稿,
  保存发布,
}

export interface Article {
  description: string;
  id: string;
  image: string;
  publishTime: string;
  status: ArticleStatus;
  title: string;
  type: ArticleType;
  url: string;

  //   id: string;
  //   title: string;
  //   description: string;
  //   image: string;
  //   content: string;
  //   url: string;
  //   status: ArticleStatus;
  //   publishTime: string;
  //   type: ArticleType;
  //   channel: ArticleChannel;
}

export interface GetArticleListParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  channel?: ArticleChannel;
  status?: ArticleStatus;
}

export interface AddArticleParams {
  /**
   * 所属栏目(1行业新闻 2合规百灵 3政策法规)
   */
  channel: ArticleChannel;
  /**
   * 内容
   */
  content?: string;
  /**
   * 摘要
   */
  description: string;
  /**
   * 封面图
   */
  image?: string;
  /**
   * 操作类型(0保存草稿 1保存发布)
   */
  operate: ArticleOperate;
  /**
   * 标题
   */
  title: string;
  /**
   * 类型(1站内新闻 2外部链接)
   */
  type: ArticleType;
  /**
   * 链接
   */
  url?: string;
}

export type UpdateArticleParams = {
  articleId: string;
  data: Partial<AddArticleParams>;
};
