#!/bin/bash
set -euo pipefail

PROJECT_ROOT=$(pwd)
LOG_FILE="$PROJECT_ROOT/startup.log"
PID_FILE="$PROJECT_ROOT/app.pid"
BACKEND_PORT="3000"
FRONTEND_PORT="5173"
HEALTH_CHECK_INTERVAL="5"
STARTUP_TIMEOUT="60"

log_info() {
  date +"%Y-%m-%d %H:%M:%S" "$@" >> "$LOG_FILE"
}

log_error() {
  date +"%Y-%m-%d %H:%M:%S" "$@" >&2
  echo "$@" >> "$LOG_FILE"
}

cleanup() {
  log_info "Cleaning up processes and files..."
  if [ -f "$PID_FILE" ]; then
    while read -r pid; do
      if ps -p "$pid" > /dev/null; then
        kill "$pid"
        log_info "Killed process: $pid"
      fi
    done < "$PID_FILE"
    rm "$PID_FILE"
  fi
  log_info "Cleanup complete."
}

check_dependencies() {
  if ! command -v node > /dev/null; then
    log_error "Error: Node.js is not installed."
    exit 1
  fi
  if ! command -v npm > /dev/null; then
     log_error "Error: npm is not installed"
     exit 1
  fi
    if ! command -v mongod > /dev/null; then
     log_error "Error: MongoDB is not installed"
     exit 1
  fi
  log_info "Dependencies check passed."
}

check_port() {
  local port="$1"
  if nc -z localhost "$port"; then
    log_error "Error: Port $port is already in use."
    exit 1
  fi
}

wait_for_service() {
  local port="$1"
  local timeout="$2"
  local start_time=$(date +%s)
  while true; do
    if nc -z localhost "$port"; then
      log_info "Service listening on port $port"
      return 0
    fi
    local current_time=$(date +%s)
    local elapsed_time=$((current_time - start_time))
    if [ "$elapsed_time" -gt "$timeout" ]; then
      log_error "Timeout waiting for service on port $port"
      return 1
    fi
    sleep "$HEALTH_CHECK_INTERVAL"
  done
}
verify_service() {
  local port="$1"
  if ! nc -z localhost "$port"; then
    log_error "Service is not healthy on port $port"
    return 1
  fi
}

start_database() {
  log_info "Starting MongoDB..."
  mongod --fork --logpath "$PROJECT_ROOT/mongodb.log"
  if [ $? -ne 0 ]; then
    log_error "Failed to start MongoDB."
    exit 1
  fi
  sleep 5
   log_info "MongoDB started."
}

start_backend() {
  log_info "Starting backend server..."
  cd "$PROJECT_ROOT/api"
  npm install
  npm start &
  BACKEND_PID=$!
  echo "$BACKEND_PID" >> "$PID_FILE"
  cd "$PROJECT_ROOT"
    if [ $? -ne 0 ]; then
        log_error "Failed to start backend server."
        cleanup
        exit 1
    fi
  log_info "Backend server started. PID: $BACKEND_PID"
}

start_frontend() {
  log_info "Starting frontend server..."
  cd "$PROJECT_ROOT"
    npm install
  npm run dev -- --port "$FRONTEND_PORT" &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" >> "$PID_FILE"
  cd "$PROJECT_ROOT"
      if [ $? -ne 0 ]; then
        log_error "Failed to start frontend server."
        cleanup
        exit 1
    fi
  log_info "Frontend server started. PID: $FRONTEND_PID"
}

store_pid() {
  echo "$BACKEND_PID" >> "$PID_FILE"
  echo "$FRONTEND_PID" >> "$PID_FILE"
}

trap cleanup EXIT ERR INT TERM

log_info "Starting MVP Application..."
check_dependencies
check_port "$BACKEND_PORT"
check_port "$FRONTEND_PORT"
start_database
wait_for_service "27017" "$STARTUP_TIMEOUT"
start_backend
wait_for_service "$BACKEND_PORT" "$STARTUP_TIMEOUT"
start_frontend
wait_for_service "$FRONTEND_PORT" "$STARTUP_TIMEOUT"
log_info "MVP Application started successfully."
store_pid
log_info "Backend URL: http://localhost:$BACKEND_PORT"
log_info "Frontend URL: http://localhost:$FRONTEND_PORT"