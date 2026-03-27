"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import {
  MOCK_DASHBOARD_STATS, MOCK_PROJECTS, MOCK_ACTIVITY_LOG,
  MOCK_TASKS, MOCK_WEEKLY_TASK_DATA, MOCK_PROJECT_STATUS_DATA,
} from "@/lib/mock-data";
import {
  PROJECT_STATUS_CONFIG, TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG,
  formatRelativeTime, formatDate,
} from "@/lib/utils";
import { PROJECT_HEALTH_CONFIG, getProjectHealth } from "@/lib/types";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  FolderKanban, CheckSquare, AlertTriangle, Users,
  TrendingUp, ArrowRight, Clock, Activity, ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

/* ── Stat card data ── */
const STATS = [
  {
    label:       "Active Projects",
    value:       MOCK_DASHBOARD_STATS.active_projects,
    sub:         `of ${MOCK_DASHBOARD_STATS.total_projects} total`,
    icon:        FolderKanban,
    iconWrap:    "bg-primary/10",
    iconColor:   "text-primary",
    trend:       "+2 this month",
    trendUp:     true,
  },
  {
    label:       "Tasks",
    value:       MOCK_DASHBOARD_STATS.total_tasks,
    sub:         `${MOCK_DASHBOARD_STATS.completed_tasks} completed`,
    icon:        CheckSquare,
    iconWrap:    "bg-success/10",
    iconColor:   "text-success",
    trend:       `${MOCK_DASHBOARD_STATS.completion_rate}% rate`,
    trendUp:     true,
  },
  {
    label:       "Overdue Tasks",
    value:       MOCK_DASHBOARD_STATS.overdue_tasks,
    sub:         "need attention",
    icon:        AlertTriangle,
    iconWrap:    "bg-danger/10",
    iconColor:   "text-danger",
    trend:       "action required",
    trendUp:     false,
    urgent:      true,
  },
  {
    label:       "Team",
    value:       MOCK_DASHBOARD_STATS.team_size,
    sub:         `${MOCK_DASHBOARD_STATS.total_clients} clients`,
    icon:        Users,
    iconWrap:    "bg-violet/10",
    iconColor:   "text-violet",
    trend:       "fully staffed",
    trendUp:     true,
  },
];

function formatActivity(action: string, meta: Record<string, unknown> | null): string {
  const m = meta ?? {};
  if (action === "created_project")  return `created "${m.project_name}"`;
  if (action === "updated_status")   return `moved "${m.task_title}" → ${m.to}`;
  if (action === "added_comment")    return `commented on "${m.task_title ?? m.project_name}"`;
  if (action === "created_client")   return `added client "${m.client_name}"`;
  return action.replace(/_/g, " ");
}

/* ── Custom chart tooltip ── */
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-border shadow-lg p-3 min-w-30">
      <p className="text-[11px] font-semibold text-ink-3 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-3 text-[11px]">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-bold font-mono text-ink">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const activeProjects = MOCK_PROJECTS.filter((p) => p.status === "active").slice(0, 4);
  const urgentTasks    = MOCK_TASKS.filter((t) => t.status !== "done" && t.priority === "high").slice(0, 5);

  return (
    <div className="max-w-[1440px] mx-auto space-y-5">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink leading-tight">Dashboard</h1>
          <p className="text-[13px] text-ink-3 mt-0.5">
            {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link href="/projects">
          <Button variant="primary" size="sm" icon={<FolderKanban size={13} />}>
            New Project
          </Button>
        </Link>
      </div>

      {/* ── KPI stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.iconWrap}`}>
                  <Icon size={18} className={s.iconColor} aria-hidden="true" />
                </div>
                {s.urgent && s.value > 0 && (
                  <span className="w-2 h-2 rounded-full bg-danger animate-status" aria-hidden="true" />
                )}
              </div>

              <p className="text-[36px] font-bold tabular-nums leading-none mb-1 text-ink">
                {s.value}
              </p>
              <p className="text-[13px] font-semibold text-ink-2 mb-0.5">{s.label}</p>
              <p className="text-[11.5px] text-ink-4">{s.sub}</p>

              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                <ArrowUpRight
                  size={11}
                  className={s.trendUp ? "text-success" : "text-danger"}
                  aria-hidden="true"
                />
                <span className={`text-[11px] font-medium ${s.trendUp ? "text-success" : "text-danger"}`}>
                  {s.trend}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Bento row 1: Chart (8) + Donut (4) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Area chart — task activity */}
        <Card className="lg:col-span-8 animate-fade-up" style={{ animationDelay: "220ms" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[14px] font-semibold text-ink">Task Activity</h2>
              <p className="text-[12px] text-ink-3 mt-0.5">Completed vs created over 6 weeks</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-ink-3">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded bg-primary inline-block" />
                Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded bg-orange inline-block" />
                Created
              </span>
            </div>
          </div>
          <div className="h-50" role="img" aria-label="Area chart: task activity over 6 weeks">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_WEEKLY_TASK_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <defs>
                  <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0052FF" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0052FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA580C" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false} tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone" dataKey="completed" name="Completed"
                  stroke="#0052FF" strokeWidth={2.5}
                  fill="url(#gBlue)" dot={false} activeDot={{ r: 4, fill: "#0052FF" }}
                />
                <Area
                  type="monotone" dataKey="created" name="Created"
                  stroke="#EA580C" strokeWidth={2.5} strokeDasharray="5 3"
                  fill="url(#gOrange)" dot={false} activeDot={{ r: 4, fill: "#EA580C" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Project status donut */}
        <Card className="lg:col-span-4 animate-fade-up flex flex-col" style={{ animationDelay: "270ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-ink">Project Status</h2>
            <TrendingUp size={14} className="text-ink-4" aria-hidden="true" />
          </div>

          <div className="h-40" role="img" aria-label="Donut chart showing project distribution by status">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_PROJECT_STATUS_DATA}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={72}
                  paddingAngle={3} dataKey="value"
                  startAngle={90} endAngle={-270}
                >
                  {MOCK_PROJECT_STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12, border: "1px solid #E2E8F0",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.10)", fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-3 space-y-2">
            {MOCK_PROJECT_STATUS_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} aria-hidden="true" />
                  <span className="text-[12px] text-ink-2">{d.name}</span>
                </div>
                <span className="text-[12px] font-bold font-mono text-ink">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-[12px] mb-2">
              <span className="text-ink-3">Completion rate</span>
              <span className="font-bold font-mono text-primary">{MOCK_DASHBOARD_STATS.completion_rate}%</span>
            </div>
            <ProgressBar value={MOCK_DASHBOARD_STATS.completion_rate} />
          </div>
        </Card>
      </div>

      {/* ── Bento row 2: Projects (7) + Right panel (5) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

        {/* Active Projects */}
        <Card className="xl:col-span-7 animate-fade-up" padding="none" style={{ animationDelay: "310ms" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-[14px] font-semibold text-ink">Active Projects</h2>
            <Link href="/projects">
              <Button variant="ghost" size="sm" icon={<ArrowRight size={13} />} iconPosition="right">
                View all
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-border">
            {activeProjects.map((project, i) => {
              const health = getProjectHealth(project);
              const hCfg   = PROJECT_HEALTH_CONFIG[health];
              const total  = project._task_count ?? 0;
              const done   = project._done_count ?? 0;
              const pct    = total > 0 ? (done / total) * 100 : 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg transition-colors"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-muted flex items-center justify-center shrink-0">
                    <FolderKanban size={15} className="text-primary" aria-hidden="true" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-semibold text-ink truncate">{project.name}</span>
                    </div>
                    <p className="text-[11.5px] text-ink-4 truncate mb-2">{project.client?.name}</p>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={pct} className="flex-1" />
                      <span className="text-[10.5px] font-mono shrink-0 tabular-nums text-ink-4">
                        {done}/{total}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge color={hCfg.color} bg={hCfg.bg} dot dotColor={hCfg.dot} size="xs">
                      {hCfg.label}
                    </Badge>
                    <span className="flex items-center gap-1 text-[10.5px] text-ink-4 font-mono">
                      <Clock size={9} aria-hidden="true" />
                      {formatDate(project.due_date)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Right: High Priority + Activity */}
        <div className="xl:col-span-5 space-y-4">

          {/* High Priority Tasks */}
          <Card padding="none" className="animate-fade-up" style={{ animationDelay: "340ms" }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-[13.5px] font-semibold text-ink flex items-center gap-2">
                <AlertTriangle size={13} className="text-danger" aria-hidden="true" />
                High Priority
              </h2>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" icon={<ArrowRight size={12} />} iconPosition="right">
                  All tasks
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {urgentTasks.map((task) => {
                const sCfg = TASK_STATUS_CONFIG[task.status];
                return (
                  <div key={task.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium text-ink truncate">{task.title}</p>
                      <p className="text-[11px] text-ink-4 truncate mt-0.5">{task.project?.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge color={sCfg.color} bg={sCfg.bg} size="xs">{sCfg.label}</Badge>
                      {task.assignee && <Avatar name={task.assignee.name} size="xs" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card padding="none" className="animate-fade-up" style={{ animationDelay: "370ms" }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-[13.5px] font-semibold text-ink flex items-center gap-2">
                <Activity size={13} className="text-primary" aria-hidden="true" />
                Recent Activity
              </h2>
              <Link href="/activity">
                <Button variant="ghost" size="sm" icon={<ArrowRight size={12} />} iconPosition="right">
                  View all
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {MOCK_ACTIVITY_LOG.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                  {log.user && <Avatar name={log.user.name} size="xs" className="shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] leading-snug text-ink-2">
                      <span className="font-semibold text-ink">{log.user?.name} </span>
                      {formatActivity(log.action, log.metadata)}
                    </p>
                    <p className="text-[10.5px] text-ink-4 font-mono mt-0.5">
                      {formatRelativeTime(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
