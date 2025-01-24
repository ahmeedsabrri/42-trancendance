# Variables
DOCKER_COMPOSE_FILE = docker-compose.yml

# Default target
.PHONY: help
help: ## Show help message for available make targets
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker Compose Commands
all: up ## Start all containers
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build

.PHONY: up
up: ## Start containers in detached mode
	docker compose -f $(DOCKER_COMPOSE_FILE) up -d

.PHONY: down
down: ## Stop and remove containers
	docker compose -f $(DOCKER_COMPOSE_FILE) down

.PHONY: build
build: ## Build the containers without using cache
	docker compose -f $(DOCKER_COMPOSE_FILE) build --no-cache

.PHONY: logs
logs: ## Show logs of all running containers
	docker compose -f $(DOCKER_COMPOSE_FILE) logs -f

.PHONY: restart
restart: ## Restart all containers
	$(MAKE) down
	$(MAKE) up

.PHONY: ps
ps: ## List running containers
	docker compose -f $(DOCKER_COMPOSE_FILE) ps

# Cleaning and Maintenance
.PHONY: clean
clean: ## Remove all stopped containers, networks, images, and unused volumes
	docker system prune -af --volumes

.PHONY: exec
exec: ## Execute a command in a running container
	@read -p "Enter container name: " container; \
	 read -p "Enter command to execute: " cmd; \
	 docker exec -it $$container $$cmd

.PHONY: logs-container
logs-container: ## Show logs for a specific container
	@read -p "Enter container name: " container; \
	 docker logs $$container

.PHONY: inspect
inspect: ## Inspect a container or service
	@read -p "Enter container or service name: " name; \
	 docker inspect $$name

.PHONY: stop
stop: ## Stop running containers without removing them
	docker compose -f $(DOCKER_COMPOSE_FILE) stop

.PHONY: start
start: ## Start stopped containers
	docker compose -f $(DOCKER_COMPOSE_FILE) start

.PHONY: bash
bash: ## Open a bash shell in a running container
	@read -p "Enter container name: " container; \
	 docker exec -it $$container bash

