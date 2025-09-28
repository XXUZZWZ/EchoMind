import styles from './index.module.css'
import { memo } from 'react'
const Loading = () => (
  <div className={styles.wrapper}>
    <div></div>
    <div></div>
  </div>
)

export default memo(Loading)