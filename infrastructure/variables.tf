variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "devops-assessment"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "owner" {
  description = "Owner of the resources"
  type        = string
  default     = "DevOps Team"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"

  validation {
    condition     = can(regex("^t3\\.", var.instance_type)) || can(regex("^t2\\.", var.instance_type))
    error_message = "Instance type must be t2 or t3 family for cost optimization."
  }
}

variable "root_volume_size" {
  description = "Size of root volume in GB"
  type        = number
  default     = 50

  validation {
    condition     = var.root_volume_size >= 30 && var.root_volume_size <= 100
    error_message = "Root volume size must be between 30 and 100 GB."
  }
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
  sensitive   = true
}

variable "ssh_allowed_ips" {
  description = "List of IPs allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"]

  validation {
    condition     = length(var.ssh_allowed_ips) > 0
    error_message = "At least one IP address must be specified."
  }
}

variable "monitoring_allowed_ips" {
  description = "List of IPs allowed to access monitoring endpoints (Prometheus, Grafana)"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Change this to your IP for better security
}