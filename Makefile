.PHONY: help run-backend run-frontend run-dev docker-up docker-down test lint clean

help:
	@echo "Digital Arrest Interceptor Dev Tooling:"
	@echo "  make run-backend   - Run Python FastAPI backend locally"
	@echo "  make run-frontend  - Run Vite React frontend locally"
	@echo "  make docker-up     - Build and run the entire stack inside containers"
	@echo "  make docker-down   - Spin down running containers"
	@echo "  make test          - Run pytest backend test suite"
	@echo "  make lint          - Run linters on backend (ruff) and frontend (eslint)"
	@echo "  make clean         - Clear cache files and databases"

run-backend:
	cd backend && uvicorn main:app --host 127.0.0.1 --port 8000 --reload

run-frontend:
	cd frontend && npm run dev

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

test:
	cd backend && pytest -v

lint:
	@echo "== Linting Python Backend =="
	cd backend && ruff check . || true
	@echo "== Linting React Frontend =="
	cd frontend && npm run lint || true

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "interceptor.db" -delete
