output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID of the public subnet"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.web_server.id
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web_server.id
}

output "vm_id" {
  description = "ID of the EC2 instance (alias for pipeline)"
  value       = aws_instance.web_server.id
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.web_server.private_ip
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.web_server.public_ip
}

output "vm_public_ip" {
  description = "Public IP address of the VM (alias for pipeline)"
  value       = aws_eip.web_server.public_ip
}

output "elastic_ip" {
  description = "Elastic IP address"
  value       = aws_eip.web_server.public_ip
}

output "instance_ami_id" {
  description = "AMI ID used for the instance"
  value       = aws_instance.web_server.ami
}

output "ssh_connection_string" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_eip.web_server.public_ip}"
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${aws_eip.web_server.public_ip}"
}

output "api_url" {
  description = "URL to access the API"
  value       = "http://${aws_eip.web_server.public_ip}/api"
}

output "prometheus_url" {
  description = "URL to access Prometheus"
  value       = "http://${aws_eip.web_server.public_ip}:9090"
}

output "grafana_url" {
  description = "URL to access Grafana"
  value       = "http://${aws_eip.web_server.public_ip}:3000"
}

# Sensitive outputs
output "instance_state" {
  description = "State of the EC2 instance"
  value       = aws_instance.web_server.instance_state
}

# Summary output for easy reference
output "deployment_summary" {
  description = "Summary of deployed resources"
  value = {
    region            = var.aws_region
    instance_id       = aws_instance.web_server.id
    instance_type     = var.instance_type
    public_ip         = aws_eip.web_server.public_ip
    private_ip        = aws_instance.web_server.private_ip
    vpc_id            = aws_vpc.main.id
    security_group_id = aws_security_group.web_server.id
    ssh_key_name      = aws_key_pair.deployer.key_name
  }
}