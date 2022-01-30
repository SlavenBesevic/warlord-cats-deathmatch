CREATE OR REPLACE FUNCTION public.timestamp_trigger()
RETURNS TRIGGER AS $function$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;
