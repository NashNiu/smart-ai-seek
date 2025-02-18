import { create } from "zustand";

export const currentChat = create<Chat.CurrentChatState>((set) => ({
  id: "",
  items: [],
  answerStatus: 2,
  needScroll: false,
  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, newItem],
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  // addLastContent
  addLastContent: (content) => {
    set((state) => ({
      items: state.items.map((item, index) => {
        const lastIndex = state.items.length - 1;
        if (lastIndex === index) {
          return {
            ...item,
            content: item.content + content,
          };
        } else {
          return item;
        }
      }),
    }));
  },
  updateItem: (itemId: string, newName) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, content: newName } : item
      ),
    })),
  setItems: (newItems) =>
    set(() => ({
      items: newItems,
    })),
  clearItems: () =>
    set(() => ({
      items: [],
    })),
  finishAsk: () => set(() => ({ answerStatus: 0 })),
  startAnswer: () => set(() => ({ answerStatus: 1 })),
  endAnswer: () => set(() => ({ answerStatus: 2 })),
  setNeedScroll: (needScroll: boolean) => set(() => ({ needScroll })),
  createNewChat: () => {
    set(() => ({
      items: [],
      answerStatus: 2,
      needScroll: false,
      id: "",
    }));
  },
  setCurrentChatId: (chatId: string) => set(() => ({ id: chatId })),
}));

// 问答记录，只有id和标题，用于sidebar展示
export const chatList = create<Chat.HistoryListState>((set) => ({
  list: [],
  // 初始化
  initChatList: () => {
    const chatList = localStorage.getItem("chatList");
    if (chatList) {
      set(() => ({ list: JSON.parse(chatList) }));
    } else {
      set(() => ({ list: [] }));
    }
  },
  // 添加
  addChat: (chat: Chat.HistoryListItem) =>
    set((state) => ({ list: [chat, ...state.list] })),
  // 删除
  removeChat: (chatId: string) =>
    set((state) => ({ list: state.list.filter((item) => item.id !== chatId) })),
  // 修改
  updateChat: ({ id, ...rest }) =>
    set((state) => ({
      list: state.list.map((item) =>
        item.id === id ? { ...item, ...rest } : item
      ),
    })),
}));

