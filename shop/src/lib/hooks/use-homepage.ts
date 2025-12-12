import { TYPES_PER_PAGE } from '@/framework/client/variables';
import { useTypes } from '@/framework/type';

export default function useHomepage() {
  const { types } = useTypes({
    limit: TYPES_PER_PAGE,
  });
  // 确保 types 是数组
  const typesArray = Array.isArray(types) ? types : [];
  if (!typesArray || typesArray.length === 0) {
    return {
      homePage: {
        slug: '',
      },
    };
  }
  return {
    homePage: typesArray.find((type:any) => type?.settings?.isHome) ?? typesArray[0],
  };
}
