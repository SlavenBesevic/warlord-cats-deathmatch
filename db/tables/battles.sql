CREATE TABLE public.battles (
  "battleId" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT,
  "status" battle_status NOT NULL DEFAULT 'Pending',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT battle_pkey PRIMARY KEY ("battleId")
);

CREATE OR REPLACE FUNCTION public.battle_status_log()
RETURNS TRIGGER AS $function$
DECLARE
  numberOfArmies INT;
  numberOfActiveBattles INT;
BEGIN
  If NEW."status" = 'In progress' THEN
    SELECT
      COUNT(*)
    INTO
      numberOfArmies
    FROM
      armies
    WHERE
      "battleId" = NEW."battleId";

    IF numberOfArmies < 3 THEN
      RAISE 'cannot start battle with less than 3 armies' USING ERRCODE = '23001';
    END IF;

    SELECT
      COUNT(*)
    INTO
      numberOfActiveBattles
    FROM
      battles
    WHERE
      "status" = 'In progress';

    IF numberOfActiveBattles >= 5 THEN
      RAISE '5 battles are in progress, try again in a few seconds' USING ERRCODE = '23001';
    END IF;

    INSERT INTO battle_logs (
      "battleId",
      "event")
    VALUES (
      NEW."battleId",
      'Started');
  ELSIF NEW."status" = 'Finished' THEN
    INSERT INTO battle_logs (
      "battleId",
      "event")
    VALUES (
      NEW."battleId",
      'Finished');
  END IF;
  RETURN NEW;
END $function$
LANGUAGE 'plpgsql';

CREATE TRIGGER "battle_status_log"
BEFORE INSERT OR UPDATE ON public.battles
FOR EACH ROW
EXECUTE PROCEDURE public.battle_status_log();
