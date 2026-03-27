"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { MOCK_ACTIVITY_LOG, MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import { Activity, Search, FolderKanban, CheckSquare, MessageSquare, Users, Building2 } from "lucide-react";

const ACTION_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  created_project: { label: "Created Project", icon: <FolderKanban size={12} />, color: "#2563EB", bg: "#DBEAFE" },
  updated_status: { label: "Updated Status", icon: <CheckSquare size={12} />, color: "#059669", bg: "#D1FAE5" },
  added_comment: { label: "Added Comment", icon: <MessageSquare size={12} />, color: "#7C3AED", bg: "#EDE9FE" },
  created_client: { label: "Added Client", icon: <Building2 size={12} />, color: "#D97706", bg: "#FEF3C7" },
  assigned_task: { label: "Assigned Task", icon: <Users size={12} />, color: "#64748B", bg: "#F1F5F9" },
};

function getActionConfig(action: string) {
  return ACTION_CONFIG[action] || { label: action.replace(/_/g, " "), icon: <Activity size={12} />, color: "#64748B", bg: "#F1F5F9" };
}

function formatActivityMessage(action: string, metadata: Record<string, unknown> | null): string {
  const meta = metadata || {};
  switch (action) {
    case "created_project": return `created project "${meta.project_name}"`;
    case "updated_status": return `updated "${meta.task_title}" from ${meta.from} to ${meta.to}`;
    case "added_comment": return `commented on "${meta.task_title || meta.project_name}"`;
    case "created_client": return `added client "${meta.client_name}"`;
    default: return action.replace(/_/g, " ");
  }
}

const ENTITY_FILTERS = ["all", "project", "task", "comment", "client"] as const;
type EntityFilter = typeof ENTITY_FILTERS[number];

export default function ActivityPage() {
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");

  // Group by date
  const filtered = MOCK_ACTIVITY_LOG
    .filter((log) => {
      const meta = log.metadata || {};
      const searchTarget = [
        log.user?.name || "",
        log.action,
        String(meta.task_title || ""),
        String(meta.project_name || ""),
        String(meta.client_name || ""),
      ].join(" ").toLowerCase();
      const matchesSearch = searchTarget.includes(search.toLowerCase());
      const matchesFilter = entityFilter === "all" || log.entity_type === entityFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, log) => {
    const dateKey = new Date(log.created_at).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {});

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader
        title="Activity Log"
        description="A complete audit trail of all actions in the system"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-xs"
          aria-label="Search activity"
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          {ENTITY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setEntityFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                entityFilter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {Object.entries(ACTION_CONFIG).slice(0, 4).map(([action, cfg]) => {
          const count = MOCK_ACTIVITY_LOG.filter((l) => l.action === action).length;
          return (
            <div key={action} className="bg-white rounded-[12px] border border-slate-100 px-4 py-3"
              style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <p className="text-[11px] text-slate-500">{cfg.label}</p>
              </div>
              <p className="text-[22px] font-bold tabular-nums text-slate-900 font-display">
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Activity timeline */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Activity size={24} />}
            title="No activity found"
            description={search ? `No results for "${search}"` : "Activity will appear here as your team works."}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateKey, logs]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                  {new Date(dateKey).toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Card padding="none">
                <div className="divide-y divide-slate-100">
                  {logs.map((log, i) => {
                    const actionCfg = getActionConfig(log.action);
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* User avatar */}
                        {log.user ? (
                          <Avatar name={log.user.name} size="sm" className="shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Activity size={13} className="text-slate-400" aria-hidden="true" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-slate-700 leading-snug">
                            <span className="font-semibold text-slate-900">{log.user?.name || "System"}</span>{" "}
                            {formatActivityMessage(log.action, log.metadata)}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge color={actionCfg.color} bg={actionCfg.bg} size="sm">
                              <span className="flex items-center gap-1">{actionCfg.icon}{actionCfg.label}</span>
                            </Badge>
                            <span className="text-[11px] text-slate-400">
                              {formatRelativeTime(log.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
