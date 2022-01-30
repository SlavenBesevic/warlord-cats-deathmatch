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
