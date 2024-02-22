import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

import ArticleCard from "../../components/articles/ArticleCard";
import "./articles.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const data = [];
      querySnapshot.forEach((doc) => {
        const obj = doc.data();
        obj.id = doc.id;
        data.push(obj);
      });
      setArticles(data);
    };
    fetchArticles();
  }, []);

  console.log(articles);
  return (
    <>
      <h2 className="banner__title">Articles</h2>
      <div className="crime-board">
        <div className="crime-board-post">
          {articles.map((article, index) => (
            <ArticleCard key={index} docId={article.id} {...article} />
          ))}
        </div>
      </div>
    </>
  );
}
