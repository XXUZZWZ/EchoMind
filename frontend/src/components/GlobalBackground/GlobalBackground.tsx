import React from 'react'

interface GlobalBackgroundProps {
  children: React.ReactNode
  // 背景类型：颜色、渐变、图片
  type?: 'color' | 'gradient' | 'image'
  // 背景值
  value?: string
  // 图片相关配置
  imageConfig?: {
    url: string
    size?: 'cover' | 'contain' | 'auto'
    position?: string
    repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
    opacity?: number
  }
  // 渐变配置
  gradientConfig?: {
    direction?: string
    colors: string[]
  }
  // 是否固定背景（不随内容滚动）
  fixed?: boolean
  // 自定义样式
  style?: React.CSSProperties
  // 自定义类名
  className?: string
}

const GlobalBackground: React.FC<GlobalBackgroundProps> = ({
  children,
  type = 'color',
  value = '#000000',
  imageConfig,
  gradientConfig,
  fixed = false,
  style = {},
  className = ''
}) => {
  // 生成背景样式
  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      ...style
    }

    switch (type) {
      case 'color':
        return {
          ...baseStyle,
          backgroundColor: value
        }

      case 'gradient':
        if (gradientConfig) {
          const { direction = 'to bottom', colors } = gradientConfig
          const gradient = `linear-gradient(${direction}, ${colors.join(', ')})`
          return {
            ...baseStyle,
            background: gradient
          }
        }
        return {
          ...baseStyle,
          backgroundColor: value
        }

      case 'image':
        if (imageConfig) {
          const {
            url,
            size = 'cover',
            position = 'center',
            repeat = 'no-repeat',
            opacity = 1
          } = imageConfig
          
          return {
            ...baseStyle,
            backgroundImage: `url(${url})`,
            backgroundSize: size,
            backgroundPosition: position,
            backgroundRepeat: repeat,
            backgroundAttachment: fixed ? 'fixed' : 'scroll',
            opacity
          }
        }
        return {
          ...baseStyle,
          backgroundColor: value
        }

      default:
        return {
          ...baseStyle,
          backgroundColor: value
        }
    }
  }

  return (
    <div 
      className={`global-background ${className}`}
      style={getBackgroundStyle()}
    >
      {children}
    </div>
  )
}

export default React.memo(GlobalBackground)
