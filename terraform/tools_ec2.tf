# Jenkins EC2

resource "aws_instance" "jenkins" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.small"
  subnet_id                   = aws_subnet.private_az1.id
  vpc_security_group_ids      = [aws_security_group.jenkins.id]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  key_name                    = aws_key_pair.lab_key.key_name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = { Name = "cloud-devops-lab-jenkins" }
}

# SonarQube EC2
resource "aws_instance" "sonarqube" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.small"   # SonarQube needs at least 2GB RAM
  subnet_id                   = aws_subnet.private_az1.id
  vpc_security_group_ids      = [aws_security_group.sonarqube.id]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  key_name                    = aws_key_pair.lab_key.key_name

  tags = { Name = "cloud-devops-lab-sonarqube" }
}

# Observability EC2
# Prometheus + Grafana + Alertmanager

resource "aws_instance" "observability" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.private_az1.id
  vpc_security_group_ids      = [aws_security_group.observability.id]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name
  key_name                    = aws_key_pair.lab_key.key_name

  tags = { Name = "cloud-devops-lab-observability" }
}
