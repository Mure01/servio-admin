import { forwardToBackend } from '../../../../_utils/forward';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return forwardToBackend(`/admin/service-requests/${id}/reject`, { method: 'POST' }, req);
}
