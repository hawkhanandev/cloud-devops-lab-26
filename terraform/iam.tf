resource "aws_iam_role" "ec2_role_terraform" {
  name = "ec2-role-001"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-profile-001"
  role = aws_iam_role.ec2_role_terraform.name
}

resource "aws_iam_role_policy_attachment" "cloudwatch" {
  role = aws_iam_role.ec2_role_terraform.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_role_policy_attachment" "s3" {
  role = aws_iam_role.ec2_role_terraform.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}