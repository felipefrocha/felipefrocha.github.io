.PHONY: help install build deploy clean dev check wrangler-install wrangler-login wrangler-logout preview

# Variables
PROJECT_NAME ?= feliperocha-systems
BUILD_DIR = dist/public
FUNCTIONS_DIR = functions
NODE_ENV ?= production

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

## help: Show this help message
help:
	@echo "$(CYAN)Available targets:$(NC)"
	@echo ""
	@echo "$(GREEN)Setup:$(NC)"
	@sed -n 's/^## //p' ${MAKEFILE_LIST} | awk 'BEGIN {FS = ": "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)Usage:$(NC)"
	@echo "  make <target>"
	@echo ""
	@echo "$(GREEN)Examples:$(NC)"
	@echo "  make install          # Install dependencies"
	@echo "  make build            # Build for Cloudflare Pages"
	@echo "  make deploy           # Deploy to Cloudflare Pages"
	@echo "  make build deploy     # Build and deploy in one command"

## install: Install npm dependencies
install:
	@echo "$(CYAN)Installing dependencies...$(NC)"
	npm install

## wrangler-install: Install Wrangler CLI globally
wrangler-install:
	@echo "$(CYAN)Installing Wrangler CLI...$(NC)"
	@if command -v wrangler > /dev/null; then \
		echo "$(GREEN)✓ Wrangler is already installed$(NC)"; \
		wrangler --version; \
	else \
		echo "$(YELLOW)Installing Wrangler globally...$(NC)"; \
		npm install -g wrangler; \
	fi

## wrangler-login: Login to Cloudflare via Wrangler
wrangler-login:
	@echo "$(CYAN)Logging in to Cloudflare...$(NC)"
	@if command -v wrangler > /dev/null; then \
		wrangler login; \
	else \
		echo "$(RED)✗ Wrangler CLI not found. Run 'make wrangler-install' first.$(NC)"; \
		exit 1; \
	fi

## wrangler-logout: Logout from Cloudflare
wrangler-logout:
	@echo "$(CYAN)Logging out from Cloudflare...$(NC)"
	@if command -v wrangler > /dev/null; then \
		wrangler logout; \
	else \
		echo "$(RED)✗ Wrangler CLI not found.$(NC)"; \
		exit 1; \
	fi

## check: Run TypeScript type checking
check:
	@echo "$(CYAN)Running TypeScript type check...$(NC)"
	npm run check

## build: Build the project for Cloudflare Pages
build:
	@echo "$(CYAN)Building for Cloudflare Pages...$(NC)"
	@echo "$(YELLOW)This will:$(NC)"
	@echo "  1. Build React frontend to $(BUILD_DIR)"
	@echo "  2. Bundle content files into Functions"
	@echo ""
	NODE_ENV=$(NODE_ENV) npm run build:cloudflare
	@echo ""
	@echo "$(GREEN)✓ Build complete!$(NC)"
	@echo "$(YELLOW)Output directory: $(BUILD_DIR)$(NC)"

## clean: Remove build artifacts
clean:
	@echo "$(CYAN)Cleaning build artifacts...$(NC)"
	rm -rf dist
	rm -f functions/_init.ts
	@echo "$(GREEN)✓ Clean complete!$(NC)"

## deploy: Deploy to Cloudflare Pages
deploy: build
	@echo "$(CYAN)Deploying to Cloudflare Pages...$(NC)"
	@if ! command -v wrangler > /dev/null; then \
		echo "$(RED)✗ Wrangler CLI not found. Run 'make wrangler-install' first.$(NC)"; \
		exit 1; \
	fi
	@if [ ! -d "$(BUILD_DIR)" ]; then \
		echo "$(RED)✗ Build directory not found. Run 'make build' first.$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Project name: $(PROJECT_NAME)$(NC)"
	@echo "$(YELLOW)Deploying...$(NC)"
	wrangler pages deploy $(BUILD_DIR) --project-name=$(PROJECT_NAME) --commit-dirty=true
	@echo ""
	@echo "$(GREEN)✓ Deployment complete!$(NC)"

## deploy-prod: Deploy to production (with explicit project name)
deploy-prod: build
	@echo "$(CYAN)Deploying to production...$(NC)"
	@if ! command -v wrangler > /dev/null; then \
		echo "$(RED)✗ Wrangler CLI not found. Run 'make wrangler-install' first.$(NC)"; \
		exit 1; \
	fi
	wrangler pages deploy $(BUILD_DIR) --project-name=$(PROJECT_NAME) --branch=main
	@echo "$(GREEN)✓ Production deployment complete!$(NC)"

## preview: Preview the build locally with Wrangler
preview: build
	@echo "$(CYAN)Starting local preview server...$(NC)"
	@if ! command -v wrangler > /dev/null; then \
		echo "$(RED)✗ Wrangler CLI not found. Run 'make wrangler-install' first.$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Starting preview on http://localhost:8788$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	wrangler pages dev $(BUILD_DIR) --project-name=$(PROJECT_NAME)

## dev: Run local development server (Express)
dev:
	@echo "$(CYAN)Starting development server...$(NC)"
	@echo "$(YELLOW)Server will run on http://localhost:3000$(NC)"
	npm run dev

## setup: Complete setup (install deps, wrangler, login)
setup: install wrangler-install
	@echo ""
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Run 'make wrangler-login' to authenticate with Cloudflare"
	@echo "  2. Run 'make build deploy' to build and deploy your site"

## full-deploy: Complete deployment workflow (clean, build, deploy)
full-deploy: clean build deploy
	@echo ""
	@echo "$(GREEN)✓ Full deployment workflow complete!$(NC)"

## verify: Verify build output and functions
verify: build
	@echo "$(CYAN)Verifying build...$(NC)"
	@if [ ! -d "$(BUILD_DIR)" ]; then \
		echo "$(RED)✗ Build directory not found$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(BUILD_DIR)/index.html" ]; then \
		echo "$(RED)✗ index.html not found in build output$(NC)"; \
		exit 1; \
	fi
	@if [ ! -f "$(FUNCTIONS_DIR)/_init.ts" ]; then \
		echo "$(YELLOW)⚠ functions/_init.ts not found (will be generated by Cloudflare)$(NC)"; \
	else \
		echo "$(GREEN)✓ functions/_init.ts exists$(NC)"; \
	fi
	@echo "$(GREEN)✓ Build verification passed!$(NC)"

## status: Check deployment status and configuration
status:
	@echo "$(CYAN)Project Status:$(NC)"
	@echo ""
	@echo "$(YELLOW)Configuration:$(NC)"
	@echo "  Project name: $(PROJECT_NAME)"
	@echo "  Build directory: $(BUILD_DIR)"
	@echo ""
	@echo "$(YELLOW)Tools:$(NC)"
	@if command -v node > /dev/null; then \
		echo "  Node.js: $$(node --version)"; \
	else \
		echo "  Node.js: $(RED)not installed$(NC)"; \
	fi
	@if command -v npm > /dev/null; then \
		echo "  npm: $$(npm --version)"; \
	else \
		echo "  npm: $(RED)not installed$(NC)"; \
	fi
	@if command -v wrangler > /dev/null; then \
		echo "  Wrangler: $$(wrangler --version)"; \
		echo "  $(GREEN)✓ Wrangler is installed$(NC)"; \
	else \
		echo "  Wrangler: $(RED)not installed$(NC)"; \
		echo "  Run 'make wrangler-install' to install"; \
	fi
	@echo ""
	@echo "$(YELLOW)Build artifacts:$(NC)"
	@if [ -d "$(BUILD_DIR)" ]; then \
		echo "  Build directory: $(GREEN)exists$(NC)"; \
		du -sh $(BUILD_DIR) 2>/dev/null | awk '{print "  Size: " $$1}'; \
	else \
		echo "  Build directory: $(YELLOW)not found (run 'make build')$(NC)"; \
	fi

