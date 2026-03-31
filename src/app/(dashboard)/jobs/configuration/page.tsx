"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { MOCK_JOB_STATUSES, MOCK_WORKSHOPS } from "@/lib/mock-data";
import { type JobStatus, type Workshop } from "@/lib/types";
import { Plus, Pencil, Trash2, Tag, Building, ChevronLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Preset colour palette ───────────────────────────────────────────────────
const PRESET_COLORS: { color: string; bg: string; label: string }[] = [
  { color: "#64748B", bg: "#F1F5F9", label: "Slate"  },
  { color: "#2563EB", bg: "#DBEAFE", label: "Blue"   },
  { color: "#059669", bg: "#D1FAE5", label: "Green"  },
  { color: "#D97706", bg: "#FEF3C7", label: "Amber"  },
  { color: "#DC2626", bg: "#FEE2E2", label: "Red"    },
  { color: "#7C3AED", bg: "#EDE9FE", label: "Violet" },
  { color: "#0891B2", bg: "#CFFAFE", label: "Cyan"   },
  { color: "#EA580C", bg: "#FFF0E8", label: "Orange" },
  { color: "#DB2777", bg: "#FCE7F3", label: "Pink"   },
  { color: "#0F172A", bg: "#F8FAFC", label: "Dark"   },
];

type Tab = "statuses" | "workshops";

export default function JobConfigurationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("statuses");

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader
        title="Job Configuration"
        description="Manage statuses and workshops used across all jobs."
        breadcrumb={[{ label: "Jobs", href: "/jobs" }, { label: "Configuration" }]}
        actions={
          <Link href="/jobs">
            <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />}>
              Back to Jobs
            </Button>
          </Link>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {([
          { key: "statuses",  label: "Statuses",  icon: Tag      },
          { key: "workshops", label: "Workshops",  icon: Building },
        ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors duration-150 cursor-pointer",
              activeTab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "statuses"  && <StatusesTab />}
      {activeTab === "workshops" && <WorkshopsTab />}
    </div>
  );
}

// ─── Statuses Tab ─────────────────────────────────────────────────────────────

function StatusesTab() {
  const [statuses, setStatuses]   = useState<JobStatus[]>([...MOCK_JOB_STATUSES]);
  const [editTarget, setEditTarget] = useState<JobStatus | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobStatus | null>(null);
  const [newOpen, setNewOpen]     = useState(false);

  const handleSave = (data: Omit<JobStatus, "id">) => {
    if (editTarget) {
      setStatuses((prev) =>
        prev.map((s) => s.id === editTarget.id ? { ...s, ...data } : s)
      );
      setEditTarget(null);
    } else {
      const newStatus: JobStatus = {
        id: `js-${Date.now()}`,
        ...data,
        sort_order: statuses.length + 1,
      };
      // If new one is default, clear existing default
      if (data.is_default) {
        setStatuses((prev) => [
          ...prev.map((s) => ({ ...s, is_default: false })),
          newStatus,
        ]);
      } else {
        setStatuses((prev) => [...prev, newStatus]);
      }
      setNewOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setStatuses((prev) => prev.filter((s) => s.id !== id));
    setDeleteTarget(null);
  };

  const handleSetDefault = (id: string) => {
    setStatuses((prev) => prev.map((s) => ({ ...s, is_default: s.id === id })));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-slate-500">{statuses.length} status{statuses.length !== 1 ? "es" : ""}</p>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setNewOpen(true)}>
          New Status
        </Button>
      </div>

      {statuses.length === 0 ? (
        <EmptyState
          icon={<Tag size={24} />}
          title="No statuses"
          description="Add your first job status to get started."
          action={{ label: "New Status", onClick: () => setNewOpen(true), icon: <Plus size={14} /> }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-10">#</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider w-32">Default</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...statuses].sort((a, b) => a.sort_order - b.sort_order).map((status) => (
                <tr key={status.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] text-slate-400 tabular-nums">{status.sort_order}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Color swatch */}
                      <span
                        className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                        style={{ background: status.color }}
                      />
                      <Badge color={status.color} bg={status.bg_color} size="sm">
                        {status.name}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {status.is_default ? (
                      <span className="flex items-center gap-1 text-[12px] font-medium text-amber-600">
                        <Star size={11} fill="currentColor" />
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(status.id)}
                        className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        Set default
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(status)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        aria-label={`Edit ${status.name}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(status)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label={`Delete ${status.name}`}
                        disabled={status.is_default}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New / Edit modal */}
      <StatusFormModal
        isOpen={newOpen || editTarget !== null}
        onClose={() => { setNewOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget}
        title={editTarget ? "Edit Status" : "New Status"}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal
          isOpen
          onClose={() => setDeleteTarget(null)}
          title="Delete Status"
          description={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteTarget.id)}>Delete</Button>
            </>
          }
        >
          <p className="text-[13px] text-slate-600">
            Jobs currently using this status will need to be updated manually.
          </p>
        </Modal>
      )}
    </>
  );
}

interface StatusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<JobStatus, "id">) => void;
  initial: JobStatus | null;
  title: string;
}

function StatusFormModal({ isOpen, onClose, onSave, initial, title }: StatusFormModalProps) {
  const [name, setName]           = useState(initial?.name ?? "");
  const [color, setColor]         = useState(initial?.color ?? PRESET_COLORS[0].color);
  const [bg, setBg]               = useState(initial?.bg_color ?? PRESET_COLORS[0].bg);
  const [isDefault, setIsDefault] = useState(initial?.is_default ?? false);
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 1);

  // Sync when initial changes
  const key = initial?.id ?? "new";

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), color, bg_color: bg, sort_order: sortOrder, is_default: isDefault });
    setName(""); setColor(PRESET_COLORS[0].color); setBg(PRESET_COLORS[0].bg);
    setIsDefault(false); setSortOrder(1);
  };

  return (
    <Modal
      key={key}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!name.trim()}>
            {initial ? "Save Changes" : "Create Status"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Status Name"
          placeholder="e.g. In Workshop"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label className="text-[13px] font-medium text-slate-700 block mb-2">Colour</label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((p) => (
              <button
                key={p.color}
                onClick={() => { setColor(p.color); setBg(p.bg); }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-[12px] font-medium transition-all cursor-pointer",
                  color === p.color
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
                title={p.label}
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                <span className="text-slate-600 truncate">{p.label}</span>
              </button>
            ))}
          </div>
          {/* Preview */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[12px] text-slate-500">Preview:</span>
            <Badge color={color} bg={bg} dot dotColor={color} size="sm">
              {name || "Status Name"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Sort Order"
            type="number"
            value={String(sortOrder)}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
          <div className="flex flex-col gap-1.5 justify-end">
            <label className="flex items-center gap-2.5 cursor-pointer py-2">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
              />
              <span className="text-[13px] font-medium text-slate-700">Default status</span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Workshops Tab ────────────────────────────────────────────────────────────

function WorkshopsTab() {
  const [workshops, setWorkshops]       = useState<Workshop[]>([...MOCK_WORKSHOPS]);
  const [editTarget, setEditTarget]     = useState<Workshop | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workshop | null>(null);
  const [newOpen, setNewOpen]           = useState(false);

  const handleSave = (data: Omit<Workshop, "id">) => {
    if (editTarget) {
      setWorkshops((prev) =>
        prev.map((w) => w.id === editTarget.id ? { ...w, ...data } : w)
      );
      setEditTarget(null);
    } else {
      setWorkshops((prev) => [...prev, { id: `w-${Date.now()}`, ...data }]);
      setNewOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setWorkshops((prev) => prev.filter((w) => w.id !== id));
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] text-slate-500">{workshops.length} workshop{workshops.length !== 1 ? "s" : ""}</p>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setNewOpen(true)}>
          New Workshop
        </Button>
      </div>

      {workshops.length === 0 ? (
        <EmptyState
          icon={<Building size={24} />}
          title="No workshops"
          description="Add your first workshop to assign jobs to a location."
          action={{ label: "New Workshop", onClick: () => setNewOpen(true), icon: <Plus size={14} /> }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {workshops.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-slate-800">{w.name}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] text-slate-500">{w.location ?? "—"}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditTarget(w)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        aria-label={`Edit ${w.name}`}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(w)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        aria-label={`Delete ${w.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New / Edit modal */}
      <WorkshopFormModal
        isOpen={newOpen || editTarget !== null}
        onClose={() => { setNewOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget}
        title={editTarget ? "Edit Workshop" : "New Workshop"}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <Modal
          isOpen
          onClose={() => setDeleteTarget(null)}
          title="Delete Workshop"
          description={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteTarget.id)}>Delete</Button>
            </>
          }
        >
          <p className="text-[13px] text-slate-600">
            Jobs currently assigned to this workshop will need to be updated manually.
          </p>
        </Modal>
      )}
    </>
  );
}

interface WorkshopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Workshop, "id">) => void;
  initial: Workshop | null;
  title: string;
}

function WorkshopFormModal({ isOpen, onClose, onSave, initial, title }: WorkshopFormModalProps) {
  const [name, setName]         = useState(initial?.name ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), location: location.trim() || null });
    setName(""); setLocation("");
  };

  return (
    <Modal
      key={initial?.id ?? "new"}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!name.trim()}>
            {initial ? "Save Changes" : "Create Workshop"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Workshop Name"
          placeholder="e.g. Workshop A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Location"
          placeholder="e.g. Main Building — Bay 1–3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </Modal>
  );
}
