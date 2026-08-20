output "bastion_public_ip" {
  description = "Public IP of the bastion — use this in hosts.ini and SSH commands"
  value       = aws_instance.bastion.public_ip
}

output "app_private_ip" {
  description = "Private IP of the App EC2"
  value       = aws_instance.app.private_ip
}

output "jenkins_private_ip" {
  description = "Private IP of Jenkins EC2"
  value       = aws_instance.jenkins.private_ip
}

output "sonarqube_private_ip" {
  description = "Private IP of SonarQube EC2"
  value       = aws_instance.sonarqube.private_ip
}

output "observability_private_ip" {
  description = "Private IP of Observability EC2 (Prometheus + Grafana)"
  value       = aws_instance.observability.private_ip
}

output "alb_dns_name" {
  description = "ALB DNS name — paste this in your browser to reach the app"
  value       = aws_lb.app.dns_name
}

output "vpc_id" {
  value = aws_vpc.labvpc.id
}
