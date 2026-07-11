# CoolZone - 空调独立电商站

## 项目概览
面向欧洲市场的空调产品独立电商网站。基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui 构建。

## 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## 文件结构
```
src/
├── app/
│   ├── layout.tsx              # 根布局（CartProvider、Header、Footer、WhatsAppFloat、TrackingScripts）
│   ├── page.tsx                # 首页（Hero、特性、精选产品、统计、CTA）
│   ├── globals.css             # 全局样式
│   ├── products/
│   │   ├── page.tsx            # 产品列表页（分类筛选）
│   │   └── [slug]/
│   │       ├── page.tsx        # 产品详情页（服务端）
│   │       └── product-detail.tsx  # 产品详情客户端组件（WhatsApp购买+加购）
│   ├── contact/
│   │   └── page.tsx            # 联系表单页（客户留言）
│   ├── checkout/
│   │   └── page.tsx            # 订单摘要页（WhatsApp下单）
│   ├── admin/
│   │   ├── page.tsx            # 后台登录页
│   │   ├── layout.tsx          # 后台布局
│   │   ├── dashboard/page.tsx  # 后台仪表盘
│   │   ├── inquiries/page.tsx  # 客户表单查看
│   │   └── settings/page.tsx   # 网站设置（FB像素/GA/WhatsApp）
│   └── api/
│       ├── contact/route.ts    # 联系表单API（提交/列表/标记已读/删除）
│       └── settings/route.ts   # 设置API（获取/更新配置）
├── components/
│   ├── header.tsx              # 顶部导航（响应式+购物车+WhatsApp按钮）
│   ├── footer.tsx              # 页脚（WhatsApp链接+Contact链接）
│   ├── product-card.tsx        # 产品卡片（真实图片+WhatsApp咨询按钮）
│   ├── cart-sidebar.tsx        # 购物车侧边栏（WhatsApp下单按钮）
│   ├── whatsapp-float.tsx      # 悬浮WhatsApp按钮（全站可见）
│   ├── contact-form.tsx        # 联系表单组件（客户留言提交）
│   ├── tracking-scripts.tsx    # FB像素+GA跟踪代码组件
│   └── ui/                     # shadcn/ui 组件
└── lib/
    ├── products.ts             # 产品数据与类型定义
    ├── store.tsx               # 购物车状态管理（Context + useReducer）
    ├── whatsapp.ts             # WhatsApp配置（号码、URL生成函数）
    ├── db.ts                   # 数据存储（JSON文件：表单、设置）
    └── utils.ts                # 工具函数
```

## 核心功能
1. **首页**: Hero区域、品牌特性展示、精选产品推荐、数据统计、CTA
2. **产品列表**: 按分类筛选（壁挂式/便携式/中央空调/立柜式）、产品网格
3. **产品详情**: 大图展示、规格参数、特性列表、相关推荐、WhatsApp购买/加购
4. **购物车**: 侧边栏滑出、数量调整、删除、小计计算、WhatsApp下单
5. **订单摘要**: 订单明细、VAT计算、WhatsApp下单跳转
6. **WhatsApp集成**: 悬浮按钮全站可达、产品咨询、订单跳转
7. **联系表单**: 客户姓名、邮箱、电话、留言，提交后存入后台
8. **后台管理**: /admin 登录后可查看表单、配置FB像素/GA/WhatsApp号码
9. **跟踪代码**: 支持Facebook Pixel和Google Analytics，后台一键配置

## 产品数据
7款空调产品，4个分类：
- 壁挂式 (wall-mounted): Arctic Breeze 9000, Alpine Cool Pro, Glacier Max 18000
- 便携式 (portable): BreezePort 360, CoolMove 500
- 中央空调 (central): MultiZone Central 30000
- 立柜式 (floor-standing): FrostLine Tower 24000

## 后台管理
- **访问地址**: /admin
- **默认密码**: coolzone2024（可在后台修改）
- **功能**: 查看客户表单、配置FB像素ID、配置GA ID、更换WhatsApp号码

## 数据存储
- 联系表单和设置存储在 `data/` 目录下的JSON文件中
- `data/inquiries.json` - 客户联系表单
- `data/settings.json` - 网站配置（WhatsApp、FB像素、GA）

## 设计特点
- 蓝色/青色品牌色调，渐变背景
- 真实产品摄影图片（AI生成）
- 响应式布局，移动端适配
- 购物车状态全局管理（React Context）
- 欧洲增值税(19%)计算、免运费门槛(€500)
