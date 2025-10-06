#!/bin/bash
set -e

# Logging
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "===== Starting EC2 initialization at $(date) ====="

# Update system
echo "===== Updating system packages ====="
apt-get update
apt-get upgrade -y

# Set hostname
echo "===== Setting hostname ====="
hostnamectl set-hostname ${hostname}
echo "127.0.0.1 ${hostname}" >> /etc/hosts

# Install essential packages
echo "===== Installing essential packages ====="
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    wget

# Install Docker
echo "===== Installing Docker ====="
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Create a devops group
groupadd -f devops
usermod -aG devops ubuntu

# Create application directories
echo "===== Setting up directories ====="
mkdir -p /opt/app
mkdir -p /opt/monitoring
chown -R ubuntu:ubuntu /opt/app
chown -R ubuntu:ubuntu /opt/monitoring

echo "===== EC2 initialization completed at $(date) ====="
echo "Setup complete!" > /var/lib/cloud/instance/boot-finished