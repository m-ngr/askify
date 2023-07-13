import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

interface InfiniteScrollProps {
  fetchData: () => Promise<boolean>;
  children: ReactNode;
  loadingElement?: ReactNode;
  loadMoreElement?: ReactNode;
  endElement?: ReactNode;
}

export default function InfiniteScroll({
  fetchData,
  children,
  loadingElement,
  loadMoreElement,
  endElement,
}: InfiniteScrollProps) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerElement = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      if (!(await fetchData())) setHasMore(false);
    } catch {}

    setLoading(false);
  }, [fetchData, hasMore, loading]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target: any = entries[0];
      if (target.isIntersecting && hasMore) {
        loadMore();
      }
    };

    if (observerElement.current) {
      const observer = new IntersectionObserver(handleObserver, options);
      observer.observe(observerElement.current);
      return () => observer.disconnect();
    }
  }, [hasMore, loadMore]);

  return (
    <>
      {children}

      {loading && loadingElement}

      {hasMore && (
        <div ref={observerElement} onClick={loadMore}>
          {loadMoreElement}
        </div>
      )}

      {!hasMore && endElement}
    </>
  );
}
