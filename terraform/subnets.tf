# AZ1 Subnets

resource "aws_subnet" "public_az1" {
  vpc_id                  = aws_vpc.labvpc.id
  cidr_block              = var.public_subnet_az1_cidr
  availability_zone       = var.availability_zone_1
  map_public_ip_on_launch = true

  tags = { Name = "cloud-devops-lab-public-subnet-az1" }
}

resource "aws_subnet" "private_az1" {
  vpc_id                  = aws_vpc.labvpc.id
  cidr_block              = var.private_subnet_az1_cidr
  availability_zone       = var.availability_zone_1
  map_public_ip_on_launch = false

  tags = { Name = "cloud-devops-lab-private-subnet-az1" }
}

# AZ2 Subnets

resource "aws_subnet" "public_az2" {
  vpc_id                  = aws_vpc.labvpc.id
  cidr_block              = var.public_subnet_az2_cidr
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = true

  tags = { Name = "cloud-devops-lab-public-subnet-az2" }
}

resource "aws_subnet" "private_az2" {
  vpc_id                  = aws_vpc.labvpc.id
  cidr_block              = var.private_subnet_az2_cidr
  availability_zone       = var.availability_zone_2
  map_public_ip_on_launch = false

  tags = { Name = "cloud-devops-lab-private-subnet-az2" }
}