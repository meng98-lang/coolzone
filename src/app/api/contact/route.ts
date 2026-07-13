import { NextRequest, NextResponse } from 'next/server';
import { getInquiries, addInquiry, markInquiryAsRead, deleteInquiry } from '@/lib/db';

// GET /api/contact - 获取联系表单列表（需要管理员认证）
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const inquiries = await getInquiries();
  return NextResponse.json({ inquiries });
}

// POST /api/contact - 提交联系表单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, productName } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email and phone are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const inquiry = await addInquiry({ name, email, phone, message: message || '', productName });
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

// PUT /api/contact - 标记已读
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action } = body;

    if (action === 'read') {
      const success = await markInquiryAsRead(id);
      return NextResponse.json({ success });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/contact - 删除表单
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = await deleteInquiry(id);
  return NextResponse.json({ success });
}
