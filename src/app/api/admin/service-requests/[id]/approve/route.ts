import { forwardToBackend } from '../../../../_utils/forward';

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  return forwardToBackend(`/admin/service-requests/${id}/approve`, { method: 'POST' }, req);
}
