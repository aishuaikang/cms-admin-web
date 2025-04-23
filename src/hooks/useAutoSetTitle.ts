import { useEffect } from 'react';
import { useMatches } from '@tanstack/react-router';
import { useCreation } from 'ahooks';

const useAutoSetTitle = () => {
  const matches = useMatches();

  const breadcrumbs = useCreation(
    () =>
      matches
        .filter((match) => match.context.title)
        .map(({ pathname, context }) => {
          return {
            title: context.title,
            path: pathname,
          };
        }),
    [matches]
  );

  const currentTitle = useCreation(
    () =>
      breadcrumbs
        .reverse()
        .map((item) => item.title)
        .join(' - '),
    [breadcrumbs]
  );

  useEffect(() => {
    if (currentTitle)
      document.title = `${currentTitle} - ${import.meta.env.VITE_APP_TITLE}`;
  }, [currentTitle]);
};

export default useAutoSetTitle;
