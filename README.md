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
├── changelog.mdx       # Release notes, curated from GitHub changelog discussions
├── get-involved.mdx    # Community and contributing
├── locations.mdx       # Regions and availability zones
├── desktop-apps.mdx    # Desktop Apps tab
├── getting-started/    # Account setup, first workload
├── account/            # Sign up, sign in, passkeys, account recovery
├── organizations/      # Organizations, team management, usage
├── projects/           # Projects and service accounts
├── platform/           # Architecture, Kubernetes, roadmap, and other platform topics
├── galactic-vpc/       # gVPC (networks/ holds the Networks section, including network services)
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

## Placeholders

Examples use one token per value, so the docs can fill in a signed-in user's own values:

| Value     | Token             |
| --------- | ----------------- |
| Org       | `your-org-id`     |
| Project   | `your-project-id` |
| Namespace | `default`         |
| Email     | `your-email`      |

Use a plain hyphenated token, not `<project-id>`: Shiki splits `<…>` into several spans, and the token can't be replaced. Replace values only, never variable references: `PROJECT="your-project-id"` uses the token, `--project $PROJECT` stays.

TODO: MetricsQL queries in the observability pages (`alb/`, `compute/`, `connectors/`, `domain-dns/`, `galactic-vpc/`) still use `PROJECT_ID`, next to other uppercase placeholders like `ALB_NAME` and `INSTANCE_NAME`. Decide whether to switch them to `your-project-id` so they are personalized too.

## Contributing

1. Fork the repo and create a branch
2. Edit or add `.mdx` files
3. Preview locally with `mintlify dev`
4. Open a pull request against `main`

For content questions or suggestions, open a [GitHub Discussion](https://github.com/orgs/datum-cloud/discussions/categories/feature-requests).
