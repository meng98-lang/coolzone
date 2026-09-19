import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 向后端返回前端直传对象存储所需的最小公开配置。
// 仅暴露 SUPABASE_URL / ANON_KEY（均为公开值），不暴露任何服务端密钥。
export async function GET() {
  return NextResponse.json({
    ok: true,
    supabaseUrl: process.env.COZE_SUPABASE_URL || "",
    supabaseAnonKey: process.env.COZE_SUPABASE_ANON_KEY || "",
  });
}