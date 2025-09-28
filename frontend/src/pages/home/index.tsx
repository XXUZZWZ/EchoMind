import { useNavigate, useLocation } from 'react-router-dom'
import useTitle from '../../hooks/useTitle'
import useAiRoleListStore from '../../store/useAiRoleListStore'
import styles from './index.module.css'
import { Swiper } from 'react-vant'
import ChatArea from '../../components/ChatArea'
import HomeSkeleton from '../../components/HomeSkeleton'
import LocalStorageUtil from '../../utils/LocalStorageUtil'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
// import { usePageAnalytics, useConversationAnalytics } from '../../hooks/useAnalytics'
const Home = () => {
  useTitle('首页')
  const navigate = useNavigate();
  const location = useLocation();
  const [initialIndex, setInitialIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const swiperRef = useRef(null);

  // 使用页面埋点Hook
  // const pageAnalytics = usePageAnalytics({
  //   pageUrl: '/home',
  //   autoTrack: true
  // });

  // 使用对话埋点Hook（用于AI角色切换）
  // const conversationAnalytics = useConversationAnalytics({
  //   autoStart: false,
  //   autoEnd: false
  // });
  
  // const handleSearch = () => {
  //   navigate('/search')
  // }
  
  const { aiRoleList, loading, fetchMoreAiRoleList } = useAiRoleListStore();
  
  useEffect(() => {
    LocalStorageUtil.setItem('aiRoleList', aiRoleList)
  }, [aiRoleList])

  // 监听当前AI角色变化，切换对话统计
  // useEffect(() => {
  //   if (aiRoleList.length > 0 && aiRoleList[currentIndex]) {
  //     const currentRole = aiRoleList[currentIndex];
  //     // 切换到新的AI角色
  //     conversationAnalytics.switchAiRole(currentRole.id);
  //   }
  // }, [currentIndex, aiRoleList, conversationAnalytics]);

  // 预加载图片
  useLayoutEffect(() => {
    if (aiRoleList.length > 0) {
      const currentImage = getCurrentBackgroundImage();
      if (!loadedImages.has(currentImage)) {
        setImageLoading(true);
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, currentImage]));
          setImageLoading(false);
        };
        img.onerror = () => {
          setImageLoading(false);
        };
        img.src = currentImage;
      } else {
        setImageLoading(false);
      }
    }
  }, [currentIndex, aiRoleList]);

  // 处理从message页面跳转过来的选中角色
  useLayoutEffect(() => {
    if (location.state?.selectedRole && aiRoleList.length > 0) {
      const selectedRole = location.state.selectedRole;
      const index = aiRoleList.findIndex(role => role.id === selectedRole.id);
      
      if (index !== -1) {
        setInitialIndex(index);
        setCurrentIndex(index);
        
        setTimeout(() => {
          if (swiperRef.current) {
            swiperRef.current.swipeTo(index);
          }
        }, 300);
      }
      
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 500);
    }
  }, [location.state, aiRoleList, navigate, location.pathname]);
  
  const handleChange = (index: number) => {
    setCurrentIndex(index);
    if (index >= aiRoleList.length - 1) {
      fetchMoreAiRoleList()
    }
  }

  // 获取当前背景图片
  const getCurrentBackgroundImage = () => {
    if (aiRoleList.length > 0 && aiRoleList[currentIndex]) {
      return aiRoleList[currentIndex].imageUrl;
    }
    return "http://dummyimage.com/412x915/79f29c/fff&text=image";
  }

  // 如果数据还在加载或者没有数据，显示骨架屏
  if (loading || aiRoleList.length === 0) {
    return <HomeSkeleton />;
  }
  
  return (
    <div 
      className={styles.container}
      style={{
        backgroundImage: !imageLoading ? `url(${getCurrentBackgroundImage()})` : 'none',
        backgroundColor: imageLoading ? '#1c1c1e' : 'transparent',
        transition: 'background-image 0.3s ease-in-out'
      }}
    >
      {/* 左侧加号按钮 */}
      <div className={styles.leftFloatingButton}>
        <div className={styles.floatingBall}>
          <svg 
            className={styles.icon}
            viewBox="0 0 1024 1024" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M514.048 62.464q93.184 0 175.616 35.328t143.872 96.768 96.768 143.872 35.328 175.616q0 94.208-35.328 176.128t-96.768 143.36-143.872 96.768-175.616 35.328q-94.208 0-176.64-35.328t-143.872-96.768-96.768-143.36-35.328-176.128q0-93.184 35.328-175.616t96.768-143.872 143.872-96.768 176.64-35.328zM772.096 576.512q26.624 0 45.056-18.944t18.432-45.568-18.432-45.056-45.056-18.432l-192.512 0 0-192.512q0-26.624-18.944-45.568t-45.568-18.944-45.056 18.944-18.432 45.568l0 192.512-192.512 0q-26.624 0-45.056 18.432t-18.432 45.056 18.432 45.568 45.056 18.944l192.512 0 0 191.488q0 26.624 18.432 45.568t45.056 18.944 45.568-18.944 18.944-45.568l0-191.488 192.512 0z" 
              fill="currentColor">
            </path>
          </svg>
        </div>
      </div>

      {/* 右侧浮球按钮组 */}
      <div className={styles.rightFloatingButtons}>
        {/* 搜索按钮 */}
        <div 
          className={`${styles.floatingBall} ${styles.searchButton}`}
          onClick={() => navigate('/search')}
        >
          <svg 
            className={styles.icon}
            viewBox="0 0 1024 1024" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M920.32 841.813333l-172.373333-172.373333a365.781333 365.781333 0 0 0 71.253333-217.173333c0-202.24-164.693333-366.933333-366.933333-366.933334S85.333333 250.026667 85.333333 452.266667s164.693333 366.933333 366.933334 366.933333c81.066667 0 156.16-26.453333 217.173333-71.253333l172.373333 172.373333c10.666667 10.666667 25.173333 16.213333 39.253334 16.213333a55.381333 55.381333 0 0 0 39.253333-94.72zM175.786667 452.266667c0-152.746667 124.16-276.906667 276.906666-276.906667s276.906667 124.16 276.906667 276.906667-124.16 276.906667-276.906667 276.906666-276.906667-124.16-276.906666-276.906666z" 
              fill="currentColor">
            </path>
          </svg>
        </div>

        {/* 菜单按钮 */}
        <div className={styles.floatingBall}>
          <svg 
            className={styles.icon}
            viewBox="0 0 1024 1024" 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M186.0352 378.7776c-73.7536 0-133.76 60.0064-133.76 133.76s60.0064 133.76 133.76 133.76 133.76-60.0064 133.76-133.76S259.7888 378.7776 186.0352 378.7776zM268.8768 512.5376c0 45.696-37.1712 82.8672-82.8416 82.8672S103.168 558.208 103.168 512.5376s37.1712-82.8416 82.8672-82.8416S268.8768 466.8416 268.8768 512.5376zM509.7472 378.7776c-73.7536 0-133.76 60.0064-133.76 133.76s60.0064 133.76 133.76 133.76 133.76-60.0064 133.76-133.76S583.5008 378.7776 509.7472 378.7776zM592.5888 512.5376c0 45.696-37.1712 82.8672-82.8672 82.8672s-82.8416-37.1712-82.8416-82.8672 37.1712-82.8416 82.8416-82.8416S592.5888 466.8416 592.5888 512.5376zM839.04 378.7776c-73.7536 0-133.76 60.0064-133.76 133.76s60.0064 133.76 133.76 133.76c73.7536 0 133.76-60.0064 133.76-133.76S912.7936 378.7776 839.04 378.7776zM921.8816 512.5376c0 45.696-37.1712 82.8672-82.8416 82.8672s-82.8672-37.1712-82.8672-82.8672 37.1712-82.8416 82.8672-82.8416S921.8816 466.8416 921.8816 512.5376z" 
              fill="currentColor">
            </path>
          </svg>
        </div>
      </div>
      {/* <Search placeholder="搜索你喜欢的角色" onClickInput={handleSearch} className={styles.search} /> */}
      
      <Swiper 
        ref={swiperRef}
        className={styles.swiper} 
        onChange={handleChange} 
        touchable={!loading && !imageLoading}
        indicator={false}
        stuckAtBoundary={true}
        defaultIndex={initialIndex}
        key={`swiper-${initialIndex}-${aiRoleList.length}`}
      >
        {aiRoleList.map((item) => {
          return (
            <Swiper.Item key={item.id}>
              <div>&nbsp;</div>
              <ChatArea 
                prompt={item.prompt} 
                placeholder={item.placeholder}
                backgroundImage={item.imageUrl}
              />
            </Swiper.Item>
          )
        })} 
      </Swiper>
    </div>
  )
}

export default Home
