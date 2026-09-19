# CoolZone - Premium Air Conditioning E-commerce

面向欧洲市场的空调产品独立电商网站。

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## 功能特性

### 前台
- 产品展示（7款空调，4个分类）
- 产品详情页（图片画廊、规格参数）
- 购物车系统
- WhatsApp 咨询/下单
- 客户联系表单
- 转化追踪页面 (/ok)

### 后台管理 (/admin)
- 密码：`coolzone2024`（首次登录后请修改）
- 查看客户联系表单
- 配置 Facebook Pixel ID
- 配置 Google Analytics ID
- 更换 WhatsApp 号码
- 流量统计（每日访问、来源国家、搜索词）

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 部署到 Vercel

1. 推送代码到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 自动检测 Next.js 项目，点击 Deploy

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页
│   ├── products/             # 产品列表和详情
│   ├── contact/              # 联系表单
│   ├── checkout/             # 结算页面
│   ├── ok/                   # 转化追踪页面
│   ├── admin/                # 后台管理
│   └── api/                  # API 路由
├── components/               # React 组件
└── lib/                      # 工具函数和数据
```

## 数据说明

- 产品数据：`src/lib/products.ts`
- 联系表单：`data/inquiries.json`
- 网站设置：`data/settings.json`
- 流量统计：`data/traffic.json`

## License

MIT
