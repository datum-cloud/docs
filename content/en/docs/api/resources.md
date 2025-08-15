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

[Detailed Network Bindings API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkbindings.md)

## Network Contexts

[Detailed Network Contexts API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkcontexts.md)

## Network Policies

[Detailed Network Policies API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkpolicies.md)

## Projects

[Detailed Projects API Reference](https://github.com/datum-cloud/milo/blob/main/docs/api/resourcemanager.md)
{{< tabpane>}}
{{% tab header="Sample Project" text=true %}}

```apiVersion: resourcemanager.miloapis.com/v1alpha1
kind: Project
metadata:
  generateName: sample-project-
spec:
```

{{% /tab %}}
{{< /tabpane >}}

## Subnet Claims

[Detailed Subnet Claims API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/subnetclaims.md)

## Subnets

[Detailed Subnets API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/subnets.md)

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
