import type { Client, User, Project, Task, Comment, ActivityLog, DashboardStats, JobStatus, Workshop, Job } from "./types";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Aubrey Ndlovu", role: "admin", email: "aubrey@opsentra.co.za", avatar_url: null },
  { id: "u2", name: "Sipho Dlamini", role: "manager", email: "sipho@opsentra.co.za", avatar_url: null },
  { id: "u3", name: "Thandi Mokoena", role: "worker", email: "thandi@opsentra.co.za", avatar_url: null },
  { id: "u4", name: "Johan van der Berg", role: "worker", email: "johan@opsentra.co.za", avatar_url: null },
  { id: "u5", name: "Lerato Sithole", role: "manager", email: "lerato@opsentra.co.za", avatar_url: null },
];

export const MOCK_CLIENTS: Client[] = [
  { id: "c1", name: "Transnet Engineering", contact_person: "Deon Fourie", phone: "+27 11 584 3000", email: "deon.fourie@transnet.net", created_at: "2024-01-10T08:00:00Z" },
  { id: "c2", name: "Sasol Industries", contact_person: "Mariza Botha", phone: "+27 11 441 3111", email: "mariza.botha@sasol.com", created_at: "2024-02-05T09:30:00Z" },
  { id: "c3", name: "ArcelorMittal SA", contact_person: "Riaan Steyn", phone: "+27 16 889 9111", email: "riaan.steyn@arcelormittal.com", created_at: "2024-02-20T11:00:00Z" },
  { id: "c4", name: "Eskom Holdings", contact_person: "Nomsa Khumalo", phone: "+27 11 800 8111", email: "nomsa.khumalo@eskom.co.za", created_at: "2024-03-01T10:00:00Z" },
  { id: "c5", name: "Murray & Roberts", contact_person: "Craig Hamilton", phone: "+27 11 456 0800", email: "craig.hamilton@murrob.com", created_at: "2024-03-15T14:00:00Z" },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Boiler Replacement — Unit 4",
    client_id: "c1",
    status: "active",
    start_date: "2024-11-01",
    due_date: "2025-04-30",
    created_at: "2024-11-01T08:00:00Z",
    description: "Full replacement of the 50MW boiler unit at the Germiston facility including pipework, insulation, and commissioning.",
    client: MOCK_CLIENTS[0],
    _task_count: 12,
    _overdue_count: 1,
    _done_count: 7,
  },
  {
    id: "p2",
    name: "Cooling Tower Refurbishment",
    client_id: "c2",
    status: "active",
    start_date: "2025-01-15",
    due_date: "2025-05-15",
    created_at: "2025-01-15T09:00:00Z",
    description: "Structural refurbishment of 3 cooling towers, including fan replacement, water treatment, and basin repairs.",
    client: MOCK_CLIENTS[1],
    _task_count: 8,
    _overdue_count: 3,
    _done_count: 2,
  },
  {
    id: "p3",
    name: "Conveyor Belt System Upgrade",
    client_id: "c3",
    status: "active",
    start_date: "2025-02-01",
    due_date: "2025-06-30",
    created_at: "2025-02-01T10:00:00Z",
    description: "Upgrade of 6 conveyor belt lines from manual to automated control systems with real-time monitoring.",
    client: MOCK_CLIENTS[2],
    _task_count: 15,
    _overdue_count: 0,
    _done_count: 5,
  },
  {
    id: "p4",
    name: "Substation Maintenance",
    client_id: "c4",
    status: "on_hold",
    start_date: "2025-01-01",
    due_date: "2025-03-31",
    created_at: "2025-01-01T08:00:00Z",
    description: "Annual maintenance of 132kV substation including transformer inspection, relay testing, and earthing upgrades.",
    client: MOCK_CLIENTS[3],
    _task_count: 6,
    _overdue_count: 2,
    _done_count: 3,
  },
  {
    id: "p5",
    name: "Structural Steel Audit",
    client_id: "c5",
    status: "completed",
    start_date: "2024-09-01",
    due_date: "2024-12-31",
    created_at: "2024-09-01T08:00:00Z",
    description: "NDT and visual inspection of structural steel at the Cape Town facility. All reports submitted.",
    client: MOCK_CLIENTS[4],
    _task_count: 10,
    _overdue_count: 0,
    _done_count: 10,
  },
  {
    id: "p6",
    name: "HVAC System Installation",
    client_id: "c1",
    status: "active",
    start_date: "2025-03-01",
    due_date: "2025-07-31",
    created_at: "2025-03-01T08:00:00Z",
    description: "Installation of a new centralized HVAC system across the main workshop floor, including ductwork and controls.",
    client: MOCK_CLIENTS[0],
    _task_count: 9,
    _overdue_count: 0,
    _done_count: 1,
  },
];

export const MOCK_TASKS: Task[] = [
  { id: "t1", project_id: "p1", title: "Site inspection & hazard assessment", description: "Complete initial site walkthrough with safety officer.", status: "done", assigned_to: "u3", due_date: "2024-11-10", priority: "high", created_at: "2024-11-01T08:00:00Z", assignee: MOCK_USERS[2] },
  { id: "t2", project_id: "p1", title: "Procurement — boiler components", description: "Issue PO for pressure vessel, fittings, and insulation.", status: "done", assigned_to: "u2", due_date: "2024-11-20", priority: "high", created_at: "2024-11-01T09:00:00Z", assignee: MOCK_USERS[1] },
  { id: "t3", project_id: "p1", title: "Remove old boiler unit", description: "Decommission and remove existing boiler. Requires hot work permit.", status: "in_progress", assigned_to: "u4", due_date: "2025-01-30", priority: "high", created_at: "2024-11-15T08:00:00Z", assignee: MOCK_USERS[3] },
  { id: "t4", project_id: "p1", title: "Install new pressure vessel", description: "Lift and install 50MW pressure vessel with crane team.", status: "todo", assigned_to: "u3", due_date: "2025-02-28", priority: "high", created_at: "2024-11-15T09:00:00Z", assignee: MOCK_USERS[2] },
  { id: "t5", project_id: "p1", title: "Pipework installation", description: "Install steam supply and return pipework per isometric drawings.", status: "todo", assigned_to: "u4", due_date: "2025-03-15", priority: "medium", created_at: "2024-11-15T10:00:00Z", assignee: MOCK_USERS[3] },
  { id: "t6", project_id: "p2", title: "Structural condition assessment", description: "Visual and NDT inspection of tower structure.", status: "done", assigned_to: "u3", due_date: "2025-01-25", priority: "high", created_at: "2025-01-15T09:00:00Z", assignee: MOCK_USERS[2] },
  { id: "t7", project_id: "p2", title: "Fan motor replacement", description: "Replace 3x 75kW fan motors with new efficiency-rated units.", status: "in_progress", assigned_to: "u4", due_date: "2025-02-20", priority: "high", created_at: "2025-01-15T10:00:00Z", assignee: MOCK_USERS[3] },
  { id: "t8", project_id: "p2", title: "Basin repair and lining", description: "Repair concrete basin and apply chemical-resistant lining.", status: "todo", assigned_to: "u3", due_date: "2025-03-10", priority: "medium", created_at: "2025-01-20T08:00:00Z", assignee: MOCK_USERS[2] },
  { id: "t9", project_id: "p3", title: "Control panel design", description: "Engineer SCADA control panels for 6 conveyor lines.", status: "in_progress", assigned_to: "u2", due_date: "2025-03-01", priority: "high", created_at: "2025-02-01T10:00:00Z", assignee: MOCK_USERS[1] },
  { id: "t10", project_id: "p3", title: "Cable tray installation", description: "Install galvanized cable trays across all 6 conveyor sections.", status: "todo", assigned_to: "u4", due_date: "2025-04-01", priority: "medium", created_at: "2025-02-05T08:00:00Z", assignee: MOCK_USERS[3] },
  { id: "t11", project_id: "p4", title: "Transformer oil sampling", description: "Sample and test insulating oil from 3x transformers.", status: "done", assigned_to: "u5", due_date: "2025-01-15", priority: "high", created_at: "2025-01-01T08:00:00Z", assignee: MOCK_USERS[4] },
  { id: "t12", project_id: "p4", title: "Relay protection testing", description: "Test and calibrate protection relays per OEM schedule.", status: "in_progress", assigned_to: "u3", due_date: "2025-02-28", priority: "high", created_at: "2025-01-10T09:00:00Z", assignee: MOCK_USERS[2] },
];

export const MOCK_COMMENTS: Comment[] = [
  { id: "cm1", task_id: "t3", project_id: "p1", user_id: "u4", content: "Hot work permit approved. Starting decommissioning Monday.", created_at: "2025-01-25T10:30:00Z", user: MOCK_USERS[3] },
  { id: "cm2", task_id: "t3", project_id: "p1", user_id: "u2", content: "Good. Ensure all isolation points are locked out before proceeding. Safety officer must be on site.", created_at: "2025-01-25T11:15:00Z", user: MOCK_USERS[1] },
  { id: "cm3", task_id: "t7", project_id: "p2", user_id: "u4", content: "First motor installed. Alignment check passed. Moving to motor 2.", created_at: "2025-02-18T14:00:00Z", user: MOCK_USERS[3] },
  { id: "cm4", task_id: null, project_id: "p2", user_id: "u2", content: "Client requested an additional site visit on 28 Feb. Please schedule accordingly.", created_at: "2025-02-20T09:00:00Z", user: MOCK_USERS[1] },
];

export const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  { id: "a1", user_id: "u2", action: "updated_status", entity_type: "task", entity_id: "t7", metadata: { from: "todo", to: "in_progress", task_title: "Fan motor replacement" }, created_at: "2025-02-18T14:00:00Z", user: MOCK_USERS[1] },
  { id: "a2", user_id: "u1", action: "created_project", entity_type: "project", entity_id: "p6", metadata: { project_name: "HVAC System Installation" }, created_at: "2025-03-01T08:00:00Z", user: MOCK_USERS[0] },
  { id: "a3", user_id: "u4", action: "added_comment", entity_type: "comment", entity_id: "cm3", metadata: { task_title: "Fan motor replacement" }, created_at: "2025-02-18T14:00:00Z", user: MOCK_USERS[3] },
  { id: "a4", user_id: "u3", action: "updated_status", entity_type: "task", entity_id: "t6", metadata: { from: "in_progress", to: "done", task_title: "Structural condition assessment" }, created_at: "2025-01-28T16:30:00Z", user: MOCK_USERS[2] },
  { id: "a5", user_id: "u5", action: "updated_status", entity_type: "task", entity_id: "t11", metadata: { from: "in_progress", to: "done", task_title: "Transformer oil sampling" }, created_at: "2025-01-16T11:00:00Z", user: MOCK_USERS[4] },
  { id: "a6", user_id: "u2", action: "added_comment", entity_type: "comment", entity_id: "cm4", metadata: { project_name: "Cooling Tower Refurbishment" }, created_at: "2025-02-20T09:00:00Z", user: MOCK_USERS[1] },
  { id: "a7", user_id: "u1", action: "created_client", entity_type: "client", entity_id: "c5", metadata: { client_name: "Murray & Roberts" }, created_at: "2024-03-15T14:00:00Z", user: MOCK_USERS[0] },
  { id: "a8", user_id: "u4", action: "updated_status", entity_type: "task", entity_id: "t3", metadata: { from: "todo", to: "in_progress", task_title: "Remove old boiler unit" }, created_at: "2025-01-27T08:00:00Z", user: MOCK_USERS[3] },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_projects: 6,
  active_projects: 4,
  total_tasks: 12,
  overdue_tasks: 3,
  completed_tasks: 5,
  completion_rate: 42,
  team_size: 5,
  total_clients: 5,
};

export const MOCK_WEEKLY_TASK_DATA = [
  { week: "Week 1", completed: 3, created: 5 },
  { week: "Week 2", completed: 5, created: 4 },
  { week: "Week 3", completed: 2, created: 6 },
  { week: "Week 4", completed: 7, created: 4 },
  { week: "Week 5", completed: 4, created: 3 },
  { week: "Week 6", completed: 6, created: 5 },
];

export const MOCK_PROJECT_STATUS_DATA = [
  { name: "Active", value: 4, color: "#10B981" },
  { name: "On Hold", value: 1, color: "#F59E0B" },
  { name: "Completed", value: 1, color: "#3B82F6" },
];

export const MOCK_JOB_STATUSES: JobStatus[] = [
  { id: "js1", name: "Received",             color: "#64748B", bg_color: "#F1F5F9", sort_order: 1, is_default: true  },
  { id: "js2", name: "In Workshop",          color: "#2563EB", bg_color: "#DBEAFE", sort_order: 2, is_default: false },
  { id: "js3", name: "Awaiting Parts",       color: "#D97706", bg_color: "#FEF3C7", sort_order: 3, is_default: false },
  { id: "js4", name: "Quality Check",        color: "#7C3AED", bg_color: "#EDE9FE", sort_order: 4, is_default: false },
  { id: "js5", name: "Ready for Collection", color: "#059669", bg_color: "#D1FAE5", sort_order: 5, is_default: false },
  { id: "js6", name: "Completed",            color: "#059669", bg_color: "#D1FAE5", sort_order: 6, is_default: false },
  { id: "js7", name: "Cancelled",            color: "#DC2626", bg_color: "#FEE2E2", sort_order: 7, is_default: false },
];

export const MOCK_WORKSHOPS: Workshop[] = [
  { id: "w1", name: "Workshop A",          location: "Main Building — Bay 1–3"  },
  { id: "w2", name: "Workshop B",          location: "Main Building — Bay 4–6"  },
  { id: "w3", name: "Fabrication Shop",    location: "East Wing"                },
  { id: "w4", name: "Electrical Workshop", location: "West Wing, Level 2"       },
];

export const MOCK_JOBS: Job[] = [
  {
    id: "j1", job_number: "JOB-0001",
    description: "Hydraulic pump overhaul and seal replacement",
    client_id: "c1", assigned_technician_id: "u3", workshop_id: "w1",
    expected_completion_date: "2026-04-10", status_id: "js2",
    created_at: "2026-03-15T08:00:00Z",
    client: MOCK_CLIENTS[0], assigned_technician: MOCK_USERS[2],
    workshop: MOCK_WORKSHOPS[0], status: MOCK_JOB_STATUSES[1],
  },
  {
    id: "j2", job_number: "JOB-0002",
    description: "Gearbox bearing replacement — 5-stage helical unit",
    client_id: "c2", assigned_technician_id: "u4", workshop_id: "w1",
    expected_completion_date: "2026-04-05", status_id: "js3",
    created_at: "2026-03-18T09:30:00Z",
    client: MOCK_CLIENTS[1], assigned_technician: MOCK_USERS[3],
    workshop: MOCK_WORKSHOPS[0], status: MOCK_JOB_STATUSES[2],
  },
  {
    id: "j3", job_number: "JOB-0003",
    description: "Electric motor rewind — 75kW, 4-pole",
    client_id: "c3", assigned_technician_id: "u3", workshop_id: "w4",
    expected_completion_date: "2026-04-18", status_id: "js4",
    created_at: "2026-03-20T10:00:00Z",
    client: MOCK_CLIENTS[2], assigned_technician: MOCK_USERS[2],
    workshop: MOCK_WORKSHOPS[3], status: MOCK_JOB_STATUSES[3],
  },
  {
    id: "j4", job_number: "JOB-0004",
    description: "Valve actuator repair and calibration",
    client_id: "c4", assigned_technician_id: "u4", workshop_id: "w2",
    expected_completion_date: "2026-03-28", status_id: "js5",
    created_at: "2026-03-10T08:00:00Z",
    client: MOCK_CLIENTS[3], assigned_technician: MOCK_USERS[3],
    workshop: MOCK_WORKSHOPS[1], status: MOCK_JOB_STATUSES[4],
  },
  {
    id: "j5", job_number: "JOB-0005",
    description: "Conveyor drive shaft machining and balancing",
    client_id: "c3", assigned_technician_id: null, workshop_id: "w3",
    expected_completion_date: "2026-04-22", status_id: "js1",
    created_at: "2026-03-28T11:00:00Z",
    client: MOCK_CLIENTS[2], assigned_technician: undefined,
    workshop: MOCK_WORKSHOPS[2], status: MOCK_JOB_STATUSES[0],
  },
  {
    id: "j6", job_number: "JOB-0006",
    description: "Pressure vessel NDT inspection and certification",
    client_id: "c1", assigned_technician_id: "u5", workshop_id: null,
    expected_completion_date: "2026-04-30", status_id: "js2",
    created_at: "2026-03-29T08:00:00Z",
    client: MOCK_CLIENTS[0], assigned_technician: MOCK_USERS[4],
    workshop: undefined, status: MOCK_JOB_STATUSES[1],
  },
  {
    id: "j7", job_number: "JOB-0007",
    description: "Cooling tower fan blade replacement and balancing",
    client_id: "c2", assigned_technician_id: "u3", workshop_id: "w1",
    expected_completion_date: "2026-03-25", status_id: "js6",
    created_at: "2026-02-15T08:00:00Z",
    client: MOCK_CLIENTS[1], assigned_technician: MOCK_USERS[2],
    workshop: MOCK_WORKSHOPS[0], status: MOCK_JOB_STATUSES[5],
  },
];
