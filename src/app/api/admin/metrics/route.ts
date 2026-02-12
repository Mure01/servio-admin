import { forwardToBackend } from '../../_utils/forward';

export async function GET(req: Request) {
  return forwardToBackend('/admin/metrics', { method: 'GET' }, req);
}
