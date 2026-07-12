# CoolZone - 空调独立电商站

## 项目概览
面向欧洲市场的空调产品独立电商网站。基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui 构建。支持24种欧盟语言的多语言SEO。

## 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **i18n**: 自定义多语言方案（24种EU语言）

## 文件结构
```
src/
├── i18n/
│   ├── config.ts               # 语言配置（24种EU语言、默认语言、语言名称/旗帜）
│   ├── translations.ts         # 翻译字典（en/fr/de/es/it/nl/pt/pl 完整翻译）
│   └── language-context.tsx    # 语言上下文Provider（useTranslation hook）
├── middleware.ts               # 语言检测与重定向中间件
├── app/
│   ├── layout.tsx              # 根布局（最小化，传递给[locale]）
│   ├── page.tsx                # 根页面（重定向到/en）
│   ├── globals.css             # 全局样式
│   ├── [locale]/
│   │   ├── layout.tsx          # 多语言布局（LanguageProvider、Header、Footer等）
│   │   ├── page.tsx            # 首页（翻译内容、JSON-LD、hreflang）
│   │   ├── products/
│   │   │   ├── page.tsx        # 产品列表页（分类筛选、翻译）
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 产品详情页（翻译metadata、hreflang）
│   │   ├── contact/
│   │   │   └── page.tsx        # 联系表单页（翻译）
│   │   ├── checkout/
│   │   │   └── page.tsx        # 订单摘要页（翻译）
│   │   └── ok/
│   │       └── page.tsx        # 感谢页面（翻译、谷歌广告转化）
│   ├── products/
│   │   └── [slug]/
│   │       └── product-detail.tsx  # 产品详情客户端组件
│   ├── admin/                  # 后台管理（不本地化）
│   ├── api/                    # API路由（不本地化）
│   ├── sitemap.ts              # 多语言Sitemap
│   └── robots.ts               # Robots.txt
├── components/
│   ├── header.tsx              # 顶部导航（含语言切换器）
│   ├── footer.tsx              # 页脚（翻译链接）
│   ├── product-card.tsx        # 产品卡片（locale感知链接）
│   ├── language-switcher.tsx   # 语言切换器下拉组件
│   ├── contact-form.tsx        # 联系表单（翻译标签）
│   ├── cart-sidebar.tsx        # 购物车侧边栏
│   ├── whatsapp-float.tsx      # 悬浮WhatsApp按钮
│   ├── tracking-scripts.tsx    # FB像素+GA跟踪代码
│   └── traffic-tracker.tsx     # 流量追踪组件
└── lib/
    ├── products.ts             # 产品数据
    ├── store.tsx               # 购物车状态管理
    ├── whatsapp.ts             # WhatsApp配置
    ├── db.ts                   # 数据存储（JSON文件）
    └── utils.ts                # 工具函数
```

## 多语言SEO
- **支持语言**: 24种欧盟官方语言（en, fr, de, es, it, nl, pt, pl, sv, da, fi, cs, ro, hu, el, bg, hr, sk, sl, lt, lv, et, mt, ga）
- **完整翻译**: 英语、法语、德语、西班牙语、意大利语、荷兰语、葡萄牙语、波兰语
- **路由结构**: `/[locale]/page` 格式（如 `/fr/products`、`/de/contact`）
- **自动检测**: 中间件根据浏览器 Accept-Language 自动重定向
- **hreflang标签**: 每个页面自动生成所有语言版本的alternates
- **多语言Sitemap**: 为每种语言生成独立的URL条目，含alternates
- **语言切换器**: Header中的下拉组件，支持所有24种语言
- **SEO Metadata**: 每个页面根据语言生成对应的title、description、Open Graph

## 核心功能
1. **首页**: Hero区域、品牌特性、全部产品、数据统计、联系表单
2. **产品列表**: 按分类筛选、产品网格
3. **产品详情**: 图片画廊、规格参数、WhatsApp购买/加购、相关推荐
4. **购物车**: 侧边栏、数量调整、WhatsApp下单
5. **WhatsApp集成**: 悬浮按钮、产品咨询、订单跳转
6. **联系表单**: 客户留言，提交后跳转到 /ok
7. **后台管理**: /admin 登录查看表单、配置FB/GA/WhatsApp
8. **多语言**: 24种EU语言自动检测与切换

## 后台管理
- **访问地址**: /admin
- **默认密码**: coolzone2024

## 数据存储
- `data/inquiries.json` - 客户联系表单
- `data/settings.json` - 网站配置
- `data/traffic.json` - 流量统计
