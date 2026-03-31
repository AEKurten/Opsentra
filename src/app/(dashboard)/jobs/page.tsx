"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { MOCK_JOBS, MOCK_JOB_STATUSES, MOCK_CLIENTS, MOCK_USERS, MOCK_WORKSHOPS } from "@/lib/mock-data";
import { formatDate, isOverdue } from "@/lib/utils";
import { type Job } from "@/lib/types";
import {
  Plus, Search, ClipboardList, Settings2,
  User, Calendar, AlertCircle,
} from "lucide-react";

export default function JobsPage() {
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<string>("all");
  const [newJobOpen, setNewJobOpen]       = useState(false);
  const [jobs, setJobs]                   = useState<Job[]>(MOCK_JOBS);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const q = search.toLowerCase();
      const matchesSearch =
        j.job_number.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.client?.name.toLowerCase().includes(q) ||
        j.assigned_technician?.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || j.status_id === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const handleNewJob = (job: Job) => {
    setJobs((prev) => [job, ...prev]);
    setNewJobOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Jobs"
        description={`${jobs.filter((j) => !["js6", "js7"].includes(j.status_id)).length} active jobs across ${MOCK_CLIENTS.length} clients`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/jobs/configuration">
              <Button variant="ghost" size="sm" icon={<Settings2 size={14} />}>
                Configuration
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setNewJobOpen(true)}
            >
              New Job
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Input
          placeholder="Search jobs, clients, technicians…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="sm:max-w-xs"
          aria-label="Search jobs"
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All
          </button>
          {MOCK_JOB_STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                statusFilter === s.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
        <div
          className="col-span-2 sm:col-span-1 bg-white rounded-[12px] border border-slate-100 px-4 py-3"
          style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}
        >
          <p className="text-[22px] font-bold text-slate-900 tabular-nums font-display">{jobs.length}</p>
          <p className="text-[12px] text-slate-500 mt-0.5">Total</p>
        </div>
        {MOCK_JOB_STATUSES.map((s) => {
          const count = jobs.filter((j) => j.status_id === s.id).length;
          return (
            <div
              key={s.id}
              className="bg-white rounded-[12px] border border-slate-100 px-4 py-3"
              style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}
            >
              <p className="text-[22px] font-bold tabular-nums font-display" style={{ color: s.color }}>{count}</p>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-tight">{s.name}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={24} />}
          title="No jobs found"
          description={search ? `No results for "${search}"` : "Create your first job to get started."}
          action={!search ? { label: "New Job", onClick: () => setNewJobOpen(true), icon: <Plus size={14} /> } : undefined}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-32">Job #</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-44">Client</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-40">Technician</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-40">Workshop</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-36">Expected By</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((job, i) => (
                  <JobRow key={job.id} job={job} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <NewJobModal
        isOpen={newJobOpen}
        onClose={() => setNewJobOpen(false)}
        onSave={handleNewJob}
        nextJobNumber={`JOB-${String(jobs.length + 1).padStart(4, "0")}`}
      />
    </div>
  );
}

function JobRow({ job, index }: { job: Job; index: number }) {
  const overdue = job.expected_completion_date
    ? isOverdue(job.expected_completion_date) && !["js6", "js7"].includes(job.status_id)
    : false;

  return (
    <tr
      className="hover:bg-slate-50/70 transition-colors animate-fade-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Job # */}
      <td className="px-4 py-3.5">
        <span className="font-mono text-[12px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
          {job.job_number}
        </span>
      </td>

      {/* Description */}
      <td className="px-4 py-3.5">
        <p className="text-[13px] text-slate-800 font-medium leading-snug line-clamp-1">
          {job.description}
        </p>
      </td>

      {/* Client */}
      <td className="px-4 py-3.5">
        <p className="text-[13px] text-slate-600 truncate">{job.client?.name ?? "—"}</p>
      </td>

      {/* Technician */}
      <td className="px-4 py-3.5">
        {job.assigned_technician ? (
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #0052FF, #4D7CFF)" }}
            >
              {job.assigned_technician.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <span className="text-[13px] text-slate-600 truncate">{job.assigned_technician.name}</span>
          </div>
        ) : (
          <span className="flex items-center gap-1 text-[12px] text-slate-400">
            <User size={12} />
            Unassigned
          </span>
        )}
      </td>

      {/* Workshop */}
      <td className="px-4 py-3.5">
        <p className="text-[13px] text-slate-600 truncate">{job.workshop?.name ?? "—"}</p>
      </td>

      {/* Expected By */}
      <td className="px-4 py-3.5">
        {job.expected_completion_date ? (
          <span className={`flex items-center gap-1 text-[12px] font-medium ${overdue ? "text-red-600" : "text-slate-500"}`}>
            {overdue && <AlertCircle size={11} />}
            <Calendar size={11} />
            {formatDate(job.expected_completion_date)}
          </span>
        ) : (
          <span className="text-[12px] text-slate-400">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        {job.status ? (
          <Badge
            color={job.status.color}
            bg={job.status.bg_color}
            dot
            dotColor={job.status.color}
            size="sm"
          >
            {job.status.name}
          </Badge>
        ) : (
          <span className="text-[12px] text-slate-400">—</span>
        )}
      </td>
    </tr>
  );
}

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  nextJobNumber: string;
}

function NewJobModal({ isOpen, onClose, onSave, nextJobNumber }: NewJobModalProps) {
  const defaultStatus = MOCK_JOB_STATUSES.find((s) => s.is_default) ?? MOCK_JOB_STATUSES[0];

  const [form, setForm] = useState({
    description: "",
    client_id: "",
    assigned_technician_id: "",
    workshop_id: "",
    expected_completion_date: "",
    status_id: defaultStatus.id,
  });

  const handleSave = () => {
    if (!form.description.trim() || !form.client_id || !form.status_id) return;

    const client    = MOCK_CLIENTS.find((c) => c.id === form.client_id);
    const tech      = MOCK_USERS.find((u) => u.id === form.assigned_technician_id);
    const workshop  = MOCK_WORKSHOPS.find((w) => w.id === form.workshop_id);
    const status    = MOCK_JOB_STATUSES.find((s) => s.id === form.status_id);

    onSave({
      id: `j-${Date.now()}`,
      job_number: nextJobNumber,
      description: form.description,
      client_id: form.client_id,
      assigned_technician_id: form.assigned_technician_id || null,
      workshop_id: form.workshop_id || null,
      expected_completion_date: form.expected_completion_date || null,
      status_id: form.status_id,
      created_at: new Date().toISOString(),
      client,
      assigned_technician: tech,
      workshop,
      status,
    });

    setForm({
      description: "", client_id: "", assigned_technician_id: "",
      workshop_id: "", expected_completion_date: "", status_id: defaultStatus.id,
    });
  };

  const sel = "w-full h-10 rounded-md border border-slate-200 text-[14px] px-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer";
  const lbl = "text-[13px] font-medium text-slate-700";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Job"
      description="Fill in the job details below. Job number is assigned automatically."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!form.description.trim() || !form.client_id}
          >
            Create Job
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Auto job number preview */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          <span className="text-[12px] text-slate-500">Job Number</span>
          <span className="font-mono text-[13px] font-bold text-blue-600">{nextJobNumber}</span>
          <span className="text-[11px] text-slate-400 ml-auto">Auto-assigned</span>
        </div>

        <Input
          label="Description"
          placeholder="e.g. Hydraulic pump overhaul and seal replacement"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={lbl}>Client <span className="text-red-500">*</span></label>
            <select className={sel} value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}>
              <option value="">Select client…</option>
              {MOCK_CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={lbl}>Status</label>
            <select className={sel} value={form.status_id} onChange={(e) => setForm({ ...form, status_id: e.target.value })}>
              {MOCK_JOB_STATUSES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className={lbl}>Assigned Technician</label>
            <select className={sel} value={form.assigned_technician_id} onChange={(e) => setForm({ ...form, assigned_technician_id: e.target.value })}>
              <option value="">Unassigned</option>
              {MOCK_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={lbl}>Workshop</label>
            <select className={sel} value={form.workshop_id} onChange={(e) => setForm({ ...form, workshop_id: e.target.value })}>
              <option value="">None</option>
              {MOCK_WORKSHOPS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>

        <Input
          label="Expected Completion Date"
          type="date"
          value={form.expected_completion_date}
          onChange={(e) => setForm({ ...form, expected_completion_date: e.target.value })}
        />
      </div>
    </Modal>
  );
}
