import { create } from 'zustand'
import { chat, chatWithRole } from '../llm/index.ts'

interface Message {
  role: 'user' | 'assistant'
  message: string
}

interface ChatAreaStore {
  messagesList: Message[]
  loading: boolean
  addMessage: (message: string, role: 'user' | 'assistant') => void
  clearMessages: () => void
}

const useChatAreaStore = create<ChatAreaStore>((set, get) => ({
  messagesList: [],
  loading: false,
  addMessage: (message, role) => {
    set(state => ({
      messagesList: [...state.messagesList, { role, message }], loading: true,
    }))
    if(role === 'user'){
      chatWithRole([{ role, content: message }],"你是的角色是一只猫娘，每次对话必须带喵").then(res => { 
        if(res.data) {
          set(state => ({
            messagesList: [...state.messagesList, { role: res.data.role, message: res.data.content }], loading: false,
          }))
        }
      })
    }
  },
  clearMessages: () => set({ messagesList: [] })
}))

export default useChatAreaStore
