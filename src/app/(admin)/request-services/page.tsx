"use client";

import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

type ServiceRequest = {
  _id: string;
  naziv: string;
  description?: string;
  email?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  approvedAt?: string;
};

function statusColor(s?: string): "success" | "warning" | "error" | "info" {
  if (s === "approved") return "success";
  if (s === "pending") return "warning";
  if (s === "rejected") return "error";
  return "info";
}

export default function RequestServicesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/service-requests", {
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.message || "Ne mogu dohvatiti zahtjeve");
      setItems(json.data.data || []);
      console.log(json.data)
    } catch (e: any) {
      setError(e.message || "Greška");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const approve = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/service-requests/${id}/approve`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.message || "Approve error");
      await fetchItems();
    } catch (e: any) {
      setError(e.message || "Greška");
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id: string) => {
    if (!token) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/service-requests/${id}/reject`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.message || "Reject error");
      await fetchItems();
    } catch (e: any) {
      setError(e.message || "Greška");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Request Services</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Zahtjevi za dodavanje novih servisa (approve → kreira se servis)
        </p>
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
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Created</TableCell>
              <TableCell isHeader>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell >Loading...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell >Nema zahtjeva</TableCell>
              </TableRow>
            ) : (
              items.map((it) => (
                <TableRow key={it._id}>
                  <TableCell>
                    <div className="font-medium text-gray-800 dark:text-white/90">{it.naziv}</div>
                    {it.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{it.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColor(it.status)}>{it.status || "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    {it.createdAt ? new Date(it.createdAt).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={it.status !== "pending" || actionId === it._id}
                        onClick={() => approve(it._id)}
                      >
                        Odobri
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={it.status !== "pending" || actionId === it._id}
                        onClick={() => reject(it._id)}
                      >
                        Odbij
                      </Button>
                    </div>
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
