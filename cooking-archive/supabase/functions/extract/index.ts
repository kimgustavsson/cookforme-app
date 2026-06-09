// Supabase Edge Function (Deno). 앱과 분리된 백엔드 — AI 키가 여기 있습니다.
// 소스 종류에 따라 추출 전략을 라우팅하고, 항상 동일한 ExtractResult를 돌려줍니다.
//
// 새 소스(예: 인스타) 추가 = 여기에 분기 하나 추가. 앱은 안 바뀝니다.

interface ExtractResult {
  title?: string;
  image?: string;
  servings?: number;
  ingredients: { name: string; quantity?: string }[];
  steps: string[];
  sourceUrl?: string;
  partial: boolean;
}

Deno.serve(async (req) => {
  const source = await req.json();
  let result: ExtractResult;

  switch (source.kind) {
    case 'web':
      result = await extractFromWeb(source.url);
      break;
    case 'youtube':
      result = await extractFromYoutube(source.url); // 설명/자막 → (필요시) AI 구조화
      break;
    case 'image':
      result = await extractFromImage(source.base64); // Vision AI
      break;
    default:
      return new Response(JSON.stringify({ error: 'unknown source' }), { status: 400 });
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});

// --- 추출 전략 (스텁) ---------------------------------------------------------
// TODO: 실제 구현. 웹은 JSON-LD(schema.org/Recipe) 우선, 실패 시 HTML 휴리스틱.
async function extractFromWeb(url: string): Promise<ExtractResult> {
  // const html = await (await fetch(url)).text();
  // const jsonLd = parseRecipeJsonLd(html);  // <script type="application/ld+json">
  return { ingredients: [], steps: [], sourceUrl: url, partial: true };
}

// TODO: youtube-transcript 등으로 설명/자막 확보 → LLM(Haiku)로 구조화.
async function extractFromYoutube(url: string): Promise<ExtractResult> {
  return { ingredients: [], steps: [], sourceUrl: url, partial: true };
}

// TODO: Vision 모델(예: Anthropic Messages API, image 블록)로 한 번에 구조화.
async function extractFromImage(_base64: string): Promise<ExtractResult> {
  return { ingredients: [], steps: [], partial: true };
}
