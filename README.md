# Datum Cloud Documentation Site

This is the documentation site for Datum Cloud. It is built with Scalar and
currently hosted [here](https://datum-docs.apidocumentation.com/). For more
information, see the [Scalar Documentation](https://guides.scalar.com/scalar/scalar-docs/getting-started).

## Making changes

### Local development

The structure, theme and deployment options for the docs site are handled inside
the `scalar.config.json` file. A complete list of the available options can be
found [here](https://github.com/scalar/scalar/blob/main/documentation/configuration.md).

Please note that guides and references are the two types of "pages" that are
available on the site and they will appear as tabs in the header. References can
point to local files or remote URLs and are best used for API references, while
guides are used for more free-form content.

To edit the content of the guides, please create/edit markdown files inside this
repo. Just note that to actually see these changes you will need to add a
subpage/navigation item to the relevant guide's sidebar on the docs site, like
so:

```json
  "sidebar": [
    {
      "path": "handbook/welcome.md",
      "type": "page"
    }
  ]
```

To add a reference tab, you need to add an entry to the `references` array in
the `scalar.config.json` file in a similar way, but the path needs to point to a
valid OpenAPI file.

```json
  "references": [
    {
        "name": "API Reference",
        "path": "api/sample-openapi.yaml"
    }
  ]
```

**NOTE:** Only `.yaml` files seems to work here.

#### Sidenote: the Scalar CLI

The Scalar CLI is a community managed project that has some useful commands for
working with Scalar. To install it, run:

```bash
npm -g install @scalar/cli
```

##### Commands

```bash
  init [options]                        Create a new `scalar.config.json` file to configure where your OpenAPI file is placed.
  format [options] [file|url]           Format an OpenAPI file
  validate [file|url]                   Validate an OpenAPI file
  bundle [options] [file]               Resolve all references in an OpenAPI file
  serve|reference [options] [file|url]  Serve an API Reference from an OpenAPI file
  mock [options] [file|url]             Mock an API from an OpenAPI file
  void [options]                        Boot a server to mirror HTTP requests
  share [options] [file]                Share an OpenAPI file
  check [file]                          Check a Scalar Configuration file
  help [command]                        display help for command
```

## Deploying/Publishing changes

This project is currently linked directly to Scalar and will be deployed automatically when changes are pushed to the `main` branch.

## Road to enhancement

At the time of writing, Scalar appears to serve all the requirements for this project. However, in the event that this needs to become part of a larger documentation effort, the roadmap would be as follows:

1. Create a new NextJS app within this repo.
2. Move the Scalar config into a separate directory.
3. Embed the Scalar docs in a route of the NextJS app, such that the Scalar docs are accessible at a route like `/docs`.
