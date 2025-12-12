import { useGroupsQuery } from '../gql/groups.graphql';
import { useRouter } from 'next/router';
const useLayout = () => {
  const { data } = useGroupsQuery();
  const router = useRouter();
  // 确保 types 是数组
  const types = Array.isArray(data?.types) ? data.types : [];
  const regex = /^\/$|^\/\?(.*)/;
  if (regex.test(router?.asPath)) {
    const homePage =
      types.find((type:any) => type?.settings?.isHome) ?? types[0] ?? null;
    return {
      layout: homePage?.settings?.layoutType ?? 'default',
      page: homePage,
    };
  }
  const page = types.find((type:any) => type?.slug && router.asPath.includes(type.slug));
  return {
    layout: page?.settings?.layoutType ?? 'default',
    page: page || null,
  };
};

export default useLayout;
