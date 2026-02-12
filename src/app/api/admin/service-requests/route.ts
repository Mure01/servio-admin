import { forwardToBackend } from '../../_utils/forward';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return forwardToBackend(`/admin/service-requests${qs}`, { method: 'GET' }, req);
}
