interface ChatMessage {
  role: 'user' | 'assistant'|'system'
  content: string
}

interface ChatResponse {
  code: number
  data?: {
    role: 'assistant'
    content: string
  }
  msg?: string
}

const DEEPSEEK_CHAT_API_URL = "https://api.deepseek.com/chat/completions"
const KIMI_CHAT_API_URL = "https://api.moonshot.cn/v1/chat/completions"

export const chat = async (
  messages: ChatMessage[],
  api_url: string = DEEPSEEK_CHAT_API_URL,
  api_key: string = import.meta.env.VITE_DEEPSEEK_API_KEY,
  model: string = "deepseek-chat",
): Promise<ChatResponse> => {
  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: false,

      }),
    })
    const data = await response.json()
    return {
      code: 0,
      data: {
        role: "assistant",
        content: data.choices[0].message.content,
      },
    }
  } catch {
    return {
      code: 0,
      msg: "出错了...",
      data: { role: "assistant", content: "出错了..." },
    }
  }
}

export const kimiChat = async (messages: ChatMessage[]): Promise<ChatResponse> => {
  const res = await chat(
    messages,
    KIMI_CHAT_API_URL,
    import.meta.env.VITE_KIMI_API_KEY,
    "kimi-k2-0711-preview"
  )
  return res
}
export const chatWithRole = async(messages: ChatMessage[], role: string)=>{
  const res = await chat(
    [{ role:'system',
      content:role},...messages],
    DEEPSEEK_CHAT_API_URL,
    import.meta.env.VITE_DEEPSEEK_API_KEY,
    "deepseek-chat",
    role
  )
  return res;
}

// TODO: Implement avatar generation
export const generateAvatar = async (): Promise<void> => {
  throw new Error('Not implemented')
}
