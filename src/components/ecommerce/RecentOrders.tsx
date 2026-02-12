"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { useAuth } from "@/context/AuthContext";

type Service = {
  _id: string;
  naziv: string;
};

export default function RecentOrders() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/services", {
          headers: { authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json?.message || "Ne mogu dohvatiti servise");
        const list: Service[] = json.data || [];
        setServices(list.slice(-8).reverse());
      } catch (e: any) {
        setError(e.message || "Greška");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [token]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent services
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">Last 8</span>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-300">
          {error}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>Naziv</TableCell>
            <TableCell isHeader>Id</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2}>Loading...</TableCell>
            </TableRow>
          ) : services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>Nema servisa</TableCell>
            </TableRow>
          ) : (
            services.map((s) => (
              <TableRow key={s._id}>
                <TableCell>{s.naziv}</TableCell>
                <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                  {s._id}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
