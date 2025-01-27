---
title: Roadmap
weight: 1
---

In the near future we plan to launch an interactive roadmap that allows users to suggest ideas, comment on existing ones, and better understand OSS vs platform features. In the meantime, here is a run down of what we're working on, and what on deck.

## In Progress

- Stand up initial Datum Cloud Anycast network
- Mature the GCP "Bring Your Own Cloud" (BYOC) infrastructure provider
- Define requirements for additional BYOC Providers
- Improve Datum Cloud user registration and authorization flow
- UX for creating and managing Organizations & Projects on Datum Cloud
- Initial documentation improvements

## On Deck

- Account setup:
  - Expose UI for managing projects
  - Expose API for managing organizations
  - Audit logs for all platform operations
- Access:
  - Support service accounts for machine-to-machine authorization
  - Manage IAM access to Organizations and Projects
  - Create API to manage service accounts and keys
  - Create UI for managing service accounts and service account keys
  - Create APIs for managing IAM policies for projects and organizations
  - Create UI for managing Organization and Project level IAM policies
- Telemetry:
  - Export platform telemetry using OpenTelemetry
  - Hosted version of Grafana available for users
  - Platform Telemetry for Workloads
  - Platform Telemetry for Networks
  - Hosted version of Grafana available for users
  - Prometheus compatible metrics endpoint
- Developer experience:
  - AWS BYOC infrastructure provider
  - Integrated docs, guides, API reference, roadmap and changelog
  - Revised website structure
