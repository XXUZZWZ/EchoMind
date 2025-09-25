import React from 'react';
import styles from './index.module.css';

interface TabItem {
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  title: string;
  path: string;
}

interface CustomTabbarProps {
  items: TabItem[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const CustomTabbar: React.FC<CustomTabbarProps> = ({ items, activeIndex, onChange }) => {
  return (
    <div className={styles.tabbarContainer}>
      <div className={styles.tabbar}>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${styles.tabItem} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => onChange(index)}
          >
            <div className={styles.iconWrapper}>
              {activeIndex === index && item.activeIcon ? item.activeIcon : item.icon}
            </div>
            <span className={styles.title}>{item.title}</span>
            {activeIndex === index && <div className={styles.activeIndicator} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomTabbar;
