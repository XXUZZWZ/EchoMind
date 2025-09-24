

import {
  Outlet,
  useNavigate,
  useLocation
}from "react-router-dom"
import {
  useEffect,
  useState,
  useMemo
}from 'react'
import {
  HomeO,
  Search,
  Plus,
  UserO,
  WapHome,
  Contact,
  ChatO,
  Chat
}from '@react-vant/icons'
import CustomTabbar from '../components/CustomTabbar/index'



const MainLayout = ()=>{
  const tabs = useMemo(() => [
    {
      icon: <HomeO/>,
      activeIcon: <WapHome/>,
      title: '首页',
      path: '/home'
    },
    {
      icon: <ChatO/>,
      activeIcon: <Chat/>,
      title: '消息',
      path: '/message'
    },
    {
      icon: <Plus/>,
      activeIcon: <Plus/>,
      title: '发布',
      path: '/publish'
    },
    {
      icon: <Search/>,
      activeIcon: <Search/>,
      title: '探索',
      path: '/explore'
    },
    {
      icon: <UserO/>,
      activeIcon: <Contact/>,
      title: '我的',
      path: '/account'
    },
  ], []);
  const [active,setActive] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(()=>{
   const index = tabs.findIndex(tab=>location.pathname.startsWith(tab.path))
   setActive(index>=0?index:0)
  },[location.pathname, tabs])

  const handleTabChange = (index: number) => {
    setActive(index);
    navigate(tabs[index].path, { replace: true });
  };

  return (
    <div className="flex flex-col h-screen" style={{paddingBottom:"68px"}}>
      <div className="flex-1">
        <Outlet/>
      </div>
      
      <CustomTabbar
        items={tabs}
        activeIndex={active}
        onChange={handleTabChange}
      />
    </div>
  )
}
export default MainLayout