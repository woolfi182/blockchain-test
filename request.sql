
-- 3. (Bonus) Write simple SQL queries to get the following data.
-- AVG number of requests per specific timeframe

SELECT
  COUNT(*) / EXTRACT(EPOCH FROM MAX("createdAt") - MIN("createdAt")) AS rps
FROM apirequestlogs
WHERE
  "createdAt" BETWEEN 'timestamp1' AND 'timestamp2';

-- Sum of all request in specific time frame

SELECT
  COUNT(*) AS total
FROM apirequestlogs
WHERE
  "createdAt" BETWEEN 'timestamp1' AND 'timestamp2';

-- 3 hour time period for specific api key, when the usage is the highest (Example: 3:00pm to 6:00pm)

SELECT
  DATE_TRUNC('hour', "createdAt") AS "hour", 
  COUNT(*) AS reqs
FROM apirequestlogs
WHERE "apiKey" = 'key2'
  AND "createdAt" BETWEEN 'timestamp1' AND 'timestamp2'
GROUP BY "hour"
ORDER BY "reqs" DESC;

-- Most used API key (with num of req)

SELECT
  "apiKey",
  COUNT(*) as count 
FROM apirequestlogs 
GROUP BY "apiKey"
ORDER BY count DESC 
LIMIT 1;
