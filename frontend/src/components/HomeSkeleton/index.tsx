import React from 'react';
import { Skeleton } from 'react-vant';
import styles from './index.module.css';

const HomeSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* 搜索框骨架 */}
      <div className={styles.searchSkeleton}>
        <Skeleton 
          row={1} 
          rowHeight={40}
          round
          animate
          loading={true}
        />
      </div>
      
      {/* 聊天区域骨架 */}
      <div className={styles.chatAreaSkeleton}>
        {/* 头像和标题区域 */}
        <div className={styles.headerSkeleton}>
          <Skeleton 
            avatar
            avatarSize={60}
            avatarShape="round"
            title
            titleWidth="60%"
            row={2}
            rowWidth={['80%', '60%']}
            animate
            loading={true}
          />
        </div>
        
        {/* 消息列表骨架 */}
        <div className={styles.messagesSkeleton}>
          <div className={styles.messageSkeleton}>
            <Skeleton 
              row={2}
              rowWidth={['70%', '50%']}
              rowHeight={16}
              round
              animate
              loading={true}
            />
          </div>
          
          <div className={styles.messageSkeleton}>
            <Skeleton 
              row={1}
              rowWidth="80%"
              rowHeight={16}
              round
              animate
              loading={true}
            />
          </div>
        </div>
        
        {/* 输入框骨架 */}
        <div className={styles.inputSkeleton}>
          <Skeleton 
            row={1}
            rowHeight={50}
            round
            animate
            loading={true}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;