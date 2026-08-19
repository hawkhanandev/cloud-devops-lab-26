variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_az1_cidr" {
  description = "Public Subnet AZ1 CIDR (Bastion + ALB)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_az2_cidr" {
  description = "Public Subnet AZ2 CIDR (ALB 2nd node)"
  type        = string
  default     = "10.0.3.0/24"
}

variable "private_subnet_az1_cidr" {
  description = "Private Subnet AZ1 CIDR (App EC2)"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_az2_cidr" {
  description = "Private Subnet AZ2 CIDR (Tooling EC2)"
  type        = string
  default     = "10.0.4.0/24"
}

variable "availability_zone_1" {
  description = "Primary AZ"
  type        = string
  default     = "us-east-1a"
}

variable "availability_zone_2" {
  description = "Secondary AZ"
  type        = string
  default     = "us-east-1b"
}

variable "my_ip" {
  description = "Local machine public IP (CIDR) for bastion SSH access"
  type        = string
}

variable "public_key_path" {
  description = "Path to your SSH public key file"
  type        = string
}
