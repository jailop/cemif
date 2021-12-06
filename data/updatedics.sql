USE cemif;

DELETE FROM datasources;
LOAD DATA LOCAL INFILE './dict/datasources.csv'
  REPLACE INTO TABLE datasources
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (label, title, description, attributes, publisher, url, notes);

DELETE FROM municipalities;
LOAD DATA LOCAL INFILE './dict/municipalities.csv'
  REPLACE INTO TABLE municipalities
  FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (id, shp, contab, department, municipality, address, phone, email, url, km2);

DELETE FROM population;
LOAD DATA LOCAL INFILE './supl/population.csv'
  REPLACE INTO TABLE population
  FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (municipality, year, datasource, attribute, value);
