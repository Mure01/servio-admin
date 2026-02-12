"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { BoxIconLine, GroupIcon, PlugInIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";

type Metrics = {
  totalRequests: number;
  totalCompanies: number;
  totalServices: number;
  serviceRequests: { pending: number; approved: number };
  requestsByStatus: { open: number; pending: number; closed: number };
};

export const EcommerceMetrics = () => {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

 

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
              {metrics ? metrics.totalCompanies : "—"}
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
              {metrics ? metrics.totalRequests : "—"}
            </h4>
          </div>
          <Badge color="warning">Pending {metrics ? metrics.requestsByStatus.pending : "—"}</Badge>
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
          <Badge color="success">Total services {metrics ? metrics.totalServices : "—"}</Badge>
        </div>
      </div>
    </div>
  );
};
