CREATE TABLE public.armies (
  "armyId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "battleId" UUID,
  "name" TEXT NOT NULL,
  "units" INT NOT NULL CHECK ("units" BETWEEN 80 AND 100),
  "strategy" army_strategy NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT army_pkey PRIMARY KEY ("armyId"),
  CONSTRAINT fk_armies_battle_id FOREIGN KEY ("battleId")
    REFERENCES public.battles ("battleId") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE OR REPLACE FUNCTION public.before_insert_army()
RETURNS TRIGGER AS $function$
DECLARE
  battleStatus battle_status;
BEGIN
  SELECT
    "status"
  INTO
    battleStatus
  FROM
    battles
  WHERE
    "battleId" = NEW."battleId";

  If battleStatus <> 'Pending' THEN
    RAISE 'battle already started' USING ERRCODE = '23001';
  END IF;
  RETURN NEW;
END $function$
LANGUAGE 'plpgsql';

CREATE TRIGGER "before_insert_army"
BEFORE INSERT ON public.armies
FOR EACH ROW
EXECUTE PROCEDURE public.before_insert_army();
