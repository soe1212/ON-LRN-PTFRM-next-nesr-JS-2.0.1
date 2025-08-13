.PHONY: help dev build test clean docker-build docker-up docker-down logs k8s-apply k8s-delete seed

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}\' $(MAKEFILE_LIST)

dev: ## Start development environment
	@echo "🚀 Starting development environment..."
	@pnpm install
	@docker-compose up -d postgres mongodb redis rabbitmq elasticsearch kibana minio consul prometheus grafana loki promtail jaeger nginx-hls
	@echo "⏳ Waiting for services to be ready..."
	@sleep 30
	@pnpm db:migrate
	@pnpm db:seed
	@pnpm dev

build: ## Build all packages
	@echo "🔨 Building all packages..."
	@pnpm build

test: ## Run all tests
	@echo "🧪 Running tests..."
	@pnpm test

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	@pnpm clean
	@rm -rf node_modules/.cache
	@rm -rf .turbo

docker-build: ## Build all Docker images
	@echo "🐳 Building Docker images..."
	@docker-compose build

docker-up: ## Start all containers
	@echo "🚀 Starting all containers..."
	@docker-compose up -d

docker-down: ## Stop all containers
	@echo "🛑 Stopping all containers..."
	@docker-compose down

logs: ## View container logs
	@echo "📋 Viewing container logs..."
	@docker-compose logs -f

k8s-apply: ## Apply Kubernetes manifests
	@echo "☸️ Applying Kubernetes manifests..."
	@kubectl apply -f k8s/

k8s-delete: ## Delete Kubernetes resources
	@echo "🗑️ Deleting Kubernetes resources..."
	@kubectl delete -f k8s/

seed: ## Seed database with sample data
	@echo "🌱 Seeding database..."
	@pnpm db:seed

reset: ## Reset and reseed database
	@echo "🔄 Resetting database..."
	@docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS eduplatform; CREATE DATABASE eduplatform;"
	@docker-compose exec mongodb mongosh --eval "db.dropDatabase()"
	@pnpm db:migrate
	@pnpm db:seed

monitoring: ## Open monitoring dashboards
	@echo "📊 Opening monitoring dashboards..."
	@open http://localhost:3001  # Grafana
	@open http://localhost:9090  # Prometheus
	@open http://localhost:16686 # Jaeger
	@open http://localhost:5601  # Kibana

status: ## Check service status
	@echo "📈 Checking service status..."
	@docker-compose ps

backup: ## Backup databases
	@echo "💾 Creating database backups..."
	@mkdir -p backups
	@docker-compose exec postgres pg_dump -U postgres eduplatform > backups/postgres-$(shell date +%Y%m%d-%H%M%S).sql
	@docker-compose exec mongodb mongodump --db eduplatform --out backups/mongo-$(shell date +%Y%m%d-%H%M%S)

restore: ## Restore databases (requires BACKUP_FILE variable)
	@echo "♻️ Restoring databases..."
	@test -n "$(BACKUP_FILE)" || (echo "Usage: make restore BACKUP_FILE=backup.sql"; exit 1)
	@docker-compose exec postgres psql -U postgres eduplatform < $(BACKUP_FILE)