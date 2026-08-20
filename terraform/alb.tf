# Application Load Balancer

resource "aws_lb" "app" {
  name               = "cloud-devops-lab-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  
  subnets = [
    aws_subnet.public_az1.id,
    aws_subnet.public_az2.id,
  ]

  enable_deletion_protection = false
  tags = { Name = "cloud-devops-lab-alb" }
}

# Target Group pointing at port 80 on App EC2

resource "aws_lb_target_group" "app" {
  name     = "cloud-devops-lab-app-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.labvpc.id

  health_check {
    enabled             = true
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200-399"
  }

  tags = { Name = "cloud-devops-lab-app-tg" }
}

# Register App EC2 as the target

resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = aws_instance.app.id
  port             = 80
}

# HTTP Listener — forward to target group

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
