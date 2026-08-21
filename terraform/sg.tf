# Bastion SG
resource "aws_security_group" "bastion" {
  name        = "cloud-devops-lab-bastion-sg"
  description = "SSH from my IP only"
  vpc_id      = aws_vpc.labvpc.id

  ingress {
    description = "SSH from my IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-bastion-sg" }
}

# ALB SG
resource "aws_security_group" "alb" {
  name        = "cloud-devops-lab-alb-sg"
  description = "HTTP and HTTPS from internet"
  vpc_id      = aws_vpc.labvpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-alb-sg" }
}

# App EC2 SG
resource "aws_security_group" "app" {
  name        = "cloud-devops-lab-app-sg"
  description = "SSH from bastion, HTTP from ALB, Node Exporter from Observability"
  vpc_id      = aws_vpc.labvpc.id

  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "SSH from Jenkins for CI/CD deployment"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.jenkins.id]
  }

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description     = "Node Exporter scraped by Prometheus"
    from_port       = 9100
    to_port         = 9100
    protocol        = "tcp"
    security_groups = [aws_security_group.observability.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-app-sg" }
}

# Jenkins SG
resource "aws_security_group" "jenkins" {
  name        = "cloud-devops-lab-jenkins-sg"
  description = "SSH from bastion, Jenkins UI from VPC, metrics from Observability"
  vpc_id      = aws_vpc.labvpc.id

  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description = "Jenkins UI from VPC"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description = "Jenkins agent JNLP from VPC"
    from_port   = 50000
    to_port     = 50000
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description     = "Node Exporter scraped by Prometheus"
    from_port       = 9100
    to_port         = 9100
    protocol        = "tcp"
    security_groups = [aws_security_group.observability.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-jenkins-sg" }
}

# SonarQube SG
resource "aws_security_group" "sonarqube" {
  name        = "cloud-devops-lab-sonarqube-sg"
  description = "SSH from bastion, SonarQube UI from Jenkins and VPC"
  vpc_id      = aws_vpc.labvpc.id

  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "SonarQube from Jenkins"
    from_port       = 9000
    to_port         = 9000
    protocol        = "tcp"
    security_groups = [aws_security_group.jenkins.id]
  }

  ingress {
    description = "SonarQube UI from VPC (for SSH tunnel access)"
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description     = "Node Exporter scraped by Prometheus"
    from_port       = 9100
    to_port         = 9100
    protocol        = "tcp"
    security_groups = [aws_security_group.observability.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-sonarqube-sg" }
}

# Observability SG
resource "aws_security_group" "observability" {
  name        = "cloud-devops-lab-observability-sg"
  description = "SSH from bastion, Prometheus/Grafana/Alertmanager from VPC"
  vpc_id      = aws_vpc.labvpc.id

  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description = "Grafana from VPC (SSH tunnel)"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description = "Prometheus from VPC (SSH tunnel)"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description = "Alertmanager from VPC (SSH tunnel)"
    from_port   = 9093
    to_port     = 9093
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "cloud-devops-lab-observability-sg" }
}
