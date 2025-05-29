# backend/db/init.sh

echo "Waiting for database to be ready..."
max_retries=15
retries=0

until psql -U $DB_USER -d $DB_NAME -h $DB_HOST -c "SELECT 1" >/dev/null 2>&1; do
  retries=$((retries+1))
  if [ $retries -ge $max_retries ]; then
    echo "❌ Database connection failed after $max_retries attempts"
    exit 1
  fi
  echo "Attempt $retries: Database not ready yet. Retrying in 3 seconds..."
  sleep 3
done

echo "✅ Database connection established"

for file in /src/db/migrations/*.sql; do
  echo "Running migration: $(basename $file)"
  psql -U $DB_USER -d $DB_NAME -h $DB_HOST -f "$file" || exit 1
done

echo "Database initialization complete!"
exec "$@"
