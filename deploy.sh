#!/bin/bash

# Automated Deployment Script for Berkut Cloud
# This script automates the deployment process

set -e  # Exit on any error

# Configuration
PROJECT_DIR="/var/www/berkut-cloud"
SERVICE_NAME="berkut-cloud.service"
LOG_FILE="/var/log/berkut-deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check if running as root or with sudo
check_permissions() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root or with sudo"
        exit 1
    fi
}

# Function to check service status
check_service_status() {
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        success "Service $SERVICE_NAME is running"
        return 0
    else
        error "Service $SERVICE_NAME is not running"
        return 1
    fi
}

# Main deployment function
deploy() {
    log "Starting automated deployment process..."
    
    # Step 1: Navigate to project directory
    log "Step 1: Navigating to project directory: $PROJECT_DIR"
    cd "$PROJECT_DIR" || {
        error "Failed to navigate to project directory"
        exit 1
    }
    
    # Step 2: Pull latest changes
    log "Step 2: Pulling latest changes from repository..."
    if git pull origin main; then
        success "Successfully pulled latest changes"
    else
        error "Failed to pull latest changes"
        exit 1
    fi
    
    # Step 3: Install dependencies
    log "Step 3: Installing dependencies..."
    if npm ci --production; then
        success "Dependencies installed successfully"
    else
        warning "Dependency installation had issues, continuing..."
    fi
    
    # Step 4: Build the application
    log "Step 4: Building application for production..."
    if npm run build; then
        success "Application built successfully"
    else
        error "Build failed"
        exit 1
    fi
    
    # Step 5: Restart the service
    log "Step 5: Restarting production service..."
    if systemctl restart "$SERVICE_NAME"; then
        success "Service restarted successfully"
    else
        error "Failed to restart service"
        exit 1
    fi
    
    # Step 6: Wait a moment for service to start
    log "Step 6: Waiting for service to start..."
    sleep 5
    
    # Step 7: Check service status
    log "Step 7: Verifying service status..."
    if check_service_status; then
        success "Deployment completed successfully!"
        log "Service is running and ready to serve requests"
    else
        error "Service failed to start after deployment"
        exit 1
    fi
    
    # Step 8: Show service logs (last 10 lines)
    log "Step 8: Recent service logs:"
    journalctl -u "$SERVICE_NAME" --no-pager -n 10 | tee -a "$LOG_FILE"
}

# Function to show help
show_help() {
    echo "Berkut Cloud Automated Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  deploy     Run the full deployment process"
    echo "  status     Check the current service status"
    echo "  logs       Show recent deployment logs"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy    # Run deployment"
    echo "  $0 status    # Check service status"
    echo "  $0 logs      # Show deployment logs"
}

# Function to show status
show_status() {
    log "Checking service status..."
    systemctl status "$SERVICE_NAME" --no-pager
}

# Function to show logs
show_logs() {
    log "Recent deployment logs:"
    if [[ -f "$LOG_FILE" ]]; then
        tail -n 50 "$LOG_FILE"
    else
        warning "No deployment log file found"
    fi
}

# Main script logic
main() {
    case "${1:-deploy}" in
        "deploy")
            check_permissions
            deploy
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
