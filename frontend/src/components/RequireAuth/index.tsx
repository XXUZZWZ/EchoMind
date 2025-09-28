import {useUserStore} from '../../store/useUserStore'
import {useNavigate,useLocation} from 'react-router-dom'
import { useEffect } from 'react';
const RequireAuth = ( {children} )=>{
  const navigator = useNavigate();
  const {pathname} = useLocation();
  const {isLogin} = useUserStore();
  
  useEffect(()=>{
    if(!isLogin){
      navigator('/login',{from : pathname})
   }
  },[])
  return (
    <div>
      {children}
    </div>
  )
}

export default RequireAuth;