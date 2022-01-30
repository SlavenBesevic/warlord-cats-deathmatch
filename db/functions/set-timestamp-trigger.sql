-- CREATE SET TIMESTAMP TRIGGER FOR ALL TABLES
DO $function$
DECLARE new_trigger text;
BEGIN
  FOR new_trigger IN
    SELECT format(
      'CREATE TRIGGER ' 
      || table_name
      || '_set_timestamp BEFORE UPDATE ON '
      || table_schema
      || '.'
      || table_name
      || ' FOR EACH ROW EXECUTE PROCEDURE timestamp_trigger();'
    )
    FROM (
      SELECT
        quote_ident(table_name) AS table_name,
        quote_ident(table_schema) AS table_schema
      FROM
        information_schema.tables
      WHERE
        table_schema = 'public'
        AND
        table_type = 'BASE TABLE'
    ) tablist 
  LOOP
    EXECUTE new_trigger;
  END LOOP;
END $function$
