resource "aws_vpc" "labvpc" {
  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = { Name = "cloud-devops-lab-vpc" }
}