-- Docker Compose bootstrap script
-- Used only for local development and testing.
-- This script creates a minimal data set for the CelestialObjects table.
SET SERVEROUTPUT ON;
/*
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE CelestialObjects CASCADE CONSTRAINTS PURGE';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/
*/
CREATE TABLE CelestialObjects (
    object_id NUMBER PRIMARY KEY,
    object_name VARCHAR2(30) NOT NULL,
    category VARCHAR2(50) NOT NULL,
    distance_light_years NUMBER(16,6) DEFAULT 0,
    discovery_date DATE DEFAULT NULL,
    in_solar_system CHAR(1) DEFAULT 'N',
    habitability_score NUMBER(4,2) DEFAULT 0,
    surface_temperature NUMBER(12,2) DEFAULT NULL,
    gravity NUMBER(5,2) DEFAULT NULL,
    nitrogen CHAR(1) DEFAULT 'N',
    oxygen CHAR(1) DEFAULT 'N',
    co2 CHAR(1) DEFAULT 'N',
    sulfuric_acid CHAR(1) DEFAULT 'N',
    hydrogen CHAR(1) DEFAULT 'N',
    helium CHAR(1) DEFAULT 'N',
    methane CHAR(1) DEFAULT 'N',
    water_vapor CHAR(1) DEFAULT 'N',
    silicates CHAR(1) DEFAULT 'N',
    iron CHAR(1) DEFAULT 'N',
    nickel CHAR(1) DEFAULT 'N'
);

ALTER TABLE CelestialObjects
ADD CONSTRAINT chk_category CHECK (category IN (
    'Planet', 'Exoplanet', 'Moon', 'Dwarf Planet',
    'Asteroid', 'Comet', 'Black Hole', 'Neutron Star', 'Star'
));

ALTER TABLE CelestialObjects
ADD CONSTRAINT chk_in_solar_system CHECK (in_solar_system IN ('Y', 'N'));

ALTER TABLE CelestialObjects
ADD CONSTRAINT chk_habitability_score CHECK (habitability_score BETWEEN 0.00 AND 10.00);

INSERT INTO CelestialObjects
VALUES (1, 'Earth', 'Planet', 0.000000, NULL, 'Y', 10.00, 15.0, 1.00,
        'Y', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N');

INSERT INTO CelestialObjects
VALUES (2, 'Mars', 'Planet', 0.000015, TO_DATE('1659-12-28', 'YYYY-MM-DD'), 'Y', 4.00, -60.0, 0.38,
        'N', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N');

INSERT INTO CelestialObjects
VALUES (3, 'TRAPPIST-1e', 'Exoplanet', 39.0, TO_DATE('2017-02-22', 'YYYY-MM-DD'), 'N', 6.90, -18.0, 0.93,
        'Y', 'N', 'Y', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N');

COMMIT;
