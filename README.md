# Observability

# 🚀 Intelligent Playwright Observability Platform

## 📌 Overview

This project implements a **production-grade observability and automated response system** for Playwright test automation.

It not only monitors test executions but also **enriches failure data and triggers automated workflows** using n8n.

---

## 🧠 Key Capabilities

* 📊 Real-time test observability (Prometheus + Grafana)
* 📜 Centralized logging (Loki)
* 🚨 Smart alerting (Alertmanager)
* ⚙️ CI/CD integration (Jenkins)
* 🔁 Failure enrichment & automation (n8n)
* 🧩 Run-level traceability using `run_id`

---

## 🏗️ Architecture

Playwright Tests
↓
Metrics → Prometheus → Grafana
↓
Logs → Loki
↓
Alertmanager → n8n → Automated Actions (Email / Webhooks / Job Triggers)

---

## 🔥 What Makes This Unique

* Failure events are **enriched with contextual metadata** (test name, location, error, run_id)
* n8n workflows enable:

  * Intelligent notifications
  * Conditional automation
  * Integration with external systems
* Designed for **scalability (parallel execution ready)**

---

## ⚙️ Tech Stack

* Playwright
* Node.js
* Prometheus
* Grafana
* Loki
* Alertmanager
* Jenkins
* n8n
* Docker

---

## 📊 Metrics

| Metric                           | Description          |
| -------------------------------- | -------------------- |
| playwright_test_total            | Total tests executed |
| playwright_test_success_total    | Successful tests     |
| playwright_test_failure_total    | Failed tests         |
| playwright_test_duration_seconds | Execution latency    |

---

## 📜 Logging (Loki)

Each test pushes structured logs:

```json
{
  "suite": "checkout",
  "test_name": "payment flow",
  "status": "failed",
  "error": "Timeout",
  "location": "India",
  "run_id": "abc123",
  "failure_time": "1713264300"
}
```

---

## 🔁 n8n Data Enrichment Workflow

On test failure:

1. Loki / Alert triggers webhook
2. n8n enriches payload
3. Actions performed:

   * Send detailed alert (email/webhook)
   * Trigger Jenkins retry job
   * Store enriched event

---

## 🚨 Alerting Strategy

* No test execution (last X mins)
* Failure rate spike
* Slow test detection

---

## 🚀 Setup

```bash
cd playwright-observability-platform
npm install
```

Run system:

```bash
docker-compose up
```

Run tests:

```bash
npx playwright test
```

---

## 📈 Dashboards

* Success vs Failure trends
* Execution frequency
* Latency distribution
* Location-based insights

---

## 🔮 Future Enhancements

* AI-based anomaly detection
* Predictive failure analysis
* Auto-healing pipelines
* Slack / Teams integration

---

## 👨‍💻 Author

Anuj Rai
