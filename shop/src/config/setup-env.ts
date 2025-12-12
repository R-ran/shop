// 必须在所有 next-auth 相关导入之前执行
// 这个文件应该在应用启动时最早被导入

if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NEXT_PUBLIC_SITE_URL) {
    process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.VERCEL) {
    // Vercel 构建环境但没有 VERCEL_URL，使用占位符
    process.env.NEXTAUTH_URL = 'https://placeholder.vercel.app';
  } else {
    process.env.NEXTAUTH_URL = 'http://localhost:3003';
  }
}

// 确保 NEXTAUTH_URL 是一个有效的 URL
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith('http')) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL}`;
}

