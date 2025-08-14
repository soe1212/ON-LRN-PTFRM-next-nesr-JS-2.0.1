#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE users;
    CREATE DATABASE courses;
    CREATE DATABASE progress;
    CREATE DATABASE ecommerce;
    CREATE DATABASE payments;
    CREATE DATABASE recommendations;
    CREATE DATABASE analytics;
    CREATE DATABASE admin;
    CREATE DATABASE cms;
    CREATE DATABASE marketing;
    CREATE DATABASE compliance;
    CREATE DATABASE assessments;
    CREATE DATABASE ai_tutor;
    
    -- Enable vector extension for AI tutor service
    \c ai_tutor;
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL

echo "Multiple PostgreSQL databases created successfully!"