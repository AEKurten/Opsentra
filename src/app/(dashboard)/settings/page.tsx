"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { USER_ROLE_CONFIG, type UserRole } from "@/lib/utils";
import { Shield, Bell, Database, Zap, User, Check } from "lucide-react";

const SETTING_SECTIONS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "integrations", label: "Integrations", icon: Zap },
  { key: "data", label: "Data & Storage", icon: Database },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const currentUser = MOCK_USERS[0];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <PageHeader
        title="Settings"
        description="Manage your account, notifications, and system preferences"
      />

      <div className="flex gap-5">
        {/* Settings nav */}
        <div className="w-[200px] shrink-0">
          <nav aria-label="Settings navigation">
            <ul className="space-y-0.5">
              {SETTING_SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.key}>
                    <button
                      onClick={() => setActiveSection(s.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[13px] font-medium transition-all cursor-pointer text-left ${
                        activeSection === s.key
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={14} aria-hidden="true" className={activeSection === s.key ? "text-blue-600" : "text-slate-400"} />
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Settings content */}
        <div className="flex-1 min-w-0">
          {activeSection === "profile" && (
            <Card>
              <h2 className="text-[15px] font-semibold text-slate-800 mb-5">Profile Settings</h2>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                <Avatar name={currentUser.name} size="xl" />
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">{currentUser.name}</p>
                  <Badge color={USER_ROLE_CONFIG[currentUser.role].color} bg={USER_ROLE_CONFIG[currentUser.role].bg} size="sm" className="mt-1">
                    {USER_ROLE_CONFIG[currentUser.role].label}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Change Photo</Button>
              </div>
              <div className="space-y-4 max-w-md">
                <Input label="Full Name" defaultValue={currentUser.name} />
                <Input label="Email Address" type="email" defaultValue={currentUser.email} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Role</label>
                  <select
                    className="w-full h-10 rounded-[10px] border border-slate-200 text-[14px] px-3 text-slate-800 bg-slate-50 cursor-not-allowed opacity-60"
                    disabled
                    value={currentUser.role}
                  >
                    {Object.entries(USER_ROLE_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">Contact an admin to change your role.</p>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="primary" size="sm" onClick={handleSave} icon={saved ? <Check size={13} /> : undefined}>
                    {saved ? "Saved!" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <h2 className="text-[15px] font-semibold text-slate-800 mb-5">Notification Preferences</h2>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Task assigned to me", desc: "When a task is assigned to you" },
                  { label: "Task overdue", desc: "When a task you own passes its due date" },
                  { label: "Comment mentions", desc: "When someone mentions you in a comment" },
                  { label: "Project status changes", desc: "When a project status is updated" },
                  { label: "Daily summary", desc: "Daily digest of activity across your projects" },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100">
                    <div>
                      <p className="text-[13px] font-medium text-slate-800">{n.label}</p>
                      <p className="text-[12px] text-slate-400">{n.desc}</p>
                    </div>
                    <button
                      className="relative w-10 h-5 rounded-full bg-blue-600 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                      role="switch"
                      aria-checked="true"
                      aria-label={`Toggle ${n.label} notifications`}
                    >
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Button variant="primary" size="sm" onClick={handleSave}>
                    {saved ? "Saved!" : "Save Preferences"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <h2 className="text-[15px] font-semibold text-slate-800 mb-5">Security Settings</h2>
              <div className="space-y-4 max-w-md">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" helperText="At least 8 characters with a number and symbol." />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                <div className="flex justify-end pt-2">
                  <Button variant="primary" size="sm">Update Password</Button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-[13px] font-semibold text-slate-700 mb-3">Danger Zone</h3>
                <div className="flex items-center justify-between p-4 rounded-[10px] border border-red-100 bg-red-50/50">
                  <div>
                    <p className="text-[13px] font-medium text-red-800">Delete Account</p>
                    <p className="text-[12px] text-red-600">This is permanent and cannot be undone.</p>
                  </div>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === "integrations" && (
            <Card>
              <h2 className="text-[15px] font-semibold text-slate-800 mb-2">Integrations</h2>
              <p className="text-[13px] text-slate-500 mb-5">Connect external tools and services to extend Opsentra.</p>
              <div className="space-y-3">
                {[
                  { name: "Email Sync", desc: "Sync project updates via email", status: "coming_soon" },
                  { name: "WhatsApp Business API", desc: "Send notifications via WhatsApp", status: "coming_soon" },
                  { name: "Accounting Integration", desc: "Connect to Sage/QuickBooks for invoicing", status: "coming_soon" },
                  { name: "Supabase", desc: "Real-time database and auth backend", status: "connected" },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 rounded-[10px] border border-slate-200"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-slate-800">{integration.name}</p>
                      <p className="text-[12px] text-slate-400">{integration.desc}</p>
                    </div>
                    {integration.status === "connected" ? (
                      <Badge color="#059669" bg="#D1FAE5" dot dotColor="#10B981" size="sm">Connected</Badge>
                    ) : (
                      <Badge color="#94A3B8" bg="#F1F5F9" size="sm">Coming Soon</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === "data" && (
            <Card>
              <h2 className="text-[15px] font-semibold text-slate-800 mb-5">Data & Storage</h2>
              <div className="space-y-4">
                {[
                  { label: "Projects", count: 6, size: "2.1 MB" },
                  { label: "Tasks", count: 12, size: "0.8 MB" },
                  { label: "Comments", count: 4, size: "0.2 MB" },
                  { label: "Attachments", count: 0, size: "0 MB" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100">
                    <span className="text-[13px] text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] text-slate-400 tabular-nums">{item.count} records</span>
                      <span className="text-[12px] font-medium text-slate-600 tabular-nums w-16 text-right">{item.size}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-2 gap-2">
                  <Button variant="outline" size="sm">Export Data</Button>
                  <Button variant="secondary" size="sm">Clear Cache</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
