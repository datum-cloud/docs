# Datum Cloud Documentation

This repository contains the assets required to build the [Datum Documentation Website](https://docs.datum.net).

## Running the website

### Use hugo directly

Building and running the site locally requires a recent `extended` version of
[Hugo](https://gohugo.io). You can find out more about how to install Hugo for
your environment in the Docsy [Getting started](https://www.docsy.dev/docs/getting-started/#prerequisites-and-installation)
guide.

Once you've made your working copy of the site repo, from the repo root folder,
run:

```bash
hugo server
```

### Run hugo in a container

You can run the docs site inside a [Docker](https://docs.docker.com/)
container, the container runs with a volume bound to the `docs`
folder. This approach doesn't require you to install any dependencies other
than [Docker Desktop](https://www.docker.com/products/docker-desktop) on
Windows and Mac, and [Docker Compose](https://docs.docker.com/compose/install/)
on Linux.

1. Build the docker image

   ```bash
   docker-compose build
   ```

2. Run the built image

   ```bash
   docker-compose up
   ```

   > NOTE: You can run both commands at once with `docker-compose up --build`.

3. Verify that the service is working.

   Open your web browser and type `http://localhost:1313` in your navigation bar,
   This opens a local instance of the docs homepage. You can now make
   changes to the documentation and those changes will immediately show up in your
   browser after you save.

### Cleanup

To stop Docker Compose, on your terminal window, press **Ctrl + C**.

To remove the produced images run:

```bash
docker-compose rm
```

For more information see the [Docker Compose documentation][].

## Troubleshooting

As you run the website locally, you may run into the following error:

```console
$ hugo server
WARN 2023/06/27 16:59:06 Module "project" is not compatible with this Hugo version; run "hugo mod graph" for more information.
Start building sites …
hugo v0.101.0-466fa43c16709b4483689930a4f9ac8add5c9f66+extended windows/amd64 BuildDate=2022-06-16T07:09:16Z VendorInfo=gohugoio
Error: Error building site: "C:\Users\foo\path\to\docsy-example\content\en\_index.md:5:1": failed to extract shortcode: template for shortcode "blocks/cover" not found
Built in 27 ms
```

This error occurs if you are running an outdated version of Hugo. As of docsy
theme version `v0.7.0`, hugo version `0.110.0` or higher is required. See this
[section](https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-hugo)
of the user guide for instructions on how to install Hugo.

Or you may be confronted with the following error:

```console
$ hugo server

INFO 2021/01/21 21:07:55 Using config file:
Building sites … INFO 2021/01/21 21:07:55 syncing static files to /
Built in 288 ms
Error: Error building site: TOCSS: failed to transform "scss/main.scss" (text/x-scss): resource "scss/scss/main.scss_9fadf33d895a46083cdd64396b57ef68" not found in file cache
```

This error occurs if you have not installed the extended version of Hugo. See
this
[section](https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-hugo)
of the user guide for instructions on how to install Hugo.

Or you may encounter the following error:

```console
$ hugo server

Error: failed to download modules: binary with name "go" not found
```

This error occurs if the `go` programming language is not available on your
system. See this
[section](https://www.docsy.dev/docs/get-started/docsy-as-module/installation-prerequisites/#install-go-language)
of the user guide for instructions on how to install `go`.

[Docker Compose documentation]: https://docs.docker.com/compose/gettingstarted/
