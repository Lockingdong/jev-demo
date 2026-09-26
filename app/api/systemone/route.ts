import { NextRequest, NextResponse } from "next/server";

// 允許本機/公司網路代理或自簽憑證鏈環境連線
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function GET() {
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0);
  const keyPrefix = hasKey ? process.env.OPENROUTER_API_KEY!.slice(0, 10) + "..." : null;

  return NextResponse.json({
    hasKey,
    keyPrefix,
  });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error: {
            code: 401,
            message:
              "未偵測到 OPENROUTER_API_KEY。請在專案根目錄的 .env.local 中設定 OPENROUTER_API_KEY=sk-or-v1-xxx 後重新整理或重啟伺服器。",
          },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { model, state, questions, session_id } = body;

    if (!model || !state || !questions) {
      return NextResponse.json(
        {
          error: {
            code: 400,
            message: "缺少必要參數：model, state, questions 均為必填欄位。",
          },
        },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      model,
      state,
      questions,
    };

    if (session_id) {
      payload.session_id = session_id;
    }

    const startTime = Date.now();
    const openRouterRes = await fetch("https://openrouter.ai/api/v1/systemone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Jev System One Interactive Demo",
      },
      body: JSON.stringify(payload),
    });

    const elapsedMs = Date.now() - startTime;
    const responseData = await openRouterRes.json();

    if (!openRouterRes.ok) {
      return NextResponse.json(
        {
          error: responseData.error || {
            code: openRouterRes.status,
            message: responseData.message || "OpenRouter 回傳異常錯誤",
          },
          openrouter_metadata: responseData.openrouter_metadata,
          latencyMs: elapsedMs,
        },
        { status: openRouterRes.status }
      );
    }

    return NextResponse.json({
      ...responseData,
      latencyMs: elapsedMs,
    });
  } catch (err: unknown) {
    console.error("[SystemOne API Error]", err);
    const errorMsg = err instanceof Error ? err.message : "伺服器內部發生未知錯誤";
    const causeMsg = (err as { cause?: Error })?.cause?.message || (err as { cause?: unknown })?.cause;
    return NextResponse.json(
      {
        error: {
          code: 500,
          message: `代理請求失敗: ${errorMsg}${causeMsg ? ` (${causeMsg})` : ""}`,
        },
      },
      { status: 500 }
    );
  }
}
