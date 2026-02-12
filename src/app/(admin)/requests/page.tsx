"use client";

import React, { useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

type RequestItem = {
  _id: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  city?: string;
};

function statusColor(s?: string): "success" | "warning" | "error" | "info" {
  if (s === "closed") return "success";
  if (s === "pending") return "warning";
  if (s === "open") return "info";
  return "info";
}

export default function RequestsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/requests", {
          headers: { authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json?.message || "Ne mogu dohvatiti zahtjeve");
        const list: RequestItem[] = json.data || [];
        setItems(list);
      } catch (e: any) {
        setError(e.message || "Greška");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((r) =>
      [r.title, r.description, r.status, r.city, r._id].some((v) =>
        (v || "").toString().toLowerCase().includes(term)
      )
    );
  }, [items, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Svi zahtjevi iz backenda</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="w-full sm:w-72 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-300">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Title</TableCell>
              <TableCell isHeader>Status</TableCell>
              <TableCell isHeader>City</TableCell>
              <TableCell isHeader>Created</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Nema requestova</TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>
                    <div className="font-medium text-gray-800 dark:text-white/90">{r.service_type || "(no title)"}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r._id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColor(r.status)}>{r.status || "—"}</Badge>
                  </TableCell>
                  <TableCell>{r.city || "—"}</TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
