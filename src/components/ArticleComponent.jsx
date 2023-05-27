import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';

const ArticlesComponent = () => {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [current, setCurrent] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (isFetching) {
      axios
        .get(
          `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${current}`
        )
        .then((response) => {
          setPosts([...posts, ...response.data]);
          setTotalCount(+response.headers['x-total-count']);
        })
        .catch((err) => console.error(err.message))
        .finally(() => setTimeout(() => setIsFetching(false), 500));
    }
  }, [isFetching]);

  const loadMoreArticles = async () => {
    if (posts.length < totalCount) {
      setIsFetching(true);
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <div className="articles">
      <h1 className="articles__title">Latest Articles</h1>
      <div className="articles__list">
        <div className="articles__btn-wrapper">
          <button
            className="articles__load-more-button"
            onClick={loadMoreArticles}
            disabled={isFetching || posts.length === totalCount}
          >
            {isFetching
              ? 'Loading articles...'
              : posts.length === totalCount
              ? 'No more posts.'
              : 'Load More'}
          </button>
          <button
            className="articles__load-more-button"
            onClick={() => window.location.reload()}
            disabled={posts.length < totalCount}
          >
            Refresh
          </button>
        </div>
        <div className={`articles__items ${isFetching ? 'loading' : ''}`}>
          {posts
            .slice()
            .reverse()
            .map((post) => (
              <div key={post.id} className="articles__item">
                <h2 className="articles__item-title">
                  {post.id}. {post.title}
                </h2>
                <p className="articles__item-body">{post.body}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesComponent;
