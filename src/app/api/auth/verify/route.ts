import { forwardToBackend } from '../../_utils/forward';

export async function GET(req: Request) {
  return forwardToBackend('/verify/me', { method: 'GET' }, req);
}
