export async function forwardToBackend(
  path: string,
  init: RequestInit = {},
  incoming?: Request
) {
  const BACKEND_URL = process.env.BACKEND_URL;
  if (!BACKEND_URL) {
    return Response.json(
      { ok: false, message: 'BACKEND_URL nije postavljen u .env' },
      { status: 500 }
    );
  }

  const headers = new Headers(init.headers || {});
  const auth = incoming?.headers.get('authorization');
  if (auth && !headers.has('authorization')) {
    headers.set('authorization', auth);
  }

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    // keep text
  }

  if (!res.ok) {
    return Response.json(
      { ok: false, message: data?.message || 'Backend error', data },
      { status: res.status }
    );
  }

  return Response.json({ ok: true, data }, { status: 200 });
}
