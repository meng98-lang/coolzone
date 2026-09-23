# DESIGN.md

## 项目画像
- 独立英文营销落地站（`/sports`），面向健身/运动人群，用于 TikTok 广告投放 + WhatsApp 咨询转化（Click-to-WhatsApp）。
- 主转化动作：页面各处的「Chat on WhatsApp」按钮跳转 `wa.me/+1 8014052006` 发起会话获取报价单。
- 产品线：睾酮（Testosterone）、HGH、多肽（Peptides）及其他运动补剂类产品。

## 品牌与视觉方向
- 风格：硬核健身 + 力量感 + 专业实验室质感。
- 主色调：黑（`#0a0a0c`、`#111318`）+ 金（`#d4af37` / `#c9a227` 渐变）+ 白。
- 点缀：黄（CTA 高亮）、深灰卡片。
- 背景氛围：金属反光台面 / 昏暗健身房 / 哑铃等器械元素。
- 文字气势：超大加粗标题、斜体力量感衬线或 heavy sans；金色渐变大字。

## Design Tokens
- 背景：`#0a0a0c`（页面）、`#14161c`（卡片）。
- 主色（金）：`#d4af37` → 渐变 `linear-gradient(135deg,#f0d78c,#b8962e)`。
- CTA（黄草绿 WA 绿）：WhatsApp 官方绿 `#25D366`（hover `#1ebe5d`），用于转化按钮以保证识别度。
- 字体：英文用系统 heavy sans（`Helvetica Neue`/`Arial Black`），标题可配合 `uppercase` + 大号 `font-black`。
- 圆角：卡片 16–20px；按钮胶囊形。
- 阴影：`0 20px 60px rgba(0,0,0,.55)` + 金色边缘光。
- 动效：悬停微上浮 + 金色描边；CTA 呼吸/脉冲。

## 布局与响应式
- 单页长滚动：Hero → 卖点 → 产品区 → 服务承诺 → CTA 区 → 合规脚注。
- 移动优先，桌面居中定宽 `max-w-6xl`。
- 每屏至少一个 WhatsApp CTA；首屏 Hero 主 CTA + 常驻悬浮按钮。

## 交互与合规
- 所有 WhatsApp 按钮点击上报 TikTok 转化事件（`ttq.track('WhatsAppClick')` / `Lead`）。
- 页面底部保留健康合规免责声明文本段（用户自行确认产品合规口径）。

## 素材与实现备注
- 产品图：AI 生成 5 类补充剂注射瓶/胶囊风格图（透明玻璃瓶、黑金标签、金属锁口），置于金属台面对称排布。
- 图标：lucide-react（力量/恢复/供给/目标/保密/配送/可靠/品质）。
- 站点访问地址 `/sports`，相对独立，不接入 24 语言 i18n。