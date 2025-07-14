---
title: Glossary of Resources
draft: false
---

There are many resources available in the Datum Cloud API that can be used to manage
your infrastructure. This document provides an overview of the available
resources and how to use them.

## Export Policies

[Detailed Export Policies API Reference](https://github.com/datum-cloud/telemetry-services-operator/blob/main/docs/api/exportpolicies.md)

{{< tabpane heade"Sample Export Policy">}}
{{% tab header="Grafana Cloud Example" text=true %}}

```yaml
apiVersion: v1
items:
- apiVersion: telemetry.datumapis.com/v1alpha1
  kind: ExportPolicy
  metadata:
    name: exportpolicy
  spec:
    sinks:
    - name: grafana-cloud-metrics
      sources:
      - telemetry-metrics
      - gateway-metrics
      target:
        prometheusRemoteWrite:
          authentication:
            basicAuth:
              secretRef:
                name: grafana-cloud-credentials
          batch:
            maxSize: 500
            timeout: 5s
          endpoint: https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push
          retry:
            backoffDuration: 2s
            maxAttempts: 3
    sources:
    - metrics:
        metricsql: |
          {service_name="telemetry.datumapis.com"}
      name: telemetry-metrics
    - metrics:
        metricsql: |
          {service_name="gateway.networking.k8s.io"}
      name: gateway-metrics
kind: List
metadata: {}
```

{{% /tab %}}
{{% tab header="Detailed Example With Comments" text=true %}}

```yaml
apiVersion: telemetry.datumapis.com/v1alpha1
kind: ExportPolicy
metadata:
  name: exportpolicy-sample
spec:

# Defines the telemetry sources that should be exported. An export policy can
# define multiple telemetry sources. Telemetry data will **not** be de-duped if
# its selected from multiple sources

  sources:
    - name: "telemetry-metrics"  # Descriptive name for the source
      # Source metrics from the Datum Cloud platform
      metrics:
        # The options in this section are expected to be mutually exclusive. Users
        # can either leverage metricsql or resource selectors.
        #
        # This option allows user to supply a metricsql query if they're already
        # familiar with using metricsql queries to select metric data from
        # Victoria Metrics.
        metricsql: |
          {service_name="telemetry.datumapis.com"}
  sinks:
    - name: grafana-cloud-metrics
      sources:
        - telemetry-metrics
      target:
        prometheusRemoteWrite:
          endpoint: "https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push"
          authentication:
            basicAuth:
              secretRef:
                name: "grafana-cloud-credentials"
          batch:
            timeout: 5s     # Batch timeout before sending telemetry
            maxSize: 500    # Maximum number of telemetry entries per batch
          retry:
            maxAttempts: 3  # Maximum retry attempts
            backoffDuration: 2s     # Delay between retry attempts
```

{{% /tab %}}
{{< /tabpane >}}

## Instances

[Detailed Instances API Reference](https://github.com/datum-cloud/workload-operator/blob/main/docs/api/instances.md)

Instances are what a workload creates.

Let's say you create a workload to run a container and set the location to
a GCP region. Datum's workload operator will create a GCP virtual machine in
that region and run the container on it. The GCP virtual machine is the instance.

## Locations

A **Location** represents a place where your network resources can be deployed and managed. Think of it as a "deployment zone" that tells the system where to put your networks, subnets, and other networking components.

A Location defines:
- **Where** your network resources will be deployed (like a specific city or data center)
- **How** they will be managed (either by Datum or by you)
- **Which cloud provider** will host them (currently Google Cloud Platform)

### Why Locations Matter

Locations help you:
- **Organize** your network resources by geography or business unit
- **Control** where your data and applications are deployed
- **Scale** your infrastructure across multiple regions or zones
- **Comply** with data residency and regulatory requirements

[Detailed Locations API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/locations.md)


{{< tabpane heade"Sample Locations">}}
{{% tab header="GCP" text=true %}}

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: Location
metadata:
 name: gcp-us-west1-a
spec:
  locationClassName: datum-managed
  topology:
    topology.datum.net/city-code: DLS
  provider:
    gcp:
      projectId: datum-cloud-poc-1
      region: us-west1
      zone: us-west1-a
```

{{% /tab %}}
{{< /tabpane >}}

## Networks

A **Network** is the foundation of your cloud infrastructure - think of it as a digital highway system that connects all your applications and services together. It provides the communication backbone that allows your workloads to talk to each other and the outside world.

## What is a Network?

A Network defines:
- **How IP addresses are managed** (automatically or through policies)
- **Which IP protocols are supported** (IPv4, IPv6, or both)
- **Network performance settings** (like maximum packet size)
- **The overall network architecture** for your applications


[Detailed Networks API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networks.md)

{{< tabpane heade"Sample Network">}}
{{% tab header="Simple Network" text=true %}}

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: Network
metadata:
  name: default
spec:
  ipam:
    mode: Auto
```

{{% /tab %}}
{{% tab header="Custom IP Ranges" text=true %}}

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: Network
metadata:
  name: default
spec:
  ipam:
    mode: Auto
    ipv4Ranges:
      - 172.17.0.0/16
    ipv6Ranges:
      - fd20:1234:5678::/48

```

{{% /tab %}}

{{< /tabpane >}}

## Network Bindings

A **Network Binding** is like a bridge that connects your network to a specific location. Think of it as the "deployment instruction" that tells the system: "Take this network and make it available in this particular location." It's the link between your network design and where it actually gets deployed.

A Network Binding defines:
- **Which network** to deploy (the network you want to use)
- **Where to deploy it** (the specific location where it should be available)
- **How it's connected** to other resources in that location

[Detailed Network Bindings API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkbindings.md)

## Network Contexts

A **Network Context** is like a "configuration profile" for your network in a specific location. Think of it as the "settings and metadata" that tells the system how to manage and operate your network in that particular place. It's the bridge between your network design and the actual implementation in each location.

A Network Context defines:
- **Which network** it's managing (the network that's deployed)
- **Where it's deployed** (the specific location)
- **How it's configured** for that location
- **Status and health** information

[Detailed Network Contexts API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkcontexts.md)

## Network Policies

A **Network Policy** is like a security guard that controls who can talk to whom on your network. Think of it as a set of rules that says "this traffic is allowed" or "that traffic is blocked." It's your way of creating security boundaries and controlling communication between different parts of your infrastructure.

A Network Policy defines:
- **Which traffic is allowed** to reach your applications and services
- **Which sources can connect** (specific IP addresses or ranges)
- **Which ports and protocols** are permitted
- **Security boundaries** between different parts of your network

[Detailed Network Policies API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkpolicies.md)

## Projects

[Detailed Projects API Reference](https://github.com/datum-cloud/datum/blob/milo-apiserver/docs/api/resourcemanager.datumapis.com_projects.yaml.md)
{{< tabpane>}}
{{% tab header="Sample Project" text=true %}}

```apiVersion: resourcemanager.datumapis.com/v1alpha
kind: Project
metadata:
  generateName: sample-project-
spec:
```

{{% /tab %}}
{{< /tabpane >}}

## Subnets

A **Subnet** is like a "neighborhood" within your network - a specific range of IP addresses that are grouped together for a particular purpose. Think of it as a section of your network where related applications or services live together. It's the actual implementation of the address space that was requested through a Subnet Claim.

A Subnet defines:
- **A specific range of IP addresses** (the start address and size)
- **Where it's located** (the location and network context)
- **What it's used for** (the subnet class)
- **Which IP protocol** it supports (IPv4 or IPv6)

[Detailed Subnets API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/subnets.md)

## Subnet Claims

A **Subnet Claim** is like a "reservation request" for a piece of your network. Think of it as asking the system: "I need some IP addresses for my application in this specific location." It's how you request and reserve a portion of your network's IP address space for your workloads.

A Subnet Claim defines:
- **What type of subnet** you need (the subnet class)
- **Where you need it** (the location and network context)
- **How much space** you need (IP family and prefix length)
- **Optional specifications** (specific start address if needed)

[Detailed Subnet Claims API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/subnetclaims.md)

## Workload

[Detailed Workload API Reference](https://github.com/datum-cloud/workload-operator/blob/main/docs/api/workloads.md)
{{< tabpane heade"Sample Workload">}}
{{% tab header="Container Sample" text=true %}}

```yaml
apiVersion: compute.datumapis.com/v1alpha
kind: Workload
metadata:
  labels:
    tier: app
  name: workload-sandbox-sample
spec:
  template:
    metadata:
      labels:
        tier: app
    spec:
      runtime:
        resources:
          instanceType: datumcloud/d1-standard-2
        sandbox:
          containers:
            - name: netdata
              image: docker.io/netdata/netdata:latest
              volumeAttachments:
                - name: secret
                  mountPath: /secret
                - name: configmap
                  mountPath: /configmap
      networkInterfaces:
      - network:
          name: default
        networkPolicy:
          ingress:
            - ports:
              - port: 19999
              - port: 22
              from:
                - ipBlock:
                    cidr: 0.0.0.0/0
      volumes:
      - name: secret
        secret:
          secretName: workload-sandbox-sample-secret
      - name: configmap
        configMap:
          name: workload-sandbox-sample-configmap
  placements:
  - name: us
    cityCodes:
    - DFW
    scaleSettings:
      minReplicas: 1
```

{{% /tab %}}
{{% tab header="Container with Multiple Placements" text=true %}}

```yaml
apiVersion: compute.datumapis.com/v1alpha
kind: Workload
metadata:
  labels:
    tier: app
  name: workload-sample
spec:
  template:
    metadata:
      labels:
        tier: app
    spec:
      runtime:
        resources:
          instanceType: datumcloud/d1-standard-2
        sandbox:
          containers:
            - name: netdata
              image: docker.io/netdata/netdata:latest
      networkInterfaces:
      - network:
          name: default
        networkPolicy:
          ingress:
            - ports:
              - port: 19999
              from:
                - ipBlock:
                    cidr: 0.0.0.0/0
  placements:
  - name: us-south
    cityCodes:
    - DFW
    scaleSettings:
      minReplicas: 1
  - name: us-south2
    cityCodes:
    - DFW
    scaleSettings:
      minReplicas: 1
```

{{% /tab %}}
{{% tab header="VM Sample" text=true %}}

```yaml
apiVersion: compute.datumapis.com/v1alpha
kind: Workload
metadata:
  labels:
    tier: app
  name: workload-vm-sample
spec:
  template:
    metadata:
      annotations:
        compute.datumapis.com/ssh-keys: |
          myuser:ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAqyjfr0gTk1lxqA/eEac0djYWuw+ZLFphPHmfWwxbO5 joshlreese@gmail.com
      labels:
        tier: app
    spec:
      runtime:
        resources:
          instanceType: datumcloud/d1-standard-2
        virtualMachine:
          volumeAttachments:
          - name: boot
          - name: secret
            mountPath: /secret
          - name: configmap
            mountPath: /configmap
      networkInterfaces:
      - network:
          name: default
        networkPolicy:
          ingress:
            - ports:
              - port: 22
              from:
                - ipBlock:
                    cidr: 0.0.0.0/0
      volumes:
      - name: boot
        disk:
          template:
            spec:
              type: pd-standard
              populator:
                image:
                  name: datumcloud/ubuntu-2204-lts
      - name: secret
        secret:
          secretName: workload-vm-sample-secret
      - name: configmap
        configMap:
          name: workload-vm-sample-configmap
  placements:
  - name: us-south
    cityCodes:
    - DFW
    scaleSettings:
      minReplicas: 1
```

{{% /tab %}}
{{< /tabpane >}}

## Workload Deployments

[Detailed Workload Deployments API Reference](https://github.com/datum-cloud/workload-operator/blob/main/docs/api/workloaddeployments.md)
