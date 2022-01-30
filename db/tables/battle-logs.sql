CREATE TABLE public.battle_logs (
  "logId" BIGSERIAL,
  "battleId" UUID NOT NULL,
  "event" battle_events NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT log_pkey PRIMARY KEY ("logId")
);

CREATE OR REPLACE FUNCTION public.finish_battle()
RETURNS TRIGGER AS $function$
BEGIN
  If NEW."event" = 'Winner' THEN
    UPDATE battles
    SET
      "status" = 'Finished'
    WHERE
      "battleId" = NEW."battleId";
  END IF;
  RETURN NEW;
END $function$
LANGUAGE 'plpgsql';

CREATE TRIGGER "finish_battle"
AFTER INSERT ON public.battle_logs
FOR EACH ROW
EXECUTE PROCEDURE public.finish_battle();
