---
title: Networks
description: Networks are essential for deploying workloads in Datum. They define how workloads communicate.
---

### Networks Overview

When deploying workloads in Datum, networks are used to define the IP Address
Management of the workloads.

### Getting Started with Networks

Most workloads can use the default network configuration shown below. This
configuration leverages Datum's built-in IP Address Management (IPAM) to
automatically handle IP address assignment.

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: Network
metadata:
  name: default
spec:
  ipam:
    mode: Auto
```

### IP Address Management (IPAM)

Datum's automatic IPAM mode simplifies network management by eliminating
the need to manually configure IP addresses for each workload.

**Default Auto Configuration:**

```yaml
spec:
  ipam:
    mode: Auto
```

In Auto mode, Datum uses the following default IP address ranges:

- **IPv4 Ranges**: `10.128.0.0/9`
- **IPv6 Ranges**: A /48 allocated from `fd20::/20`

### Customizing IP Address Ranges

You can override the default IP ranges by specifying custom ranges in your
network manifest.

```yaml
spec:
  ipam:
    mode: Auto
    ipv4Ranges:
      - 172.17.0.0/16
    ipv6Ranges:
      - fd20:1234:5678::/48
```

### Detailed API Specification

For a complete API specification of the Location resource, refer to the
[Detailed Reference](https://github.com/datum-cloud/network-services-operator/blob/main/docs/api/networks.md).
