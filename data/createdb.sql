DROP DATABASE IF EXISTS cemif;
CREATE DATABASE cemif;

USE cemif;

DROP TABLE IF EXISTS datasources;
CREATE TABLE datasources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attributes TEXT,
    publisher VARCHAR(255),
    url VARCHAR(1024),
    notes TEXT,
    created_at DATETIME DEFAULT(CURRENT_TIME),
    updated_at DATETIME DEFAULT NULL,
    delete_at  DATETIME DEFAULT NULL,
    INDEX(label)
);

DROP TABLE IF EXISTS municipalities;
CREATE TABLE municipalities (
    id VARCHAR(12) PRIMARY KEY,
    shp INT DEFAULT(0),
    contab VARCHAR(12),
    department VARCHAR(64),
    municipality VARCHAR(64),
    address VARCHAR(1024),
    phone VARCHAR(255),
    email VARCHAR(255),
    url VARCHAR(1024),
    km2 FLOAT DEFAULT(0),
    INDEX(shp),
    INDEX(contab),
    created_at DATETIME DEFAULT(CURRENT_TIME),
    updated_at DATETIME DEFAULT NULL,
    delete_at  DATETIME DEFAULT NULL
);

DROP TABLE IF EXISTS population;
CREATE TABLE population (
  id INT AUTO_INCREMENT PRIMARY KEY,
  municipality VARCHAR(12),
  year INT,
  datasource VARCHAR(64),
  attribute VARCHAR(64),
  value FLOAT DEFAULT(0),
  created_at DATETIME DEFAULT(CURRENT_TIME),
  updated_at DATETIME DEFAULT NULL,
  delete_at  DATETIME DEFAULT NULL,
  INDEX(municipality),
  INDEX(datasource),
  FOREIGN KEY datasource_id (datasource)
    REFERENCES datasources(label)
    ON UPDATE CASCADE,
  FOREIGN KEY municipality_population (municipality)
    REFERENCES municipalities(id)
      ON UPDATE CASCADE
);

DROP TABLE IF EXISTS muniaccounts;
CREATE TABLE muniaccounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT,
  municipality VARCHAR(12),
  account VARCHAR(12),
  name VARCHAR(255),
  created_at DATETIME DEFAULT(CURRENT_TIME),
  updated_at DATETIME DEFAULT NULL,
  delete_at  DATETIME DEFAULT NULL,
  INDEX(year, account)
);

DROP TABLE IF EXISTS municontab;
CREATE TABLE municontab (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT,
  month INT,
  municipality VARCHAR(12),
  area VARCHAR(8),
  source VARCHAR(8),
  financier VARCHAR(8),
  ppto VARCHAR(8),
  account VARCHAR(12),
  class VARCHAR(12),
  amount FLOAT DEFAULT(0),
  created_at DATETIME DEFAULT(CURRENT_TIME),
  updated_at DATETIME DEFAULT NULL,
  delete_at  DATETIME DEFAULT NULL,
  INDEX(year, month, area, municipality, source, ppto, account),
  FOREIGN KEY municipality_municonta (municipality)
    REFERENCES municipalities(contab)
    ON UPDATE CASCADE
  -- FOREIGN KEY accounts_conta(account)
  --  REFERENCES muniaccounts(account)
  --  ON UPDATE CASCADE
);

DROP TABLE IF EXISTS muniobjects;
CREATE TABLE muniobjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT,
  municipality VARCHAR(12),
  object VARCHAR(12),
  name VARCHAR(255),
  created_at DATETIME DEFAULT(CURRENT_TIME),
  updated_at DATETIME DEFAULT NULL,
  delete_at  DATETIME DEFAULT NULL,
  INDEX(year, object)
);

DROP TABLE IF EXISTS muniprog;
CREATE TABLE muniprog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT,
  municipality VARCHAR(12),
  program VARCHAR(12),
  name VARCHAR(255),
  created_at DATETIME DEFAULT(CURRENT_TIME),
  updated_at DATETIME DEFAULT NULL,
  delete_at  DATETIME DEFAULT NULL,
  INDEX(year, municipality, program),
  FOREIGN KEY municipality_muniprog (municipality)
    REFERENCES municipalities(contab)
    ON UPDATE CASCADE
);

DROP TABLE IF EXISTS munibudget;
CREATE TABLE munibudget (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT,
  month INT,
  area VARCHAR(8),
  municipality VARCHAR(12),
  source VARCHAR(8),
  financier VARCHAR(8),
  ppto VARCHAR(8),
  object VARCHAR(12),
  project VARCHAR(12),
  program VARCHAR(12),
  class VARCHAR(12),
  amount FLOAT default(0),
  created_at DATETIME DEFAULT(CURRENT_TIME),
  updated_at DATETIME DEFAULT NULL,
  delete_at  DATETIME DEFAULT NULL,
  INDEX(year, month, area, municipality, source, ppto, program, object),
  FOREIGN KEY municipality_munibudget (municipality)
    REFERENCES municipalities(contab)
    ON UPDATE CASCADE
  -- FOREIGN KEY accounts_conta(account)
  --  REFERENCES muniaccounts(account)
  --  ON UPDATE CASCADE
);
