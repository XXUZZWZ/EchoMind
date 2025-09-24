import {
  Suspense,
  lazy,
  useEffect
} from 'react'
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout'
import PureLayout from './layout/PureLayout'
import Loading from './components/Loading'
import { useUserStore } from './store/useUserStore'

const Home = lazy(() => import('./pages/home'))
const Login = lazy(() => import('./pages/login'))
const Register = lazy(() => import('./pages/register'))
const Account = lazy(() => import('./pages/account'))
const Publish = lazy(() => import('./pages/publish'))
const Explore = lazy(() => import('./pages/explore'))
const Message = lazy(() => import('./pages/message'))
const Search = lazy(() => import('./pages/search'))
const RequireAuth = lazy(() => import('./components/RequireAuth'))
function App() {
  const { InitializeAuth } = useUserStore()
  
  // 应用启动时检查登录状态
  useEffect(() => {
    InitializeAuth()
  }, [InitializeAuth])

  return (
   
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={ <RequireAuth><Account /></RequireAuth>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/message" element={<Message />} />
            <Route path="/publish" element={ <RequireAuth><Publish /></RequireAuth>} />
          
          </Route>
          <Route element={<PureLayout />} >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
         
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    
  )
}
import { getAiRole } from './api/getAiRole'
(async () => {
 const data =   await getAiRole('1')
 console.log(data)

})()

export default App

