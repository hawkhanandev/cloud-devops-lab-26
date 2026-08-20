# Elastic IP for NAT Gateway
resource "aws_eip" "nat" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "cloud-devops-lab-nat-eip"
  }
}

# NAT Gateway in AZ1
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_az1.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    Name = "cloud-devops-lab-nat"
  }
}