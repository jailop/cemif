USE cemif;

SELECT 'year', 'muni_contab_id', 'object', 'class', 'amount'
UNION
SELECT year, municipality, object, class, SUM(amount) AS amount
FROM munibudget
WHERE LENGTH(object) = 2
GROUP BY year, municipality, object, class
INTO OUTFILE "/tmp/mun-budget-year-header.csv"
   FIELDS TERMINATED BY ','
   OPTIONALLY ENCLOSED BY '"'
   LINES TERMINATED BY '\n';

SELECT 'year', 'muni_contab_id', 'account', 'amount'
UNION
SELECT year, municipality, account, SUM(amount) AS amount
FROM municontab
WHERE LENGTH(account) = 3 AND month=14 AND class='END'
GROUP BY year, municipality, account
INTO OUTFILE "/tmp/mun-contab-year-header.csv"
   FIELDS TERMINATED BY ','
   OPTIONALLY ENCLOSED BY '"'
   LINES TERMINATED BY '\n';
