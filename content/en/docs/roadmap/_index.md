---
title: Roadmap
weight: 1
---

In the near future we plan to launch an interactive roadmap that allows users to suggest ideas, comment on existing ones, and better understand OSS vs platform features. In the meantime, here is a run down of what we're working on, and what on deck.

## In Progress

- Stand up initial Datum Cloud Anycast network on AS33438. [Current RIPE Atlas measurement](https://link.datum.net/ripe-test).
- Mature the GCP "Bring Your Own Cloud" (BYOC) [infrastructure provider](https://link.datum.net/gcp-provider)
- Define requirements for additional BYOC Providers
- Improve Datum Cloud user registration and authorization flow
- UX for creating and managing Organizations & Projects on Datum Cloud
- Baseline documentation improvements

## On Deck

- Account setup:
  - Expose UI for managing projects
  - Expose API for managing organizations
 - Access:
  - Support service accounts for machine-to-machine authentication
  - Manage access to Organizations and Projects through IAM policies
- Telemetry:
  - Platform Telemetry for Workloads
  - Platform Telemetry for Networks
  - Export platform telemetry using OpenTelemetry
  - Hosted version of Grafana available for users
  - Prometheus compatible metrics endpoint
  - Audit logs for all platform operations
- Developer experience:
  - AWS BYOC infrastructure provider
  - Integrated docs, guides, API reference, roadmap and changelog
  - Revised website structure and messaging
