# Monitoring Setup Documentation

## Overview
This document describes the monitoring implementation for the ProjectHub application using Prometheus and Grafana.

---

## Architecture

```
┌─────────────┐
│   Grafana   │  ← Visualization
└──────┬──────┘
       │
┌──────▼──────────┐
│   Prometheus    │  ← Metrics Collection & Alerting
└────┬─┬─┬─┬──────┘
     │ │ │ │
     │ │ │ └─────────► Prometheus (self-monitoring)
     │ │ └───────────► cAdvisor (container metrics)
     │ └─────────────► Node Exporter (system metrics)
     └───────────────► Backend App (application metrics)
                       Postgres Exporter (database metrics)
```

---

## Metrics Collected

### Application Metrics (Backend)
- **http_requests_total** - Total HTTP requests by method, route, status code
- **http_request_duration_seconds** - Request latency histogram
- **db_query_duration_seconds** - Database query performance
- **projecthub_nodejs_*** - Node.js process metrics (CPU, memory, heap)

### Database Metrics (PostgreSQL)
- **pg_up** - Database availability
- **pg_stat_database_*** - Database statistics
- **pg_stat_activity_count** - Active connections

### System Metrics (Node Exporter)
- **node_cpu_seconds_total** - CPU usage
- **node_memory_*** - Memory usage
- **node_filesystem_*** - Disk usage
- **node_network_*** - Network traffic

### Container Metrics (cAdvisor)
- **container_cpu_usage_seconds_total** - Container CPU
- **container_memory_usage_bytes** - Container memory
- **container_network_*** - Container network

---

## Configured Alerts

| Alert Name     | Severity | Threshold               | Purpose                        |
|----------------|----------|--------------------------|--------------------------------|
| ServiceDown    | Critical | Service down for 1min    | Detect backend unavailability |
| DatabaseDown   | Critical | Database down for 1min   | Detect database unavailability |
| HighErrorRate  | Warning  | >5% error rate for 2min  | Detect application errors     |

---

## Dashboards

### ProjectHub Monitoring Dashboard
**Panels:**
1. **Backend Status** - Real-time service health (UP/DOWN)
2. **Database Status** - Database connectivity
3. **Request Rate** - HTTP requests per second
4. **CPU Usage** - System CPU utilization
5. **Error Rate** - 5xx errors over time

---

## Alert Philosophy

We follow these principles for alerting:
- **Alert on symptoms, not causes** - Alert when users are impacted
- **Actionable alerts only** - Every alert should require human action
- **Avoid alert fatigue** - Set appropriate thresholds to minimize false positives
- **Critical vs Warning** - Critical = immediate action, Warning = investigate soon

---

## Service Level Objectives (SLOs)

| Metric         | Target | Current                              |
|----------------|--------|--------------------------------------|
| Availability   | 99%    | Monitored via `up` metric            |
| Error Rate     | <1%    | Monitored via `http_requests_total`  |
| Response Time  | <500ms | Monitored via `http_request_duration_seconds` |

---

## Access Information

- **Grafana:** http://YOUR_EC2_IP:3001 (admin / admin123)
- **Prometheus:** http://YOUR_EC2_IP:9090

---

## Future Improvements

- [ ] Add alerting notifications (email, Slack, PagerDuty)
- [ ] Implement distributed tracing
- [ ] Add custom business metrics
- [ ] Set up log aggregation (ELK stack)
- [ ] Create SLO-based alerting
- [ ] Add synthetic monitoring
