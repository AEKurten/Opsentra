"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ProgressBar from "@/components/ui/ProgressBar";
import { MOCK_USERS, MOCK_TASKS } from "@/lib/mock-data";
import { USER_ROLE_CONFIG, type UserRole } from "@/lib/utils";
import { Plus, Search, Users, CheckSquare, Clock, Mail } from "lucide-react";

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);

  const filtered = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const getUserStats = (userId: string) => {
    const tasks = MOCK_TASKS.filter((t) => t.assigned_to === userId);
    const active = tasks.filter((t) => t.status !== "done").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const overdue = tasks.filter(
      (t) => t.status !== "done" && t.due_date && new Date(t.due_date) < new Date()
    ).length;
    return { total: tasks.length, active, done, overdue };
  };

  return (
    <div className="max-w-[1100px] mx-auto">
      <PageHeader
        title="Team"
        description={`${MOCK_USERS.length} team members`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setInviteOpen(true)}>
            Invite Member
          </Button>
        }
      />

      {/* Role breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {(["admin", "manager", "worker"] as UserRole[]).map((role) => {
          const count = MOCK_USERS.filter((u) => u.role === role).length;
          const cfg = USER_ROLE_CONFIG[role];
          return (
            <div key={role} className="bg-white rounded-[12px] border border-slate-100 px-4 py-3"
              style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
              <p className="text-[22px] font-bold tabular-nums text-slate-900 font-display">
                {count}
              </p>
              <Badge color={cfg.color} bg={cfg.bg} size="sm" className="mt-1">{cfg.label}</Badge>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-xs"
          aria-label="Search team"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title="No team members found"
          description={search ? `No results for "${search}"` : "Invite your first team member."}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((user, i) => {
            const stats = getUserStats(user.id);
            const roleCfg = USER_ROLE_CONFIG[user.role];
            const workloadPct = Math.min((stats.active / Math.max(stats.total, 1)) * 100, 100);

            return (
              <Card
                key={user.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}
              >
                <div className="flex items-start gap-3 mb-4">
                  <Avatar name={user.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[14px] font-semibold text-slate-900">{user.name}</h3>
                      <Badge color={roleCfg.color} bg={roleCfg.bg} size="sm">{roleCfg.label}</Badge>
                    </div>
                    <a
                      href={`mailto:${user.email}`}
                      className="flex items-center gap-1 text-[12px] text-slate-400 hover:text-blue-600 transition-colors mt-0.5"
                    >
                      <Mail size={11} aria-hidden="true" />
                      {user.email}
                    </a>
                  </div>
                </div>

                {/* Task stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Active", value: stats.active, color: "#D97706" },
                    { label: "Done", value: stats.done, color: "#059669" },
                    { label: "Overdue", value: stats.overdue, color: "#DC2626" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-[8px] px-2.5 py-2 text-center">
                      <p className="text-[16px] font-bold tabular-nums font-display" style={{ color: s.color }}>
                        {s.value}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Workload bar */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-slate-500">Workload</span>
                    <span className="text-slate-500 tabular-nums">{stats.active} active tasks</span>
                  </div>
                  <ProgressBar
                    value={stats.active}
                    max={10}
                    color={stats.active >= 8 ? "#DC2626" : stats.active >= 5 ? "#D97706" : "#2563EB"}
                    size="md"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {stats.active >= 8 ? "Heavy load" : stats.active >= 5 ? "Moderate load" : "Manageable load"}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}

function InviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", role: "worker" as UserRole });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description="Send an invitation to join Opsentra."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onClose}>Send Invite</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Johan van der Berg"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="johan@company.co.za"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-700">Role <span className="text-red-500">*</span></label>
          <select
            className="w-full h-10 rounded-[10px] border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
          >
            <option value="admin">Admin — full access</option>
            <option value="manager">Manager — manage projects & tasks</option>
            <option value="worker">Worker — view & update tasks</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
