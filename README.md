# 🚀 ProjectDocs – Savannah Informatics DevOps Engineer Assessment

This repository contains a comprehensive DevOps assessment project for Savannah Informatics. It demonstrates infrastructure provisioning, configuration management, CI/CD automation, cost optimization, monitoring, and incident response—all built around a containerized Node.js application.

---

## 📁 Repository Structure

| Path                  | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `.github/workflows/`  | GitHub Actions workflows for CI/CD deployment using Docker Compose v2       |
| `infra-cost/`         | Terraform cost estimation and optimization using infracost                  |
| `ansible-playbook/`   | Ansible playbook for VM provisioning and Docker setup                       |
| `app/`                | Node.js backend application with Prometheus metrics and health checks       |
| `cicd/`               | Documentation for CI/CD pipeline design and implementation                  |
| `docs/`               | Markdown documentation for monitoring setup and incident response           |
| `infrastructure/`     | Terraform configuration for cloud infrastructure provisioning               |
| `LICENSE`             | License file for the project                                                |
| `README.md`           | Main documentation (this file)                                              |

---

## 🧰 Tech Stack

- **Application:** Node.js (Express)
- **Infrastructure as Code:** Terraform
- **Configuration Management:** Ansible
- **CI/CD:** GitHub Actions, Docker Compose
- **Monitoring:** Prometheus, Grafana, Node Exporter, cAdvisor, Postgres Exporter
- **Cost Analysis:** Infracost
- **Containerization:** Docker

---

## 🛠️ Setup Overview

### 1. Provision Infrastructure
Use Terraform modules in [`infrastructure/`](infrastructure/) to provision cloud resources. Customize variables in `terraform.tfvars`.

### 2. Configure VM
Run the Ansible playbook in [`ansible-playbook/`](ansible-playbook/) to install Docker and prepare the environment:
```bash
ansible-playbook setup.yml -i inventory.ini
```

### 3. Deploy Application
Use Docker Compose to build and run the Node.js app and monitoring stack:
```bash
cd app/
sudo docker-compose up -d --build
```

### 4. CI/CD Pipeline
GitHub Actions workflows in `.github/workflows/` automate build, test, and deployment. See [`cicd/`](cicd/) for pipeline documentation.

---

## 📊 Monitoring & Observability

Prometheus scrapes metrics from:
- Node.js backend (`/metrics`)
- PostgreSQL (via Postgres Exporter)
- Node Exporter (system metrics)
- cAdvisor (container metrics)

Grafana visualizes these metrics using preconfigured dashboards.

See [`docs/monitoring.md`](docs/monitoring.md) for architecture and metrics breakdown.

---

## 🔔 Incident Response

Prometheus alerts are configured for:
- Backend downtime
- Database unavailability
- High error rates

Response procedures, escalation steps, and postmortem templates are documented in [`docs/incident-response.md`](docs/incident-response.md).

---

## 💰 Infrastructure Cost Optimization

The [`infra-cost/`](infra-cost/) module uses Infracost to estimate and optimize cloud resource costs. Run:
```bash
infracost breakdown --path infrastructure/
```

---

## 🎯 Service Level Objectives (SLOs)

| Metric         | Target   |
|----------------|----------|
| Availability   | ≥ 99%    |
| Error Rate     | ≤ 1%     |
| Response Time  | ≤ 500ms  |

---

## 🔮 Future Enhancements

- [ ] Add alert notifications (Slack, email, PagerDuty)
- [ ] Implement distributed tracing
- [ ] Add custom business metrics
- [ ] Set up log aggregation (ELK stack)
- [ ] Create SLO-based alerting
- [ ] Add synthetic monitoring

---

## 📄 License

This project is provided for assessment and demonstration purposes. Not licensed for production use.

---

