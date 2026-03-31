-- ==========================================
-- Opsentra Engineering Operations System
-- Database Schema for Supabase (PostgreSQL)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS (extends Supabase auth.users)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'worker' CHECK (role IN ('admin', 'manager', 'worker')),
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can insert users" ON public.users FOR INSERT WITH CHECK (true);

-- ==========================================
-- CLIENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view clients" ON public.clients FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers+ can manage clients" ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- ==========================================
-- PROJECTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'completed')),
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view projects" ON public.projects FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers+ can manage projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- ==========================================
-- TASKS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view tasks" ON public.tasks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage tasks" ON public.tasks FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- COMMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT at_least_one_ref CHECK (task_id IS NOT NULL OR project_id IS NOT NULL)
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view comments" ON public.comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage own comments" ON public.comments FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- ACTIVITY LOG
-- ==========================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'task', 'comment', 'client', 'user')),
  entity_id UUID NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view activity" ON public.activity_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can insert activity" ON public.activity_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON public.comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_project_id ON public.comments(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ==========================================
-- VIEWS
-- ==========================================

-- Project summary view with task counts
CREATE OR REPLACE VIEW public.project_summary AS
SELECT
  p.*,
  c.name AS client_name,
  c.contact_person,
  COUNT(t.id) AS task_count,
  COUNT(t.id) FILTER (WHERE t.status = 'done') AS done_count,
  COUNT(t.id) FILTER (WHERE t.due_date < NOW() AND t.status != 'done') AS overdue_count
FROM public.projects p
LEFT JOIN public.clients c ON p.client_id = c.id
LEFT JOIN public.tasks t ON t.project_id = p.id
GROUP BY p.id, c.name, c.contact_person;

-- Dashboard stats view
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.projects) AS total_projects,
  (SELECT COUNT(*) FROM public.projects WHERE status = 'active') AS active_projects,
  (SELECT COUNT(*) FROM public.tasks) AS total_tasks,
  (SELECT COUNT(*) FROM public.tasks WHERE due_date < NOW() AND status != 'done') AS overdue_tasks,
  (SELECT COUNT(*) FROM public.tasks WHERE status = 'done') AS completed_tasks,
  (SELECT COUNT(*) FROM public.users) AS team_size,
  (SELECT COUNT(*) FROM public.clients) AS total_clients;

-- ==========================================
-- FUNCTION: Auto-log activity
-- ==========================================
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_metadata JSONB DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- JOB STATUSES (configurable)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.job_statuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#64748B',
  bg_color TEXT NOT NULL DEFAULT '#F1F5F9',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view job statuses" ON public.job_statuses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers+ can manage job statuses" ON public.job_statuses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- ==========================================
-- WORKSHOPS (configurable)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view workshops" ON public.workshops FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Managers+ can manage workshops" ON public.workshops FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- ==========================================
-- JOBS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_number TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  assigned_technician_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE SET NULL,
  expected_completion_date DATE,
  status_id UUID NOT NULL REFERENCES public.job_statuses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view jobs" ON public.jobs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage jobs" ON public.jobs FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_jobs_status_id ON public.jobs(status_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_technician_id ON public.jobs(assigned_technician_id);
CREATE INDEX IF NOT EXISTS idx_jobs_expected_completion_date ON public.jobs(expected_completion_date);

-- Auto-increment job number sequence
CREATE SEQUENCE IF NOT EXISTS public.job_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_job_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_number IS NULL OR NEW.job_number = '' THEN
    NEW.job_number := 'JOB-' || LPAD(nextval('public.job_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_job_number
  BEFORE INSERT ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.generate_job_number();

-- ==========================================
-- REALTIME
-- Enable realtime for key tables
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
