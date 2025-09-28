import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Field } from 'react-vant'
import { ArrowLeft } from '@react-vant/icons'
import { useUserStore } from '../../store/useUserStore'
import useTitle from '../../hooks/useTitle'
import styles from './index.module.css'

const Login = () => {
  useTitle('登录')
  const navigate = useNavigate()
  const location = useLocation()
  const { Login } = useUserStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('') // 清除错误信息
  }

  const handleLogin = async () => {
    if (!formData.username.trim()) {
      setError('请输入用户名')
      return
    }
    if (!formData.password.trim()) {
      setError('请输入密码')
      return
    }

    setLoading(true)
    setError('')
    try {
      await Login(formData)
      
      // 登录成功后跳转
      const from = location.state?.from || '/home'
      navigate(from, { replace: true })
    } catch (error: any) {
      setError(error?.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/home', { replace: true }) // 返回上一页
  }

  const handleGoToRegister = () => {
    navigate('/register', { replace: true }) // 跳转到注册页
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={handleGoBack}>
        <ArrowLeft size="24px" />
      </button>
      
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>欢迎回来</h1>
          <p className={styles.subtitle}>登录你的账号继续聊天</p>
        </div>

        <div className={styles.form}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          <Field
            value={formData.username}
            onChange={(value) => handleInputChange('username', value)}
            placeholder="请输入用户名"
            className={styles.field}
            clearable
          />
          
          <Field
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="请输入密码"
            className={styles.field}
            clearable
          />

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            className={styles.loginBtn}
            block
          >
            登录
          </Button>
        </div>

        <div className={styles.tips}>
          <p>测试账号：admin</p>
          <p>测试密码：123456</p>
        </div>

        <div className={styles.registerHint}>
          <p>还没有账号？</p>
          <button className={styles.registerLink} onClick={handleGoToRegister}>
            立即注册
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
