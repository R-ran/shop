# Admin 部署配置指南

## 环境变量配置

在部署 admin 应用之前，您**必须**设置以下环境变量：

### 对于 REST API 版本 (`admin/rest`)

在您的部署平台（Vercel、Netlify、或其他平台）设置以下环境变量：

```bash
NEXT_PUBLIC_REST_API_ENDPOINT=https://your-api-domain.com/api
```

**重要**：
- 替换 `https://your-api-domain.com/api` 为您的实际 API 端点地址
- 不要使用 `localhost` 或 `127.0.0.1`（这些仅在本地开发时使用）
- 确保包含完整的 URL，包括协议（`http://` 或 `https://`）和路径（如 `/api`）

### 对于 GraphQL API 版本 (`admin/graphql`)

在您的部署平台设置以下环境变量：

```bash
NEXT_PUBLIC_GRAPHQL_API_ENDPOINT=https://your-api-domain.com/graphql
```

**重要**：
- 替换 `https://your-api-domain.com/graphql` 为您的实际 GraphQL API 端点地址
- 不要使用占位符值（如 `your_graphql_api_endpoint`）
- 确保包含完整的 URL

### 其他必需的环境变量

```bash
NEXT_PUBLIC_SHOP_URL=https://your-shop-domain.com
NEXT_PUBLIC_AUTH_TOKEN_KEY=AUTH_CRED
APPLICATION_MODE=production
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## 如何在 Vercel 上设置环境变量

1. 登录到 Vercel 控制台
2. 选择您的项目
3. 进入 **Settings** > **Environment Variables**
4. 添加上述环境变量
5. 确保选择正确的环境（Production、Preview、Development）
6. 重新部署应用

## 如何在其他平台设置环境变量

大多数部署平台都支持环境变量设置：

- **Netlify**: Site settings > Environment variables
- **AWS Amplify**: App settings > Environment variables
- **Railway/Render**: 项目设置中的 Environment 部分

## 验证配置

部署后，检查浏览器控制台：

✅ **成功配置**: 应用正常加载，无网络错误

❌ **配置错误**: 控制台显示 `Network Error` 或 `ERR_CONNECTION_REFUSED`

如果看到错误，请确认：
1. 环境变量已正确设置
2. API 端点 URL 正确且可访问
3. 已重新部署应用（环境变量更改需要重新部署）

## 故障排除

### 错误：`NEXT_PUBLIC_REST_API_ENDPOINT is not defined`

**解决方案**: 在部署平台设置 `NEXT_PUBLIC_REST_API_ENDPOINT` 环境变量

### 错误：`ERR_CONNECTION_REFUSED` 或 `Network Error`

**可能原因**:
1. API 端点地址错误
2. API 服务器未运行或不可访问
3. CORS 配置问题
4. 环境变量未正确应用（需要重新部署）

**解决方案**:
1. 验证 API 端点是否可以从浏览器访问
2. 检查 API 服务器的 CORS 设置
3. 确认环境变量已保存并重新部署

## 本地开发

本地开发时，应用会自动使用默认值：
- REST API: `http://localhost:5000/api`
- GraphQL API: `http://localhost:5000/graphql`

您也可以创建 `.env.local` 文件覆盖这些值：

```bash
NEXT_PUBLIC_REST_API_ENDPOINT=http://localhost:5000/api
NEXT_PUBLIC_GRAPHQL_API_ENDPOINT=http://localhost:5000/graphql
```

