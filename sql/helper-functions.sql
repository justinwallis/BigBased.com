-- Create helper functions for debugging

-- Function to check if a table exists
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
  );
END;
$$;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permissions()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'user_id', auth.uid(),
    'role', auth.role(),
    'can_select_sessions', (
      SELECT has_table_privilege(auth.uid(), 'public.user_sessions', 'SELECT')
    ),
    'can_insert_sessions', (
      SELECT has_table_privilege(auth.uid(), 'public.user_sessions', 'INSERT')
    ),
    'table_exists', (
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_sessions'
      )
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to execute SQL (for creating tables)
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
  RETURN 'Success';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$;
