declare namespace Chat {
  interface MsgItem {
    id: string;
    content?: string;
    thinkingPart?: string;
    answerPart?: string;
    role: "user" | "assistant";
    copied?: boolean;
    type?: "text-input" | "img-sys-input" | "pdf-input" | "duckgo-input";
    fileName?: string;
    size?: string;
  }
  interface CurrentChatState {
    id: string;
    // 当前会话数据
    items: MsgItem[];
    answerStatus: AnswerStatus;
    // 是否需要滚动内容
    needScroll: boolean;
    // 输出状态
    outputStatus: "thinking" | "answering" | "answerEnded";
    // 思考过程默认显示的key
    thinkingDefaultActiveKey: string[];
    addItem: (newItem: MsgItem) => void;
    removeItem: (itemId: string) => void;
    updateItem: (data: Partial<MsgItem>) => void;
    // 设置输出状态
    setOutputStatus: (status: "thinking" | "answering" | "answerEnded") => void;
    // 设置思考过程默认显示的key
    setThinkingDefaultActiveKey: (key: string[]) => void;
    // 给最后一条增加内容
    addLastContent: ({
      thinkingPart,
      answerPart,
    }: {
      thinkingPart?: string;
      answerPart?: string;
    }) => void;
    // 设置聊天记录
    setItems: (newItems: MsgItem[]) => void;
    // 清楚当前及以后的聊天记录
    clearAfter: (index: string) => void;
    // 设置回答状态
    setAnswerStatus: (status: AnswerStatus) => void;
    // 设置是否需要滚动
    setNeedScroll: (needScroll: boolean) => void;
    // 创建新聊天
    createNewChat: () => void;
    // 设置当前聊天id
    setCurrentChatId: (id: string) => void;
  }
  interface HistoryListItem {
    id: string;
    title?: string;
    editable?: boolean;
  }
  interface HistoryListState {
    list: HistoryListItem[];
    // 初始化
    initChatList: () => void;
    // 添加
    addChat: (chat: HistoryListItem) => void;
    // 删除
    removeChat: (chatId: string) => void;
    // 修改
    updateChat: (data: HistoryListItem) => void;
  }
  interface AskState {
    isSearch: boolean;
    setIsSearch: (isSearch: boolean) => void;
    toggleSearch: () => void;
  }
}

declare enum AnswerStatus {
  // NotStarted = 0,
  Asked = 1,
  StartAnswer = 2,
  Thinking = 3,
  ThinkingEnded = 4,
  Answering = 5,
  Ended = 6,
}
