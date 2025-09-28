import ReactMarkdown from 'react-markdown';


const MarkdownRenderer = ({ markdown }) => {
  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};
export default MarkdownRenderer;