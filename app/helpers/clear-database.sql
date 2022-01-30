-- DELETE EVERYTHING FROM ALL TABLES
CREATE OR REPLACE PROCEDURE public.delete_everything_from_all_tables()
LANGUAGE plpgsql
AS $function$
DECLARE table_to_delete TEXT;
BEGIN
  FOR table_to_delete IN
    SELECT 'TRUNCATE ' || table_name || ' CASCADE;'
    FROM (
      SELECT table_name
      FROM information_schema.tables
      WHERE
        table_schema = 'public'
        AND
        table_type = 'BASE TABLE'
    ) tablist 
  LOOP
    EXECUTE table_to_delete;
  END LOOP;
END;
$function$;
