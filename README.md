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
├── docs.json           # Mintlify configuration (navigation, theme, etc.)
├── index.mdx           # Root landing page
├── overview.mdx        # What is Datum
├── features.mdx        # Current capabilities and roadmap
├── kubernetes.mdx      # Kubernetes-native approach
├── get-involved.mdx    # Community and contributing
├── platform/           # Platform setup, secrets, metrics, locations
├── ai-edge/            # AI Edge proxy docs
├── connectors/         # Connectors and tunnels
├── galactic-vpc/       # Galactic VPC docs
├── domain-dns/         # Domains and DNS
├── datumctl/           # datumctl CLI guides
├── cli/                # datumctl command reference
├── guides/             # How-to guides
└── images/             # Static assets
```

## Contributing

1. Fork the repo and create a branch
2. Edit or add `.mdx` files
3. Preview locally with `mintlify dev`
4. Open a pull request against `main`

For content questions or suggestions, open a [GitHub Discussion](https://github.com/orgs/datum-cloud/discussions/categories/feature-requests).
