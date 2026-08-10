
resource "aws_eip" "nat" {
  domain = "vpc"
  
  tags = { Name = "cloud-devops-lab-nat-eip" }

    depends_on = [aws_internet_gateway.igw]
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.public.id
  
  tags = { Name = "cloud-devops-lab-nat" }
  
  depends_on = [aws_internet_gateway.igw]
}