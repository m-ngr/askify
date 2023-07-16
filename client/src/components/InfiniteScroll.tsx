import { ReactNode, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  children: ReactNode;
  fetchMore: () => any;
  loading: boolean;
  hasMore: boolean;
  loadingElement?: ReactNode;
  loadMoreElement?: ReactNode;
  endElement?: ReactNode;
}

export default function InfiniteScroll({
  children,
  fetchMore,
  loading,
  hasMore,
  loadingElement,
  loadMoreElement,
  endElement,
}: InfiniteScrollProps) {
  const observerElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target: any = entries[0];
      if (target.isIntersecting) {
        if (hasMore && !loading) fetchMore();
      }
    };

    if (observerElement.current) {
      const observer = new IntersectionObserver(handleObserver, options);
      observer.observe(observerElement.current);
      return () => observer.disconnect();
    }
  }, [fetchMore, hasMore, loading]);

  return (
    <>
      {children}

      {loading && loadingElement}

      {hasMore && (
        <div ref={observerElement} onClick={fetchMore}>
          {loadMoreElement}
        </div>
      )}

      {!hasMore && endElement}
    </>
  );
}
