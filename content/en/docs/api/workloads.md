---
title: Workloads
description: Datum lets you deploy and manage workloads. Today, these workloads can be either virtual machines or containers. They're defined like any other Kubernetes custom resource, usually in YAML.
---

### Workloads Overview

Datum lets you deploy and manage workloads. Today, these workloads can be either virtual machines or containers. They're defined like any other Kubernetes custom resource, usually in YAML.

### Example Container Workload

This is an example of a workload that runs an nginx container and places it first location you have defined in your Datum project that is associated with `DFW` (Dallas Fort Worth).

```yaml
apiVersion: compute.datumapis.com/v1alpha
kind: Workload
metadata:
  name: nginx-workload
spec:
  template:
    spec:
      runtime:
        resources:
          instanceType: datumcloud/d1-standard-2
        sandbox:
          containers:
            - name: nginx
              image: nginx:latest
              ports:
                - name: http
                  port: 8080
      networkInterfaces:
        - network:
            name: default
          networkPolicy:
            ingress:
              - ports:
                - port: 8080
                from:
                  - ipBlock:
                      cidr: 0.0.0.0/0
  placements:
    - name: us
      cityCodes: ['DFW']
      scaleSettings:
        minReplicas: 1
```

### Workload Components

Let's walk through the sample spec and review each of the key components.

* The name of the workload.

  ```yaml
  name: nginx-workload
  ```

* The runtime environment for the workload. Datum currently supports Virtual Machines or containers as runtime environments, our sample uses a container runtime.

  ```yaml
  runtime:
    sandbox:
      containers:
        - name: nginx
          image: nginx/nginx
          ports:
            - name: http
              port: 8080
  ```

* The type of instance to use for the workload, currently `datumcloud/d1-standard-2` is the only supported type.

  ```yaml
  instanceType: datumcloud/d1-standard-2
  ```

* The network to connect the workload to, which ports should to expose, and what IPs to allow access from.

  ```yaml
  networkInterfaces:
  - network:
      name: default
    networkPolicy:
      ingress:
        - ports:
          - port: 8080
          from:
            - ipBlock:
                cidr: 0.0.0.0/0
  ```

* The placement of the workload, which defines where the workload should run. In this case, it will run in the first location in your project associated with `DFW` (Dallas Fort Worth).

```yaml  
placements:
  - name: us
    cityCodes: ['DFW']
    scaleSettings:
      minReplicas: 1
```

### Detailed API Specification

For a complete API specification of the Location resource, refer to the
[Detailed Reference](https://github.com/datum-cloud/workload-operator/blob/main/docs/api/workloads.md).
