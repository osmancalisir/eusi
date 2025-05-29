#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for database to be ready..."
until psql -U $DB_USER -d $DB_NAME -h $DB_HOST -c "SELECT 1" >/dev/null 2>&1; do
  sleep 2
done

# Run migrations
for file in /src/db/migrations/*.sql; do
  echo "Running migration: $(basename $file)"
  psql -U $DB_USER -d $DB_NAME -h $DB_HOST -f "$file"
done

echo "Database initialization complete!"
exec "$@"
