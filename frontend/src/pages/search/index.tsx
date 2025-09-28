import SearchBox from "../../components/SeachBox"
import { useCallback } from "react"
import useSearchStore from "../../store/useSearchStore"
import styles from "./index.module.css"
import { useState } from "react"
import { useEffect, memo } from "react"
import useTitle from "../../hooks/useTitle"


const HotListItems = memo(({ hotList }) => {
  console.log('----', hotList)
  return (
    <div className={styles.list}>
    <h1 className={styles.listTitle}>🔥 热门角色</h1>
    {hotList.map((item) => (
      <div className={styles.item} key={item.id}>
        <div className={styles.itemContent}>
          <div className={styles.itemIcon}>
            {item.role.charAt(0)}
          </div>
          <div className={styles.itemText}>{item.role}</div>
        </div>
      </div>
    ))}
  </div>
  )
})

const Search = () => {

  useTitle('搜索');
  const [query, setQuery] = useState("")
  const {
    suggestList,
    setSuggestList,
    hotList,
    setHotList
  } = useSearchStore();

  useEffect(() => {
    setHotList();
  }, [])

  const handleQuery = useCallback((query) => {
    //处理api 请求
    setQuery(query)
    if (!query) return;
    setSuggestList(query)
    console.log("handleQuery")

  },[])
  const suggestListStyle = {
    display: query.length > 0 ? "block" : "none",
  };
  return (
    <div className={styles.container}>
    <div className={styles.wrapper}>
      <div className={styles.searchSection}>
        <SearchBox handleQuery={handleQuery} />
      </div>
      
      <div className={styles.contentArea}>
        <div className={styles.suggestList} style={suggestListStyle}>
          {suggestList.map(item => (
            <div key={item} className={styles.suggestItem}>
              <span>{item}</span>
            </div>
          ))}
        </div>
        
        <HotListItems hotList={hotList} />
      </div>
    </div>
  </div>
  )
}
export default Search