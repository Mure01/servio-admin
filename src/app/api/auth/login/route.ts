import { forwardToBackend } from '../../_utils/forward';

export async function POST(req: Request) {
  const body = await req.text();
  return forwardToBackend('/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  }, req);
}
