import { useGroupsQuery } from '../gql/groups.graphql';
const useHomepage = () => {
  const { data } = useGroupsQuery();
  // 确保 types 是数组
  const types = Array.isArray(data?.types) ? data.types : [];
  const homePage =
    types.find((type:any) => type?.settings?.isHome) ?? types[0] ?? null;
  return {
    homePage: homePage || {
      slug: '',
    },
  };
};

export default useHomepage;
