const BACKEND_URL = process.env.BACKEND_URL;

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/company`, {
      cache: "no-store",
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    if (!res.ok) {
      return Response.json(
        { ok: false, message: data?.message || "Backend error", data },
        { status: res.status }
      );
    }   
    console.log("Data from backend:", data);

    return Response.json({ ok: true, data });
  } catch (err) {
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
