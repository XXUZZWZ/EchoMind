import styles from './index.module.css'
import { useState, useEffect } from 'react';
import { chat } from '../../llm';
import MarkdownRenderer from '../MarkdownRenderer';
import { memo } from 'react';
import LocalStorageUtil from '../../utils/LocalStorageUtil';


interface ChatAreaProps {
  prompt: string;
  placeholder?: string;
  backgroundImage?: string;
}

const ChatArea = ({ prompt, placeholder, backgroundImage }: ChatAreaProps) => {
  const storageKey = `chat_messages_${prompt?.slice(0, 20) || 'default'}`;

  const [inputValue, setInputValue] = useState('');
  interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

  const [messagesList, setMessagesList] = useState<Message[]>(() => {
    const saved = LocalStorageUtil.getItem<Message[]>(storageKey);
    return saved || [{ role: 'system', content: prompt }];
  });
  const [loading, setLoading] = useState(false);

  // 使用对话埋点Hook
  // const conversationAnalytics = useConversationAnalytics({
  //   prompt,
  //   autoStart: hasUserMessages, // 如果有历史消息，自动开始统计
  //   autoEnd: true
  // });

  // 保存消息到本地存储
  useEffect(() => {
    LocalStorageUtil.setItem(storageKey, messagesList);
  }, [messagesList, storageKey]);

  const addMessage = async (message: string, role: 'user' | 'assistant' | 'system') => {
    setLoading(true);

    // 添加用户消息
    const newMessages = [...messagesList, { role, content: message }];
    setMessagesList(newMessages);

    // 添加空的助手消息用于流式更新
    const assistantMessageIndex = newMessages.length;
    setMessagesList(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const endpoint = "https://api.deepseek.com/chat/completions";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: newMessages,
          stream: true
        })
      });

      // 流式输出处理
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';
      let fullContent = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const text = buffer + decoder.decode(value);
        buffer = '';

        const lines = text.split('\n').filter(line => line.startsWith('data:'));
        for (const line of lines) {
          const incoming = line.slice(6);
          if (incoming === '[DONE]') {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(incoming);
            const content = parsed.choices[0].delta.content;
            if (content) {
              fullContent += content;
              // 实时更新最后一条助手消息
              setMessagesList((prev: Message[]) => {
                const updated = [...prev];
                updated[assistantMessageIndex] = { role: 'assistant', content: fullContent };
                return updated;
              });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
            buffer = line;
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      // 错误处理：使用原有的非流式方式
      const res = await chat(newMessages);
      if (res?.data) {
        setMessagesList((prev: Message[]) => {
          const updated = [...prev];
          updated[assistantMessageIndex] = { role: res.data!.role, content: res.data!.content };
          return updated;
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      setInputValue('')
      return;
    }
    
    addMessage(inputValue, 'user');
    setInputValue('');
  }

  return (
    <div className={styles.chatArea}>
      <div className={styles.messagesContainer}>
        {messagesList.map((message: Message, index: number) => (
          <div key={index} className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}>
            <div className={styles.avatar}>
              {backgroundImage && message.role !== 'user' ? (
                <img src={backgroundImage} alt="Avatar" className={styles.avatarImage} />
              ) : (
                message.role === 'user' ? 'U' : 'AI'
              )}
            </div>
            <div className={styles.messageContent}>
              <MarkdownRenderer markdown={message.content} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            className={styles.customInput}
            placeholder={placeholder || "发消息给我吧"}
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value) }}
            disabled={loading}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim()) {
                  const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                  e.currentTarget.form?.dispatchEvent(formEvent);
                }
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            type="submit"
            className={styles.customSendButton}
            disabled={loading || !inputValue.trim()}
          >
            {loading ? '...' : '发送'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default memo(ChatArea)
