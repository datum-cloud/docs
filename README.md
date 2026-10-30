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

When a reader is signed in to Datum Cloud, the docs will swap these tokens for the reader's own values, so a copied command runs as is. Until then the tokens show as written. Use exactly these tokens in examples, and nothing else, for these values:

| Token             | Becomes                                   | Use it for                                                             |
| ----------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `your-org-id`     | The reader's org, e.g. `personal-org-2650fdb4` | `--organization`, the org half of `datumctl ctx use ORG/PROJECT`       |
| `your-project-id` | The reader's project, e.g. `my-api`       | `--project`, `PROJECT=` variables, project paths in API URLs, sample output that echoes the project |
| `your-email`      | The reader's sign-in email                | Commands that take the reader's own account, e.g. `datumctl auth switch` |
| `default`         | Stays `default` (not replaced)            | `--namespace`, `NAMESPACE=`. It is the only namespace Datum supports   |

For example:

```bash
datumctl ctx use your-org-id/your-project-id
datumctl get dnszones --project your-project-id

PROJECT="your-project-id"
NAMESPACE="default"
```

Rules:

- Write the token exactly, in lowercase. Variants such as `my-project`, `my-project-id`, `<project-id>`, `PROJECT_ID`, `<org-id>` or `ORG_ID` are not replaced.
- Don't wrap a token in `<…>`. Shiki reads `<` as a shell redirect and splits the token across several spans, so it can't be replaced.
- Replace values only, never variable references: `PROJECT="your-project-id"` uses the token, `--project $PROJECT` stays.
- Use `your-email` only for the reader's own account. Someone else's identity (an audit filter, an allowed-users list) keeps an example address like `alice@example.com`.
- Other placeholders (`ALB_NAME`, `INSTANCE_NAME`, `my-zone`, `example.com`) are fine. They are never replaced, so readers still swap them by hand.
- Prose that explains flag syntax, like ``--project <project>``, can keep the angle brackets. It isn't a value to copy.

TODO: MetricsQL queries in the observability pages (`alb/`, `compute/`, `connectors/`, `domain-dns/`, `galactic-vpc/`) still use `PROJECT_ID`, next to other uppercase placeholders like `ALB_NAME` and `INSTANCE_NAME`. Decide whether to switch them to `your-project-id` so they are personalized too.

## Contributing

1. Fork the repo and create a branch
2. Edit or add `.mdx` files
3. Preview locally with `mintlify dev`
4. Open a pull request against `main`

For content questions or suggestions, open a [GitHub Discussion](https://github.com/orgs/datum-cloud/discussions/categories/feature-requests).
