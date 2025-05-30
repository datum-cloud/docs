---
title: Locations
description: Locations are where Datum workloads run. They define the geographical and cloud provider context for your workloads.
---

### Example Location Definition

This is an example of a location that specifies a GCP region (us-central1) and a
city code (DFW for Dallas Fort Worth):

```yaml
apiVersion: compute.datumapis.com/v1alpha
kind: Location
metadata:
  name: my-gcp-us-south1-a
spec:
  locationClassName: datum-managed
  topology:
    topology.datum.net/city-code: DFW
  provider:
    gcp:
      projectId: my-gcp-project
      region: us-south1
      zone: us-south1-a
```

### Location Components

Let's walk through the sample spec and review each of the key components.

* The name of the location.

```yaml
name: my-gcp-us-south1-a
```

* The `locationClassName` field specifies the class of the location. In this
case, it's set to `datum-managed`, indicating that this location is managed by
Datum. Alternately, it can be set to `self-managed` for users who have deployed
their own self-managed Datum control-plane.

```yaml
locationClassName: datum-managed
```

* The `topology` field is used to specify which Datum mangaed network to connect
to. Currently Datum offers the following City locations:

  * `DFW` (Dallas Fort Worth, Texas, USA)
  * `LHR` (Heathrow, London, England)
  * `DLS` (Dalles, Oregon, USA)

```yaml
topology:
  topology.datum.net/city-code: DFW
```

* The `provider` section is where you tell it which cloud provider to use to
deploy your workload. For the GCP cloud provider, you specify the project ID,
region, and zone.

```yaml
provider:
  gcp:
    projectId: my-gcp-project
    region: us-south1
    zone: us-south1-a
```

### Detailed API Specification

For a complete API specification of the Location resource, refer to the
[Detailed Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/locations.md).
