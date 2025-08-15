---
title: Create a Project
description: Create a Project via kubectl
weight: 20
---

## Before you begin

This tutorial assumes you have already
[registered an account]({{< relref "get-started" >}}) and have
[installed and configured the necessary tools]({{< ref "tools.md" >}}) to interact
with Datum.

## Portal Alternative

This tutorial uses a kubectl with manifest driven workflow to create your first project. Alternatively, you can create your first project via the Datum Cloud Portal.

### Confirm your kubeconfig context

Ensure that your kubectl tool is configured to use the correct context to interact
with your organization by running the following command:

```shell
kubectl config current-context
```

The output is similar to:

```shell
datum-organization-pp4zn7tiw5be3beygm2d6mbcfe
```

## Create a project

Write the following project manifest to `intro-project.yaml`.

Note that `generateName` is used here, which will result in a name with the prefix of
`intro-project-` and a random suffix.

```yaml
apiVersion: resourcemanager.miloapis.com/v1alpha1
kind: Project
metadata:
  generateName: intro-project-
spec:
```

Create the project

```shell
kubectl create -f intro-project.yaml
```

The output is similar to:

```shell
project.resourcemanager.miloapis.com/intro-project-zj6wx created
```

Copy the generated project name, in this example it is `intro-project-zj6wx`.

Wait for the project's control plane to become ready, which can take up to two
minutes. Exit the command once the control plane status is `Ready`.

```shell
kubectl get projects -w
```

The output is similar to:

```shell
NAME                   AGE   CONTROL PLANE STATUS
intro-project-zj6wx   2s    APIServerProvisioning
intro-project-zj6wx   22s   ControllerManagerProvisioning
intro-project-zj6wx   43s   NetworkServicesOperatorProvisioning
intro-project-zj6wx   64s   WorkloadOperatorProvisioning
intro-project-zj6wx   106s   InfraProviderGCPProvisioning
intro-project-zj6wx   2m3s   Ready
```

## Add a kubeconfig context for your project

Create a kubeconfig context to access your project's resources by executing
following command, replacing `PROJECT_NAME` with your project's name.

*Note: If you created your project via Datum Cloud Portal, you'll want to copy/paste the same project name into the command below.*

```shell
datumctl auth update-kubeconfig --project PROJECT_NAME
```

Confirm that the project's control plane is accessible:

```shell
kubectl explain locations.spec
```

```shell
GROUP:      networking.datumapis.com
KIND:       Location
VERSION:    v1alpha

FIELD: spec <Object>


DESCRIPTION:
    LocationSpec defines the desired state of Location.

... continued
```

## What's next

- [Create a Datum HTTP Proxy]({{< relref "httpproxy">}})
