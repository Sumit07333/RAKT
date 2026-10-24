# AWS Cloud Deployment Architecture (Target State)

**Academic Context:** IIT Patna — Cloud Computing Team Project — 2026

## Target AWS Topology:
1. **Frontend Distribution:** AWS S3 Bucket configured for static website hosting, fronted by an **AWS CloudFront** distribution with SSL (ACM) and edge caching.
2. **Compute Layer:** AWS ECS (Elastic Container Service) with Fargate running the Python FastAPI backend containers inside private VPC subnets.
3. **Application Load Balancer (ALB):** Routes traffic to ECS targets, manages SSL termination, and handles health checks at `/health`.
4. **Database Layer:** Amazon RDS PostgreSQL (Multi-AZ for high availability) with automated daily snapshots.
5. **Caching Layer:** Amazon ElastiCache for Redis handling active session state and caching inventory freshness queries.
6. **Monitoring:** Amazon CloudWatch metrics, alarms, and container logs.
