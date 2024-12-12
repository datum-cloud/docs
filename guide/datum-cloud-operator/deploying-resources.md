### Registering a Location

Before creating a workload, a Location must be registered. Use the following example manifest:

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: Location
metadata:
  name: my-gcp-us-south1-a
spec:
  locationClassName: self-managed
  topology:
    topology.datum.net/city-code: DFW
  provider:
    gcp:
      projectId: TODO
      region: us-south1
      zone: us-south1-a
```

1. Replace `topology.datum.net/city-code`'s value (`DFW`) with the desired city code for your workloads.
2. Update the `gcp` provider settings to reflect your GCP project ID, desired region, and zone.

Apply the manifest:

```shell
kubectl apply -f <path-to-location-manifest>
```

List Locations:

```shell
kubectl get locations
```

```shell
NAME                 AGE
my-gcp-us-south1-a   5s
```

### Creating a Network

Before creating a workload, a Network must be created. You can use the following
manifest to do this:

> [!NOTE]
> In the future, a default network may automatically be created in a namespace.

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: Network
metadata:
  name: default
spec:
  ipam:
    mode: Auto
```

Apply the manifest:

```shell
kubectl apply -f <path-to-network-manifest>
```

List Networks:

```shell
kubectl get networks
```

```shell
NAME      AGE
default   5s
```

### Creating a Workload

> [!CAUTION]
> These actions will result in billable resources being created in the GCP
> project for the target location. Destroy any resources which are not needed
> to avoid unnecessary costs.

Create a manifest for a sandbox based workload, for example:

```yaml
apiVersion: compute.datumapis.com/v1alpha
kind: Workload
metadata:
  name: my-container-workload
spec:
  template:
    spec:
      runtime:
        resources:
          instanceType: datumcloud/d1-standard-2
        sandbox:
          containers:
            - name: httpbin
              image: mccutchen/go-httpbin
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

Apply the manifest:

```shell
kubectl apply -f <path-to-workload-manifest>
```

#### Check the state of the workload

```shell
kubectl get workloads
```

Example output:

```shell
NAME                    AGE   AVAILABLE   REASON
my-container-workload   9s    False       NoAvailablePlacements
```

The `REASON` field will be updated as the system progresses with attempting to
satisfy the workload's intent.

#### Check Workload Deployments

A Workload will result in one or more WorkloadDeployments being created, one for
each unique CityCode per placement.

```shell
kubectl get workloaddeployments
```

Example output:

```shell
NAME                           AGE   LOCATION NAMESPCE   LOCATION NAME        AVAILABLE   REASON
my-container-workload-us-dfw   58s   default             my-gcp-us-south1-a   False       LocationAssigned
```

Similar to workloads, the `REASON` field will be updated as the system
progresses with attempting to satisfy the workload's intent. In this case, the
`infra-provider-gcp` operator is responsible for these actions.

#### Check Instances

```shell
kubectl -n default get instances -o wide
```

Example output:

```shell
NAME                             AGE   AVAILABLE   REASON              NETWORK IP   EXTERNAL IP
my-container-workload-us-dfw-0   24s   True        InstanceIsRunning   10.128.0.2   34.174.154.114
```

Confirm that the go-httpbin application is running:

```shell
curl -s http://34.174.154.114:8080/uuid
```

```json
{
  "uuid": "8244205b-403e-4472-8b91-728245e99029"
}
```

---

For more detailed troubleshooting and information, refer to the respective
operator documentation.