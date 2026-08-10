variable "aws_region" {
  description = "AWS region"
  type = string
  default = "us-east-1"
}

variable "environment" {
  description = "cloud-devops-lab-26"
  type = string
  default = "dev"
}

variable "vpc_cidr" {
  description = "CIDR for the VPC"
  type = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public Subnet CIDR (bastion host)"
  type = string
  default = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "private subnet CIDR (app server)"
  type = string
  default = "10.0.2.0/24"
}

variable "availability_zone" {
  description = "AZ for subnets"
  type = string
  default = "us-east-1a"
}