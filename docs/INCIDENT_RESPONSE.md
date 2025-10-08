# Incident Response Procedures

## Overview
This document outlines the procedures for responding to alerts and incidents in the ProjectHub application.

---

## 🔔 Alert Response Guide

### 🚨 ServiceDown Alert
**Severity:** Critical  
**Meaning:** The backend application is not responding to health checks

#### ✅ Immediate Actions
```bash
# Check container status
docker ps | grep projecthub-backend

# Check logs for errors
docker logs projecthub-backend --tail 50

# Check if backend is accessible
curl http://localhost:3000/health
```

#### 🛠️ Resolution Steps
```bash
# Restart the backend service
cd /opt/app
sudo docker-compose restart backend

# If restart fails, rebuild and redeploy
sudo docker-compose up -d --build backend

# Verify service is running
docker ps | grep projecthub-backend
curl http://localhost:3000/health
```

---

### 🚨 DatabaseDown Alert
**Severity:** Critical  
**Meaning:** Cannot connect to PostgreSQL database

#### ✅ Immediate Actions
```bash
# Check database container
docker ps | grep projecthub-db

# Check database logs
docker logs projecthub-db --tail 50

# Test database connection
docker exec -it projecthub-db psql -U projecthub_user -d projecthub_db -c "SELECT 1;"
```

#### 🛠️ Resolution Steps
```bash
# Restart database
sudo docker-compose restart postgres

# Check connections
docker logs postgres_exporter

# Verify backend can connect
docker logs projecthub-backend | grep -i database
```

---

### ⚠️ HighErrorRate Alert
**Severity:** Warning  
**Meaning:** More than 5% of requests are returning 5xx errors

#### ✅ Immediate Actions
```bash
# Check recent errors in backend logs
docker logs projecthub-backend --tail 100 | grep -i error

# Check if database is responding
curl http://localhost:9187/metrics | grep pg_up

# Check recent deployments
docker images | grep projecthub-backend
```

#### 🛠️ Resolution Steps
- Identify error patterns in logs  
- If database-related: check database connections  
- If application error: review recent code changes  
- Consider rolling back to previous version if needed  
- Monitor error rate after fixes  

---

## 📣 Escalation Process

### ⏱️ When to Escalate
- Issue cannot be resolved within 15 minutes  
- Multiple critical alerts firing simultaneously  
- Data loss or corruption suspected  
- Security incident detected  

### 📞 Escalation Steps
- Document what you've tried  
- Gather relevant logs and screenshots  
- Contact senior engineer or team lead  
- Continue monitoring the situation  

---

## 📝 Post-Incident Actions

After resolving an incident:

### 📄 Document the Incident
- What happened?  
- When did it start?  
- What was the impact?  
- What was the root cause?  
- How was it resolved?  

### 🔄 Follow-Up
- Update runbooks if new solutions were discovered  
- Review alerts – were they timely and actionable?  
- Implement preventive measures to avoid recurrence  

---

## 🧰 Useful Commands
```bash
# View all service statuses
docker ps

# View logs for all services
cd /opt/app
sudo docker-compose logs -f

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Check active alerts
curl http://localhost:9090/api/v1/alerts

# Restart all services
sudo docker-compose restart

# View resource usage
docker stats --no-stream
```

---

## 📊 Monitoring URLs
- **Grafana Dashboard:** http://YOUR_EC2_IP:3001  
- **Prometheus:** http://YOUR_EC2_IP:9090  
- **Prometheus Targets:** http://YOUR_EC2_IP:9090/targets  
- **Prometheus Alerts:** http://YOUR_EC2_IP:9090/alerts  
- **Backend Health:** http://YOUR_EC2_IP:3000/health  
- **Backend Metrics:** http://YOUR_EC2_IP:3000/metrics  

---

## 📇 Contact Information
- **On-Call Engineer:** [Your contact info]  
- **Team Lead:** [Team lead contact]  
- **Escalation:** [Escalation contact]  
