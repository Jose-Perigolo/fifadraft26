-- Add pickOrder column to drafts table
-- Run this in Supabase SQL Editor

-- Add pickOrder column
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS "pickOrder" TEXT[] DEFAULT '{}';

-- Update existing drafts with correct pick order
-- First, get all users in the correct order
WITH user_order AS (
  SELECT id, name, 
         CASE name 
           WHEN 'Jamal' THEN 0
           WHEN 'Leo' THEN 1
           WHEN 'Jean' THEN 2
           WHEN 'João Luiz' THEN 3
           WHEN 'José' THEN 4
           WHEN 'Pituca' THEN 5
           WHEN 'Foguin' THEN 6
           WHEN 'Jamir' THEN 7
           ELSE 999
         END as sort_order
  FROM users
  ORDER BY sort_order
)
UPDATE drafts 
SET "pickOrder" = (
  SELECT array_agg(uo.id ORDER BY uo.sort_order)
  FROM user_order uo
)
WHERE "pickOrder" IS NULL OR array_length("pickOrder", 1) IS NULL;
