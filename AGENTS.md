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
│   ├── layout.tsx              # 根布局（CartProvider、Header、Footer）
│   ├── page.tsx                # 首页（Hero、特性、精选产品、统计、CTA）
│   ├── globals.css             # 全局样式
│   ├── products/
│   │   ├── page.tsx            # 产品列表页（分类筛选）
│   │   └── [slug]/
│   │       ├── page.tsx        # 产品详情页（服务端）
│   │       └── product-detail.tsx  # 产品详情客户端组件
│   └── checkout/
│       └── page.tsx            # 结算页面（表单+订单摘要）
├── components/
│   ├── header.tsx              # 顶部导航（响应式+购物车图标）
│   ├── footer.tsx              # 页脚
│   ├── product-card.tsx        # 产品卡片（SVG插图+加购按钮）
│   ├── cart-sidebar.tsx        # 购物车侧边栏
│   └── ui/                     # shadcn/ui 组件
└── lib/
    ├── products.ts             # 产品数据与类型定义
    ├── store.tsx               # 购物车状态管理（Context + useReducer）
    └── utils.ts                # 工具函数
```

## 核心功能
1. **首页**: Hero区域、品牌特性展示、精选产品推荐、数据统计、CTA
2. **产品列表**: 按分类筛选（壁挂式/便携式/中央空调）、产品网格
3. **产品详情**: 大图展示、规格参数、特性列表、相关推荐
4. **购物车**: 侧边栏滑出、数量调整、删除、小计计算
5. **结算流程**: 联系信息、配送地址（欧洲国家）、支付表单、订单确认
6. **SVG产品插图**: 程序化生成的空调产品SVG动画

## 产品数据
6款空调产品，3个分类：
- 壁挂式: Arctic Breeze 9000, Alpine Cool Pro, Glacier Max 18000
- 便携式: BreezePort 360, CoolMove 500
- 中央空调: MultiZone Central 30000

## 设计特点
- 蓝色/青色品牌色调，渐变背景
- SVG动画产品插图（气流效果、LED闪烁）
- 响应式布局，移动端适配
- 购物车状态全局管理（React Context）
- 欧洲增值税(19%)计算、免运费门槛(€500)
