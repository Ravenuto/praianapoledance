-- Owner email constant helper
CREATE OR REPLACE FUNCTION public.owner_email()
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public
AS $$ SELECT 'ravenutto@gmail.com'::text $$;

CREATE TABLE IF NOT EXISTS public.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid
);

GRANT SELECT ON public.access_requests TO authenticated;
GRANT ALL ON public.access_requests TO service_role;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own access request" ON public.access_requests;
CREATE POLICY "Users can view their own access request"
ON public.access_requests FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Replace the "first user becomes admin" trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_access()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) = public.owner_email() THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.access_requests (user_id, email, status)
    VALUES (NEW.id, lower(coalesce(NEW.email, '')), 'pending')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
DROP FUNCTION IF EXISTS public.grant_first_user_admin();
DROP TRIGGER IF EXISTS on_auth_user_created_access ON auth.users;
CREATE TRIGGER on_auth_user_created_access
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_access();

-- Protect the owner's admin role
CREATE OR REPLACE FUNCTION public.protect_owner_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE target uuid;
BEGIN
  target := COALESCE(OLD.user_id, NEW.user_id);
  IF OLD.role = 'admin' AND EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id = target AND lower(u.email) = public.owner_email()
  ) THEN
    RAISE EXCEPTION 'A conta principal nao pode perder o acesso de administradora';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS protect_owner_role_trg ON public.user_roles;
CREATE TRIGGER protect_owner_role_trg
BEFORE UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.protect_owner_role();

-- Admin-only listing of requests with role info
CREATE OR REPLACE FUNCTION public.admin_list_access()
RETURNS TABLE (user_id uuid, email text, status text, created_at timestamptz, is_admin boolean, is_owner boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradoras podem ver os acessos';
  END IF;
  RETURN QUERY
  SELECT u.id,
         lower(u.email)::text,
         COALESCE(ar.status, CASE WHEN public.has_role(u.id, 'admin') THEN 'approved' ELSE 'pending' END)::text,
         u.created_at,
         public.has_role(u.id, 'admin'),
         lower(u.email) = public.owner_email()
  FROM auth.users u
  LEFT JOIN public.access_requests ar ON ar.user_id = u.id
  ORDER BY u.created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_decide_access(_user_id uuid, _approve boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradoras podem alterar acessos';
  END IF;
  IF EXISTS (SELECT 1 FROM auth.users u WHERE u.id = _user_id AND lower(u.email) = public.owner_email()) THEN
    RAISE EXCEPTION 'A conta principal nao pode ser alterada';
  END IF;

  IF _approve THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM public.user_roles WHERE user_id = _user_id;
  END IF;

  INSERT INTO public.access_requests (user_id, email, status, decided_at, decided_by)
  SELECT u.id, lower(u.email), CASE WHEN _approve THEN 'approved' ELSE 'rejected' END, now(), auth.uid()
  FROM auth.users u WHERE u.id = _user_id
  ON CONFLICT (user_id) DO UPDATE
    SET status = EXCLUDED.status, decided_at = now(), decided_by = auth.uid();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_access() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_decide_access(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_access() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_decide_access(uuid, boolean) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_owner_role() FROM PUBLIC, anon, authenticated;