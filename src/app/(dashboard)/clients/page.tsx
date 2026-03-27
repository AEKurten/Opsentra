"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { MOCK_CLIENTS, MOCK_PROJECTS } from "@/lib/mock-data";
import { PROJECT_STATUS_CONFIG, formatDate } from "@/lib/utils";
import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  FolderKanban,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);

  const filtered = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_person.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getClientProjects = (clientId: string) =>
    MOCK_PROJECTS.filter((p) => p.client_id === clientId);

  return (
    <div className="max-w-300 mx-auto">
      <PageHeader
        title="Clients"
        description={`${MOCK_CLIENTS.length} clients in your network`}
        actions={
          <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setAddClientOpen(true)}>
            Add Client
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-5">
        <Input
          placeholder="Search clients, contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={14} />}
          className="max-w-xs"
          aria-label="Search clients"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Clients", value: MOCK_CLIENTS.length, color: "#2563EB" },
          { label: "Active Projects", value: MOCK_PROJECTS.filter((p) => p.status === "active").length, color: "#059669" },
          { label: "On Hold", value: MOCK_PROJECTS.filter((p) => p.status === "on_hold").length, color: "#D97706" },
          { label: "Completed", value: MOCK_PROJECTS.filter((p) => p.status === "completed").length, color: "#64748B" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-[12px] border border-slate-100 px-4 py-3"
            style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.04)" }}>
            <p className="text-[22px] font-bold tabular-nums font-display" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[12px] text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 size={24} />}
          title="No clients found"
          description={search ? `No results for "${search}"` : "Add your first client to get started."}
          action={!search ? { label: "Add Client", onClick: () => setAddClientOpen(true), icon: <Plus size={14} /> } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((client, i) => {
            const projects = getClientProjects(client.id);
            const activeProjects = projects.filter((p) => p.status === "active");

            return (
              <Card
                key={client.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-[12px] bg-blue-50 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-blue-600" aria-hidden="true" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[15px] font-semibold text-slate-900">{client.name}</h3>
                        <p className="text-[13px] text-slate-500 mt-0.5">{client.contact_person}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {activeProjects.length > 0 && (
                          <Badge color="#059669" bg="#D1FAE5" size="sm">
                            {activeProjects.length} active
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <a
                        href={`tel:${client.phone}`}
                        className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Phone size={12} aria-hidden="true" />
                        {client.phone}
                      </a>
                      <a
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-600 transition-colors"
                      >
                        <Mail size={12} aria-hidden="true" />
                        {client.email}
                      </a>
                      <span className="text-[12px] text-slate-400">
                        Client since {formatDate(client.created_at)}
                      </span>
                    </div>

                    {/* Projects */}
                    {projects.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                        {projects.map((p) => {
                          const cfg = PROJECT_STATUS_CONFIG[p.status];
                          return (
                            <Link
                              key={p.id}
                              href={`/projects/${p.id}`}
                              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <FolderKanban size={11} className="text-slate-400" aria-hidden="true" />
                              <span className="text-[11px] text-slate-600 font-medium">{p.name}</span>
                              <Badge color={cfg.color} bg={cfg.bg} size="sm">{cfg.label}</Badge>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddClientModal isOpen={addClientOpen} onClose={() => setAddClientOpen(false)} />
    </div>
  );
}

function AddClientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Client"
      description="Enter the client's details below."
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onClose}>Add Client</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Company Name"
          placeholder="e.g. Transnet Engineering"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          label="Contact Person"
          placeholder="e.g. Deon Fourie"
          value={form.contact_person}
          onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone"
            type="tel"
            placeholder="+27 11 000 0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="contact@company.co.za"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>
    </Modal>
  );
}
