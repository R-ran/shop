import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { useTypes } from '@/framework/type';
import { useRouter } from 'next/router';
const useLayout = () => {
  const data = useTypes({
    limit: TYPES_PER_PAGE,
  });
  const router = useRouter();
  // 确保 types 是数组
  const typesArray = Array.isArray(data?.types) ? data.types : [];
  const regex = /^\/$|^\/\?(.*)/;
  if (regex.test(router?.asPath)) {
    const homePage =
      typesArray.find((type) => type?.settings?.isHome) ?? typesArray[0];
    return {
      layout: homePage?.settings?.layoutType ?? 'default',
      page: homePage,
    };
  }
  const page = typesArray.find((type) => router.asPath.includes(type?.slug!));
  return {
    layout: page?.settings?.layoutType ?? 'default',
    page,
  };
};

export default useLayout;
