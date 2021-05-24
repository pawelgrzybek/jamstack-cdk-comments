interface IComment {
  id: string;
  name: string;
  comment: string;
  slug: string;
  createdAt: number;
}

interface ICommentsGroupedBySlug {
  [key: string]: {
    counter: number;
    comments: IComment[];
  };
}

export default (comments: IComment[]): ICommentsGroupedBySlug =>
  comments
    .sort((l, r) => (l.createdAt < r.createdAt ? -1 : 1))
    .reduce((acc, current) => {
      const { slug } = current;
      if (acc[slug]) {
        acc[slug].counter = acc[slug].counter + 1;
        acc[slug].comments.push(current);
        return acc;
      }

      return {
        ...acc,
        [slug]: {
          counter: 1,
          comments: [current],
        },
      };
    }, {} as ICommentsGroupedBySlug);
