import { create } from "zustand";
import { consts } from "@/utils";
export const currentChat = create<Chat.CurrentChatState>((set) => ({
  id: "",
  items: [],
  answerStatus: consts.AnswerStatus.Ended,
  needScroll: false,
  outputStatus: "answerEnded",
  thinkingDefaultActiveKey: ["1"],
  setOutputStatus: (status: "thinking" | "answering" | "answerEnded") =>
    set(() => ({ outputStatus: status })),
  setThinkingDefaultActiveKey: (key: string[]) =>
    set(() => ({ thinkingDefaultActiveKey: key })),
  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, newItem],
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  // addLastContent
  addLastContent: ({ thinkingPart, answerPart }) => {
    set((state) => ({
      items: state.items.map((item, index) => {
        const lastIndex = state.items.length - 1;
        if (lastIndex === index) {
          return {
            ...item,
            thinkingPart: (item?.thinkingPart ?? "") + thinkingPart,
            answerPart: (item?.answerPart ?? "") + answerPart,
          };
        } else {
          return item;
        }
      }),
    }));
  },
  updateItem: (data) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === data.id ? { ...item, ...data } : item
      ),
    })),
  setItems: (newItems) =>
    set(() => ({
      items: newItems,
    })),
  // 清楚当前及以后的聊天记录
  clearAfter: (id: string) => {
    set((state) => {
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        return {
          items: state.items.slice(0, index),
        };
      } else {
        return { items: [] };
      }
    });
  },
  setAnswerStatus: (status: AnswerStatus) =>
    set(() => ({ answerStatus: status })),
  setNeedScroll: (needScroll: boolean) => set(() => ({ needScroll })),
  createNewChat: () => {
    set(() => ({
      items: [],
      answerStatus: consts.AnswerStatus.Ended,
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

// ask state
export const askState = create<Chat.AskState>((set) => ({
  isSearch: false,
  setIsSearch: (isSearch: boolean) => set(() => ({ isSearch })),
  toggleSearch: () => set((state) => ({ isSearch: !state.isSearch })),
}));
