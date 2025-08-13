---
title: Roadmap
weight: 2
---

In the near future we plan to launch an interactive roadmap that allows users to
suggest ideas, comment on existing ones, and better understand OSS vs platform
features. In the meantime, here is a run down of what we're working on, and
what's on deck.

## Recently Completed

- Integration of HickoryDNS (a Rust-based DNS server) as an diverse service daemon to KnotDNS
- Simplify `datumctl` authentication workflows with a `datumctl auth login` experience
- Audit logs available for all API operations for users, organizations, and projects
- Introduced a simple [HTTP Proxy resource for defining a reverse proxy](../tutorials/httpproxy/)
- Easily [ship telemetry to Grafana cloud](../tutorials/grafana/) w/ prebuild dashboards for HTTP Proxy
  resources.

## In Progress

- Create standard organizations and invite your team members
- Implementation of `datumctl serve` - a reverse tunneling reverse proxy service
- Provide a HTTP Proxy telemetry dashboard in the cloud portal
- Define and refine Galactic VPC Networks
  - Proof of Concepts built around Segment Routing SRv6
  - Land traffic into a Galactic VPC from anywhere

## On Deck

- Support machine accounts for machine-to-machine authentication
- Definition of `datumctl connect` - a secure client to pair with `datumctl serve`
- Authoritative DNS platform
