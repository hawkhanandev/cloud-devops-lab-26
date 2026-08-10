terraform {
  backend "s3" {
    bucket = "cloud-devops-terraform-state-26"
    key    = "global/s3/terraform.tfstate"
    region = "us-east-1"
    dynamodb_table = "tf-state-lock-for-cloud-devops-lab-26"
    encrypt = true
  }
}