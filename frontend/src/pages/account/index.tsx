
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUserStore'
import useTitle from '../../hooks/useTitle'
import ChatHistoryUtil from '../../utils/ChatHistoryUtil'
import styles from './index.module.css'

const Account = () => {
  useTitle('我的')
  const navigate = useNavigate()
  const { user, Logout } = useUserStore()
  const [chatHistory, setChatHistory] = useState([])
  const [activeTab, setActiveTab] = useState('作品')

  const loadUserWorks = () => {
    const history = ChatHistoryUtil.getAllChatHistory()
    
    // 获取所有用户创建的角色
    const allRoles = JSON.parse(localStorage.getItem('aiRoleList') || '[]')
    const userCreatedRoles = allRoles.filter(role => role.id.startsWith('user_'))
    
    // 合并有聊天记录的角色和新创建的角色
    const existingIds = new Set(history.map(item => item.id))
    const newRoles = userCreatedRoles.filter(role => !existingIds.has(role.id))
    
    const combinedHistory = [
      ...history,
      ...newRoles.map(role => ({
        id: role.id,
        prompt: role.prompt,
        placeholder: role.placeholder,
        imageUrl: role.imageUrl,
        title: role.title,
        description: role.description,
        lastMessage: '',
        lastMessageTime: role.createdAt || Date.now(),
        messageCount: 0,
        hasMessages: false
      }))
    ]
    
    // 按创建时间排序
    combinedHistory.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0))
    setChatHistory(combinedHistory)
  }

  useEffect(() => {
    loadUserWorks()
  }, [])

  // 监听页面可见性变化，从其他页面返回时重新加载
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadUserWorks()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const handleLogout = () => {
    Logout()
    navigate('/home', { replace: true })
  }

  const handleWorkClick = (work) => {
    navigate('/home', {
      state: {
        selectedRole: {
          id: work.id,
          prompt: work.prompt || chatHistory.find(item => item.id === work.id)?.prompt,
          placeholder: work.placeholder || chatHistory.find(item => item.id === work.id)?.placeholder,
          imageUrl: work.imageUrl
        }
      }
    })
  }

  // 统计数据
  const stats = {
    获赞: 0,
    互关: 18,
    关注: 150,
    粉丝: 28
  }

  // 作品数据 - 从聊天记录中获取
  const works = chatHistory.map(item => ({
    id: item.id,
    title: item.title || 
           item.prompt.match(/我是(.{1,10}?)(?:[，,。]|$)/)?.[1] || 
           item.prompt.match(/作为(.{1,10}?)(?:[，,。]|$)/)?.[1] || 
           item.prompt.slice(0, 8),
    description: item.description || `${item.messageCount || 0}人参与`,
    imageUrl: item.imageUrl
  }))

  const tabs = ['作品', '推荐', '收藏', '喜欢']

  return (
    <div className={styles.container}>
      {/* 头部背景 */}
      <div className={styles.header}>
        {/* 退出登录按钮 */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </button>
        
        <div className={styles.headerContent}>
          {/* 用户头像 */}
          <div className={styles.avatar}>
            <img 
              src={user?.avatar || 'http://dummyimage.com/100x100/79f29c/fff&text=头像'} 
              alt="用户头像" 
            />
          </div>
          
          {/* 用户信息 */}
          <div className={styles.userInfo}>
            <h2 className={styles.nickname}>
              {user?.username || '一包纸巾5美刀'}
            </h2>
            <p className={styles.userId}>
              账号：{user?.id || '3037571835'}
            </p>
          </div>
        </div>

        {/* 统计数据 */}
        <div className={styles.stats}>
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className={styles.statItem}>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{key}</div>
            </div>
          ))}
        </div>

        {/* 个人简介 */}
        <div className={styles.bio}>
          点击添加介绍，让大家认识你...
        </div>
      </div>

      {/* 标签页 */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <div 
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 作品列表 */}
      <div className={styles.content}>
        {activeTab === '作品' && (
          <div className={styles.works}>
            {works.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <div>暂无作品</div>
                <div className={styles.emptyTip}>去首页创建你的第一个AI角色吧</div>
              </div>
            ) : (
              <div className={styles.worksList}>
                {works.map(work => (
                  <div 
                    key={work.id} 
                    className={styles.workItem}
                    onClick={() => handleWorkClick(work)}
                  >
                    <div className={styles.workImage}>
                      <img src={work.imageUrl} alt={work.title} loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.workInfo}>
                      <h3 className={styles.workTitle}>{work.title}</h3>
                      <p className={styles.workDesc}>{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab !== '作品' && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🚧</div>
            <div>功能开发中</div>
            <div className={styles.emptyTip}>敬请期待</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Account

