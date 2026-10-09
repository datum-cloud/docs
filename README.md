# Datum Cloud Docs

Documentation for [Datum Cloud](https://www.datum.net), built with [Mintlify](https://mintlify.com).

## Live Site

[datum.net/docs](https://www.datum.net/docs)

## Development

Install the Mintlify CLI:

```bash
npm install -g mintlify
```

Run a local preview from the repo root:

```bash
mintlify dev
```

## Structure

```
├── docs.json           # Mintlify configuration (navigation, redirects, theme)
├── index.mdx           # Landing page (Introduction > Overview)
├── quickstart.mdx      # Quick Start (ALB + Compute)
├── get-involved.mdx    # Community and contributing
├── locations.mdx       # Regions and availability zones
├── desktop-apps.mdx    # Desktop Apps tab
├── getting-started/    # Account setup, service accounts
├── platform/           # Architecture, Kubernetes, roadmap, and other platform topics
├── galactic-vpc/       # Galactic VPC (networks/ holds the Networks section)
├── compute/            # Compute (runtimes/ holds the Runtimes section)
├── alb/                # Application Load Balancer (httpproxy/, configuration/)
├── connectors/         # Connectors and tunnels
├── domain-dns/         # Domains and DNS
├── operations/         # Metrics export, activity logs, secrets, suspension, assistant
├── agents/             # Agent skills, Datum MCP, llms.txt
├── guides/             # Guides tab, grouped by product
├── datumctl/           # datumctl (CLI) tab
└── images/             # Static assets
```

Each product section follows the same layout where it applies: Overview, product-specific pages, Configuration, Operations, Observability, Troubleshooting, Limits and quotas, and Limitations and roadmap. When you move a page, add a redirect for its old path in `docs.json`.

## Contributing

1. Fork the repo and create a branch
2. Edit or add `.mdx` files
3. Preview locally with `mintlify dev`
4. Open a pull request against `main`

For content questions or suggestions, open a [GitHub Discussion](https://github.com/orgs/datum-cloud/discussions/categories/feature-requests).
