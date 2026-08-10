resource "aws_subnet" "public" {
  vpc_id = aws_vpc.labvpc.id
  cidr_block = var.public_subnet_cidr
  availability_zone = var.availability_zone
  map_public_ip_on_launch = true

  tags = { Name = "cloud-devops-lab-public-subnet" }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.labvpc.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = var.availability_zone
  map_public_ip_on_launch = false

  tags = { Name = "cloud-devops-lab-private-subnet" }
}