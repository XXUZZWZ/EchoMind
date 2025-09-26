import { memo, useRef, useState, useEffect, useMemo } from "react";
import { debounce } from "../../utils/debounce";
import { ArrowLeft, Close } from "@react-vant/icons";
import styles from "./index.module.css";
import useSearchStore from "../../store/useSearchStore";
import { useNavigate } from "react-router-dom";

const SearchBox = (props) => {
  const { suggestList, setSuggestList } = useSearchStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { handleQuery } = props;
  
  const queryRef = useRef(null);
  const handleChange = (e) => {
    let val = e.currentTarget.value;
    setQuery(val);
   
  };
  const clearQuery = () => {
    setQuery("");
    queryRef.current.value = "";
    queryRef.current.focus();
  };
  
  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 300);
  }, []);
  const displayStyle = query ? { display: "block" } : { display: "none" };
  useEffect(() => {
    console.log(query, "/////");
    handleQueryDebounce(query);
  }, [query]);

  return (
    <div className={styles.wrapper}>
    <ArrowLeft 
      onClick={() => navigate(-1)} 
      size="24px"
    />
    <input
      type="text"
      className={styles.ipt}
      placeholder="搜索你喜欢的角色"
      ref={queryRef}
      onChange={handleChange}
    />
    <Close 
      onClick={clearQuery} 
      style={displayStyle} 
      size="20px"
    />
  </div>
  );
};

export default memo(SearchBox);
