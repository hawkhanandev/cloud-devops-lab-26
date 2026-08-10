data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "ec2-app" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.small"
  subnet_id = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.app.id]
  associate_public_ip_address = false
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  key_name = aws_key_pair.general_key_pair.key_name

  tags = {
    Name = "ec2-app-server"
  }


}
resource "aws_key_pair" "general_key_pair" {

  key_name = "general_key_pair"
  public_key = file("/home/hawkhanan/Downloads/cloud_devops_keypair_26.pub")
} 