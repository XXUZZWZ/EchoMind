import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Field } from 'react-vant'
import { ArrowLeft } from '@react-vant/icons'
import { useUserStore } from '../../store/useUserStore'
import useTitle from '../../hooks/useTitle'
import styles from './index.module.css'

const Register = () => {
  useTitle('注册')
  const navigate = useNavigate()
  const { Register } = useUserStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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

  const handleRegister = async () => {
    if (!formData.username.trim()) {
      setError('请输入用户名')
      return
    }
    if (!formData.password.trim()) {
      setError('请输入密码')
      return
    }
    if (!formData.confirmPassword.trim()) {
      setError('请确认密码')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    setError('')
    try {
      await Register({ username: formData.username, password: formData.password })
      
      // 注册成功后跳转
      navigate('/home', { replace: true })
    } catch (error: any) {
      setError(error?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/login', { replace: true }) // 返回登录页
  }

  const handleGoToLogin = () => {
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={handleGoBack}>
        <ArrowLeft size="24px" />
      </button>
      
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>创建账号</h1>
          <p className={styles.subtitle}>加入我们开始聊天之旅</p>
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

          <Field
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            placeholder="请确认密码"
            className={styles.field}
            clearable
          />

          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleRegister}
            className={styles.registerBtn}
            block
          >
            注册
          </Button>
        </div>

        <div className={styles.loginHint}>
          <p>已有账号？</p>
          <button className={styles.loginLink} onClick={handleGoToLogin}>
            立即登录
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
