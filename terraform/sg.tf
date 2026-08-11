resource "aws_security_group" "bastion" {
  name = "cloud-devops-lab-bastion-sg"
  description = "SSH allowed from my IP only"
  vpc_id = aws_vpc.labvpc.id

  ingress {
    description = "SSH from my IP only"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["139.135.55.206/32"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-bastion-sg" }
}

#SG for APP SERVER

resource "aws_security_group" "app" {
  name = "cloud-devops-lab-app-sg"
  description = "SSH allowed from bastion only"
  vpc_id = aws_vpc.labvpc.id

  ingress {
    description = "SSH from bastion only"
    from_port = 22
    to_port = 22
    protocol = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }
egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-app-sg" }
}
