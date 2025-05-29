-- backend/db/migrations/002_sample_data.sql

INSERT INTO satellite_images (
  catalog_id,
  acquisition_date_start,
  acquisition_date_end,
  resolution,
  cloud_coverage,
  off_nadir,
  sensor,
  scan_direction,
  satellite_elevation,
  image_bands,
  geometry
) VALUES (
  '10340100882340',
  '2023-09-22T11:14:26.000Z',
  '2023-09-22T11:14:33.000Z',
  0.33,
  31.02,
  12.59,
  'MV03',
  'Reverse',
  76.17,
  '8-BANDS',
  ST_GeogFromText('POLYGON((
    11.410587273581342 48.21262399691764,
    11.410587273581342 48.065735886535606,
    11.676255131610162 48.065735886535606,
    11.676255131610162 48.21262399691764,
    11.410587273581342 48.21262399691764
  ))')
);
