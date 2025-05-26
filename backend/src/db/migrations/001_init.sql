CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE satellite_images (
  id SERIAL PRIMARY KEY,
  catalog_id VARCHAR(255) UNIQUE NOT NULL,
  acquisition_date_start TIMESTAMP NOT NULL,
  resolution FLOAT NOT NULL,
  cloud_coverage FLOAT NOT NULL,
  geometry GEOGRAPHY(Polygon) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  image_id VARCHAR(255) REFERENCES satellite_images(catalog_id),
  order_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_satellite_images_geometry 
ON satellite_images USING GIST (geometry);
