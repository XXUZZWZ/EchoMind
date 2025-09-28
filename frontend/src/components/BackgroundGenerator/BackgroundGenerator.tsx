import { useState, useRef } from 'react'
import { Button, Cascader, Field, Picker, Toast } from 'react-vant'
import styles from './BackgroundGenerator.module.css'

interface BackgroundGeneratorProps {
  onBackgroundGenerated: (imageUrl: string) => void
  currentBackground?: string
  prompt?: string
}

const BackgroundGenerator: React.FC<BackgroundGeneratorProps> = ({
  onBackgroundGenerated,
  currentBackground,
  prompt
}) => {
  const uploadImageRef = useRef<HTMLInputElement>(null)

  const [imgPreview, setImgPreview] = useState('https://dummyimage.com/412x915/ddd/999&text=上传图片')
  const [theme, setTheme] = useState('科技')
  const [mood, setMood] = useState('温馨')
  const [style, setStyle] = useState('写实')
  const [color, setColor] = useState('蓝色')
  const [imgUrl, setImgUrl] = useState(currentBackground || '')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const updateImageData = () => {
    const input = uploadImageRef.current
    if (!input?.files || input.files.length === 0) return

    const file = input.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      setImgPreview(e.target?.result as string)
    }
  }

  const uploadUrl = 'https://api.coze.cn/v1/files/upload'
  const patToken = import.meta.env.VITE_PAT_TOKEN
  const themeOptions = ['科技', '自然', '城市', '抽象', '简约'];
  const moodOptions = ['温馨', '活力', '宁静', '梦幻', '专业'];
  const styleOptions = ['写实', '插画', '水彩', '油画', '卡通'];
  const colorOptions = ['蓝色', '紫色', '绿色', '橙色', '粉色'];
  const uploadFile = async () => {
    const formData = new FormData()
    const input = uploadImageRef.current
    if (!input?.files || input.files.length <= 0) return

    formData.append('file', input.files[0])

    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${patToken}` },
      body: formData,
    })

    const ret = await res.json()
    if (ret.code !== 0) {
      setStatus(ret.msg)
      return
    }

    return ret.data.id
  }

  const generate = async () => {
    console.log('generate 函数开始执行')
    console.log('prompt 值:', prompt)

    setLoading(true)
    setStatus("图片上传中...")

    try {
      console.log('开始上传文件')
      const file_id = await uploadFile()
      console.log('上传文件结果:', file_id)

      if (!file_id) {
        console.log('文件上传失败，退出')
        setStatus("图片上传失败")
        setLoading(false)
        return
      }

      setStatus("图片上传成功，正在生成聊天背景...")

      const parameters = {
        picture: JSON.stringify({ file_id }),
        theme: theme,
        mood: mood,
        style: style,
        color: color,
        aspect_ratio: "9:16",
        prompt: prompt || ''
      }

      const workflowUrl = 'https://api.coze.cn/v1/workflow/run'
      const workflow_id = '7533134717945561123'

      console.log('发送参数:', parameters)
      console.log('工作流URL:', workflowUrl)
      console.log('工作流ID:', workflow_id)

      const res = await fetch(workflowUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${patToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflow_id, parameters }),
      })

      const ret = await res.json()
      console.log('工作流响应:', ret)

      if (ret.code !== 0) {
        setStatus(`生成失败: ${ret.msg}`)
        return
      }

      const data = JSON.parse(ret.data)
      const generatedUrl = data.data
      setImgUrl(generatedUrl)
      setStatus('')

      Toast.success('背景生成成功！')
      onBackgroundGenerated(generatedUrl)

    } catch (error) {
      console.error('生成错误:', error)
      Toast.fail('生成失败，请重试')
      setStatus('')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.uploadSection}>
        <h4>上传参考图片</h4>
        <div className={styles.fileInput}>
          <input
            ref={uploadImageRef}
            type="file"
            id="background-image"
            accept="image/*"
            onChange={updateImageData}
            style={{ display: 'none' }}
          />
          <label htmlFor="background-image" className={styles.uploadLabel}>
            <img src={imgPreview} alt="预览" className={styles.preview} />
            <div className={styles.uploadTip}>点击上传图片</div>
          </label>
        </div>
      </div>

      <div className={styles.settingsSection}>
        <h4>风格设置</h4>
        <div className={styles.settings}>
          <div className={styles.settingGroup}>
            <label>主题风格</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="科技">科技</option>
              <option value="自然">自然</option>
              <option value="城市">城市</option>
              <option value="抽象">抽象</option>
              <option value="简约">简约</option>
            </select>

          </div>

          <div className={styles.settingGroup}>
            <label>氛围感</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="温馨">温馨</option>
              <option value="活力">活力</option>
              <option value="宁静">宁静</option>
              <option value="梦幻">梦幻</option>
              <option value="专业">专业</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label>艺术风格</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="写实">写实</option>
              <option value="插画">插画</option>
              <option value="水彩">水彩</option>
              <option value="油画">油画</option>
              <option value="卡通">卡通</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label>主色调</label>
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="蓝色">蓝色</option>
              <option value="紫色">紫色</option>
              <option value="绿色">绿色</option>
              <option value="橙色">橙色</option>
              <option value="粉色">粉色</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.resultSection}>
        <h4>生成结果</h4>
        <div className={styles.result}>
          {imgUrl ? (
            <img src={imgUrl} alt="生成的背景" className={styles.generatedImage} />
          ) : (
            <div className={styles.placeholder}>
              {status ? (
                <div className={styles.status}>{status}</div>
              ) : (
                <div className={styles.tip}>生成的背景将在这里显示</div>
              )}
            </div>
          )}
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        loading={loading}
        onClick={() => {
          console.log('按钮被点击了')
          generate()
        }}
        className={styles.generateBtn}
        block
      >
        生成背景
      </Button>
    </div>
  )
}

export default BackgroundGenerator



