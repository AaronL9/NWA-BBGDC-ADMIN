import { useEffect, useState } from "react";
import algoliasearch from "algoliasearch";

// Pagination
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import ArticleCard from "../../components/articles/ArticleCard";
import "./articles.css";
import Spinner from "../../components/global/spinner/Spinner";

const searchClient = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_SEARCH_KEY
);
const mainIndex = searchClient.initIndex("news");

export default function Articles() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageNum, setPageNum] = useState(0);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const { hits, nbHits } = await mainIndex.search("", {
          page: page - 1,
          hitsPerPage: 9,
          cacheable: false,
        });
        setPageNum(Math.ceil(nbHits / 9));
        setNews(hits);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [page]);

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Spinner />
        </div>
      )}
      <h2 className="banner__title">Articles</h2>
      <div className="crime-board">
        <div className="crime-board-post">
          {news.map((news, index) => (
            <ArticleCard key={index} docId={news.objectID} {...news} />
          ))}
        </div>
        <div className="news-pagination">
          <Stack spacing={2}>
            <Pagination count={pageNum} page={page} onChange={handleChange} />
          </Stack>
        </div>
      </div>
    </>
  );
}
