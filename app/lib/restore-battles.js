const { sql } = require('../config/database-connection');

module.exports.findActiveBattles = sql`
  WITH
  select_active_battles AS (
    SELECT
      "battleId"
    FROM
      battles
    WHERE
      "status" = 'In progress'
  ),
  select_logs_for_active_battles AS (
    SELECT DISTINCT
      "battleId",
      (details->'army'->>'armyId')::UUID AS "armyId",
      FIRST_VALUE(details->'units')
      OVER(
        PARTITION BY
          details->'army'->>'armyId'
        ORDER BY
          "createdAt" DESC
      )::INT AS "units"
    FROM
      battle_logs
    WHERE
      "battleId" IN (SELECT * FROM select_active_battles)
      AND
      "event" = 'Damaged'
  ),
  select_armies AS (
    SELECT
      armies."armyId",
      armies."battleId",
      armies."name",
      (
        CASE
        WHEN logs."units" IS NOT NULL THEN
          logs."units"
        ELSE
          armies."units"
        END
      ) AS "units",
      armies."strategy"
    FROM
      armies
    LEFT JOIN select_logs_for_active_battles logs ON
      logs."armyId" = armies."armyId"
      AND
      logs."battleId" = armies."battleId"
    WHERE
      armies."battleId" IN (SELECT * FROM select_active_battles)
  )
  SELECT
    sab."battleId",
    COALESCE(jsonb_agg(row_to_json(sa)), '[]')::jsonb AS "armies"
  FROM
    select_active_battles sab
  LEFT JOIN select_armies sa ON
    sab."battleId" = sa."battleId"
    AND
    sa."units" > 0
  GROUP BY
    sab."battleId";`;
