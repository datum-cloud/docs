---
title: Glossary of Resources
draft: false
---

There are many resources available in the Datum Cloud API that can be used to manage
your infrastructure. This document provides an overview of the available
resources and how to use them.

## Export Policies

[Detailed Export Policies API Reference](https://github.com/datum-cloud/telemetry-services-operator/blob/main/docs/api/exportpolicies.md)

[Sample Export Policy](https://github.com/datum-cloud/telemetry-services-operator/blob/main/config/samples/telemetry_v1alpha1_exportpolicy.yaml)

{{< tabpane heade"Sample Export Policy">}}
{{% tab header="Simple Example" text=true %}}

```yaml
apiVersion: telemetry.datum.net/v1alpha1
kind: ExportPolicy
metadata:
  name: my-export-policy
spec:

  exportPolicyClassName: datum-managed
  topology:
    topology.datum.net/city-code: DFW
  provider:
    gcp:
      projectId: GCP_PROJECT_ID
      region: us-south1
      zone: us-south1-a
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

## Networks

[Detailed Networks API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networks.md)

## Network Bindings

[Detailed Network Bindings API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkbindings.md)

## Network Contexts

[Detailed Network Contexts API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkcontexts.md)

## Network Policies

[Detailed Network Policies API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networkpolicies.md)

## Projects

[Detailed Projects API Reference](https://github.com/datum-cloud/datum/blob/milo-apiserver/docs/api/resourcemanager.datumapis.com_projects.yaml.md)

## Subnet Claims

[Detailed Subnet Claims API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/subnetclaims.md)

## Subnets

[Detailed Subnets API Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/subnets.md)

## Workload

[Detailed Workload API Reference](https://github.com/datum-cloud/workload-operator/blob/main/docs/api/workloads.md)

## Workload Deployments

[Detailed Workload Deployments API Reference](https://github.com/datum-cloud/workload-operator/blob/main/docs/api/workloaddeployments.md)
