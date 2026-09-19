import { redirect } from 'next/navigation';

// 易经课程短链：/yijing -> 标准播放页
export default function YijingShortcut() {
  redirect('/yijing-class/watch.html?id=yijing');
}