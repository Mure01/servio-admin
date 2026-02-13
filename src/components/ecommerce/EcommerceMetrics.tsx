"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { BoxIconLine, GroupIcon, PlugInIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";

type Metrics = {
  requestsTotal: number;
  companiesTotal: number;
  servicesTotal: number;
  serviceRequests: { open: number; pending: number; closed: number };
};

export const EcommerceMetrics = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/admin/metrics", {
          headers: { authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json?.message || "Metrics error");
        setMetrics(json.data.metrics);
        console.log(json.data)
      } catch (e) {
        console.error("Metrics fetch error:", e);
      }
    };

    fetchMetrics();
  }, [token]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Companies</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics ? metrics.companiesTotal : "—"}
            </h4>
          </div>
          <Badge color="success">Active</Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Requests</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics ? metrics.requestsTotal : "—"}
            </h4>
          </div>
          <Badge color="warning">Pending {metrics ? metrics.serviceRequests.pending : "—"}</Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <PlugInIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Service requests</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics ? metrics.serviceRequests.pending : "—"}
            </h4>
          </div>
          <Badge color="success">Total services {metrics ? metrics.servicesTotal : "—"}</Badge>
        </div>
      </div>
    </div>
  );
};
