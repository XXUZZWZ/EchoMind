import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useTitle from '../../hooks/useTitle'
import useAiRoleListStore from '../../store/useAiRoleListStore'
import styles from './index.module.css'
import type { AiRoleItem } from '../../types'
import { Search } from 'react-vant'

const Explore = () => {
  useTitle('探索')
  const navigate = useNavigate()
  const { aiRoleList, loading, fetchMoreAiRoleList } = useAiRoleListStore()
  const [columns, setColumns] = useState<AiRoleItem[][]>([[], []])
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算瀑布流布局
  const calculateWaterfallLayout = useCallback(() => {
    const newColumns: AiRoleItem[][] = [[], []]

    // 使用轮转分配，避免随机高度导致的列失衡
    aiRoleList.forEach((item, index) => {
      const colIndex = index % 2
      newColumns[colIndex].push(item)
    })

    setColumns(newColumns)
  }, [aiRoleList])

  useEffect(() => {
    calculateWaterfallLayout()
  }, [calculateWaterfallLayout])

  // 滚动加载更多
  const handleScroll = useCallback(() => {
    if (loading) return
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    if (scrollTop + windowHeight >= documentHeight - 100) {
      fetchMoreAiRoleList()
    }
  }, [loading, fetchMoreAiRoleList])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // 点击角色卡片
  const handleRoleClick = (role: AiRoleItem) => {
    navigate('/home', {
      state: {
        selectedRole: role
      }
    })
  }

  // 提取角色名称
  const getRoleName = (prompt: string = "ai角色") => {
    const roleMatch = prompt.match(/我是(.{1,8}?)(?:[，,。]|$)/) || 
                     prompt.match(/作为(.{1,8}?)(?:[，,。]|$)/)
    
    if (roleMatch) {
      return roleMatch[1]
    }
    
    return prompt.slice(0, 6) + (prompt.length > 6 ? '...' : '')
  }
  const handleSearch = () => {
    navigate('/search')
  }
  return (
    <div className={styles.container}>
      <Search placeholder="搜索你喜欢的角色" onClickInput={handleSearch} className={styles.search} /> 

      <div className={styles.header}>
        <h1 className={styles.title}>探索角色</h1>
        <p className={styles.subtitle}>发现更多有趣的 AI 角色</p>
      </div>
      
      <div ref={containerRef} className={styles.waterfall}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map((item) => (
              <div 
                key={item.id} 
                className={styles.card}
                onClick={() => handleRoleClick(item)}
              >
                <div className={styles.cardImage}>
                  <img
                    src={item.imageUrl}
                    alt={getRoleName(item.prompt)}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.cardOverlay}>
                    <div className={styles.cardTitle}>
                      {getRoleName(item.prompt)}
                    </div>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <p className={styles.cardDescription}>
                    {item.prompt.slice(0, 50)}
                    {item.prompt.length > 50 ? '...' : ''}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardTag}>AI角色</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>加载更多角色中...</span>
        </div>
      )}
    </div>
  )
}

export default Explore
