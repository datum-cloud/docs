---
title: Set Up Datum Tools
description: Set up tools to work with Datum.
weight: 2
no_list: true
---

The Datum control plane is a collection of multiple projects developed with
Kubernetes control plane technology, most of which can be installed into native
Kubernetes clusters.

As a result, you will leverage common Kubernetes tooling such as [kubectl][kubectl]
to interact with Datum.

## Install Tools

### datumctl

{{< tabpane text=true left=true >}}
  {{% tab header="**Method**:" disabled=true /%}}
  {{% tab header="Brew" lang="en" %}}

Install datumctl with the [Homebrew](https://brew.sh/) package manager on macOS or Linux:

  ```shell
  brew install datum-cloud/tap/datumctl
  ```

  {{% /tab %}}
  {{% tab header="Curl" lang="en" %}}
Install manually with curl on Linux or macOS

```shell
export OS=$(uname -s)
export ARCH=$(uname -m)

curl -Lo ./datumctl.tar.gz https://github.com/datum-cloud/datumctl/releases/latest/download/datumctl_${OS}_${ARCH}.tar.gz

# Extract and install the datumctl binary
tar zxvf datumctl.tar.gz datumctl
chmod +x datumctl
mkdir -p ~/.local/bin
mv ./datumctl ~/.local/bin/datumctl
# and then append (or prepend) ~/.local/bin to $PATH
```

  {{% /tab %}}
  {{% tab header="Go" lang="en" %}}

Install via Go

```shell
go install go.datum.net/datumctl@latest
# Ensure that $GOPATH/bin is in your PATH
export PATH=$PATH:$(go env GOPATH)/bin
  ```

  {{% /tab %}}
  {{% tab header="Windows Powershell" lang="en" %}}

Install datumctl on Windows using PowerShell

  ```powershell
  Invoke-WebRequest -Uri "https://github.com/datum-cloud/datumctl/releases/latest/download/datumctl_Windows_x86_64.zip"  -OutFile "datumctl.zip"
  Expand-Archive -Path "datumctl.zip" -DestinationPath "datumctl"
  ```

  Move the `datumctl.exe` file to a directory in your `PATH` or simply run it from the current directory:

  ```powershell
  .\datumctl\datumctl.exe
  ```

  {{% /tab %}}
{{< /tabpane >}}

### kubectl

Refer to the [official Kubernetes documentation][kubectl-task] for installation
instructions, making sure to **skip the Verify kubectl configuration** section in
the guide you choose.

Later in this guide, you will configure a [kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
as required to interact with Datum via kubectl.

[kubectl]: https://kubernetes.io/docs/reference/kubectl/kubectl/
[kubectl-task]: https://kubernetes.io/docs/tasks/tools/#kubectl

For convenience, homebrew instructions are below:

{{< tabpane text=true left=true >}}
  {{% tab header="**Method**:" disabled=true /%}}
  {{% tab header="Brew" lang="en" %}}

Install kubectl with the [Homebrew](https://brew.sh/) package manager on macOS or Linux:

  ```shell
  brew install kubectl
  ```

  {{% /tab %}}
{{< /tabpane >}}

## Create API Credentials

1. Sign in to Datum at <https://cloud.datum.net>
2. Create an API token by clicking on your User Initials / Avatar (top right)
   and then navigating to **API Keys > New API Key**. Save this API Key in
   your password manager or preferred method of storage.

## Configure Tools

### Authentication

Configure datumctl authentication by activating the API token created in the
previous section. Run the following command and enter your API token at the
prompt:

```shell
datumctl auth activate-api-token
```

### Add a kubeconfig context for your organization

Obtain your organization's resource ID with datumctl by listing organizations
that your user has access to:

```shell
datumctl organizations list
```

The output is similar to:

```shell
DISPLAY NAME           RESOURCE ID
Personal Organization  pp4zn7tiw5be3beygm2d6mbcfe
```

Create a kubeconfig context to access your organization's resources by copying
the the `RESOURCE ID` value and executing following command, replacing
`RESOURCE_ID` with the value:

```shell
datumctl auth update-kubeconfig --organization RESOURCE_ID
```

The output is similar to:

```shell
Successfully updated kubeconfig at getting-started.kubeconfig
```

### Verify kubectl configuration

Check that kubectl is properly configured by getting authorized user info:

```shell
kubectl auth whoami
```

The output is similar to:

```shell
ATTRIBUTE                                                VALUE
Username                                                 datum@example.com
Groups                                                   [system:authenticated]
Extra: authentication.datum.net/datum-organization-uid   [pp4zn7tiw5be3beygm2d6mbcfe]
Extra: authentication.kubernetes.io/credential-id        [JTI=01jgsr1m8fpb9cn0yrh05taa5v]
```

## What's next

- [Create a Project]({{< relref "create-project">}})
