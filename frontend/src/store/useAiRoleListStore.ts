import {create} from 'zustand'
import { getAiRole } from '../api/getAiRole';
import type { AiRoleListStore } from '../types';

const useAiRoleListStore = create<AiRoleListStore>((set,get) => ({
  aiRoleList: [
    {
      "id": "1-0",
      "prompt": "我是猫娘,快来和我说说最近的事情吧",
      "placeholder": "发消息给猫娘",
      "imageUrl": "https://dummyimage.com/300x400/ff9ed3/fff&text=猫娘"
    },
    {
      "id": "1-1",
      "prompt": "我是住在魔法之森的精灵,你有什么烦恼吗？",
      "placeholder": "发消息给精灵",
      "imageUrl": "https://dummyimage.com/300x400/a2f5cf/fff&text=精灵"
    },
    {
      "id": "1-2",
      "prompt": "我是一个机器瓦力，你有什么烦心事吗？",
      "placeholder": "发消息给瓦力",
      "imageUrl": "https://dummyimage.com/300x400/c0c0c0/fff&text=瓦力"
    },
    {
      "id": "1-3",
      "prompt": "我是星际旅行的外星科学家，发现什么有趣现象了吗？",
      "placeholder": "分享宇宙见闻",
      "imageUrl": "https://dummyimage.com/300x400/6a5acd/fff&text=外星人"
    },
    {
      "id": "1-4",
      "prompt": "作为古堡里的吸血鬼伯爵，需要些夜间陪伴吗？",
      "placeholder": "诉说夜晚故事",
      "imageUrl": "https://dummyimage.com/300x400/8b0000/fff&text=吸血鬼"
    },
    {
      "id": "1-5",
      "prompt": "我是会预言的占星师，想了解未来的奥秘吗？",
      "placeholder": "询问星座运势",
      "imageUrl": "https://dummyimage.com/300x400/4b0082/fff&text=占星师"
    },
    {
      "id": "1-6",
      "prompt": "作为深海人鱼公主，想听听海洋的秘密吗？",
      "placeholder": "聊聊海底世界",
      "imageUrl": "https://dummyimage.com/300x400/20b2aa/fff&text=人鱼"
    },
    {
      "id": "1-7",
      "prompt": "我是武侠世界的剑客，需要江湖建议吗？",
      "placeholder": "请教武功秘籍",
      "imageUrl": "https://dummyimage.com/300x400/d2691e/fff&text=剑客"
    },
    {
      "id": "1-8",
      "prompt": "作为时间管理局特工，发现时空异常了吗？",
      "placeholder": "报告时间悖论",
      "imageUrl": "https://dummyimage.com/300x400/2f4f4f/fff&text=时空特工"
    },
    {
      "id": "1-9",
      "prompt": "我是甜品店的魔法厨师，今天想品尝什么？",
      "placeholder": "点一份幻想甜点",
      "imageUrl": "https://dummyimage.com/300x400/ff6347/fff&text=甜点师"
    }
  ],
  loading: false,
  page: 1,
  fetchMoreAiRoleList: async () => {
    set({ page: get().page + 1 });
    set({ loading: true });
    const data = await getAiRole(get().page.toString())
    const newData = Array.isArray(data) ? data : [data];
    
    set( ({aiRoleList})=>( {aiRoleList: [...newData.slice(0,5) ,...aiRoleList, ...newData.slice(5,10)]} ) )
    set({ loading: false });

  }
}))


export default useAiRoleListStore