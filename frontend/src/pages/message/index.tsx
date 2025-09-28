import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatHistoryUtil from '../../utils/ChatHistoryUtil';
import styles from './index.module.css';
import useTitle from '../../hooks/useTitle';

interface ChatHistoryItem {
  id: string;
  prompt: string;
  placeholder: string;
  imageUrl: string;
  lastMessage?: string;
  lastMessageTime?: number;
  messageCount: number;
  hasMessages: boolean;
}

const Message = () => {
  useTitle('消息');
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const history = ChatHistoryUtil.getAllChatHistory();
    setChatHistory(history);
  }, []);

  const handleChatClick = (item: ChatHistoryItem) => {
    navigate('/home', { 
      state: { 
        selectedRole: {
          id: item.id,
          prompt: item.prompt,
          placeholder: item.placeholder,
          imageUrl: item.imageUrl
        }
      } 
    });
  };

  const getAvatarContent = (item: ChatHistoryItem) => {
    if (item.imageUrl && !item.imageUrl.includes('dummyimage.com')) {
      return <img src={item.imageUrl} alt="角色头像" />;
    }
    
    // 从prompt中提取角色名称的首字符
    const roleName = item.prompt.match(/我是(.{1,4})/)?.[1] || 
                    item.prompt.match(/作为(.{1,4})/)?.[1] || 
                    item.prompt.slice(0, 2);
    
    return (
      <div className={styles.avatarPlaceholder}>
        {roleName}
      </div>
    );
  };

  const getRoleTitle = (prompt: string) => {
    // 提取角色名称
    const roleMatch = prompt.match(/我是(.{1,10}?)(?:[，,。]|$)/) || 
                     prompt.match(/作为(.{1,10}?)(?:[，,。]|$)/);
    
    if (roleMatch) {
      return roleMatch[1];
    }
    
    return prompt.slice(0, 8) + (prompt.length > 8 ? '...' : '');
  };

  return (
    <div className={styles.messageContainer}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>消息</h1>
      </div>
      
      <div className={styles.chatContainer}>
        {chatHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <div>暂无聊天记录</div>
            <div>
              去首页开始聊天吧
            </div>
          </div>
        ) : (
          <div className={styles.chatList}>
            {chatHistory.map(item => (
              <div 
                key={item.id} 
                className={styles.chatItem}
                onClick={() => handleChatClick(item)}
              >
                <div className={styles.avatar}>
                  {getAvatarContent(item)}
                </div>
                
                <div className={styles.chatInfo}>
                  <div className={styles.chatHeader}>
                    <h3 className={styles.chatTitle}>
                      {getRoleTitle(item.prompt)}
                    </h3>
                    <span className={styles.messageTime}>
                      {ChatHistoryUtil.formatMessageTime(item.lastMessageTime || Date.now())}
                    </span>
                  </div>
                  
                  <div className={styles.lastMessageRow}>
                    <div className={styles.lastMessage}>
                      {ChatHistoryUtil.formatLastMessage(item.lastMessage || '', 30)}
                    </div>
                    {item.messageCount > 0 && (
                      <div className={`${styles.messageCount} ${item.messageCount === 0 ? styles.zero : ''}`}>
                        {item.messageCount > 99 ? '99+' : item.messageCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
