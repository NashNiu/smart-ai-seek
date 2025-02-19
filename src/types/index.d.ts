declare namespace Chat {
  interface MsgItem {
    id: string;
    content: string;
    role: "user" | "assistant";
    copied?: boolean;
  }
  interface CurrentChatState {
    id: string;
    // 当前会话数据
    items: MsgItem[];
    // 回答状态 0未开始(已提问，未开始)，1 进行中，2 结束(已回答)
    answerStatus: number;
    // 是否需要滚动内容
    needScroll: boolean;
    addItem: (newItem: MsgItem) => void;
    removeItem: (itemId: string) => void;
    updateItem: (data: Partial<MsgItem>) => void;
    // 给最后一条增加内容
    addLastContent: (content: string) => void;
    setItems: (newItems: MsgItem[]) => void;
    clearItems: () => void;
    clearAfter: (index: string) => void;
    // 提问完
    finishAsk: () => void;
    // 开始回答
    startAnswer: () => void;
    // 结束回答
    endAnswer: () => void;
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
