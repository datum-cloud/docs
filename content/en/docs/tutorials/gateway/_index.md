---
title: Create a Datum Gateway (Reverse Proxy)
weight: 1
---

## Before you begin

This tutorial assumes you have already:

- [Registered a Datum account]({{< relref "get-started" >}})
- [Installed and configured the necessary tools]({{< ref "tools.md" >}})
- [Created a Datum project]({{< ref "create-project" >}})

## Understanding Datum Gateways

A Datum Gateway acts as a reverse proxy that manages incoming traffic to your services. It's built on top of the Kubernetes Gateway API specification and provides a way to:

- Route traffic to different services based on hostnames and paths
- Load balance requests across multiple backend services
- Apply TLS termination
- Monitor traffic flow

## Creating a Basic Gateway

Let's start by creating a simple Gateway that will listen for HTTP traffic on port 80. Here's a basic Gateway configuration:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: my-gateway
spec:
  gatewayClassName: datum-gateway
  listeners:
    - name: http
      protocol: HTTP
      port: 80
```

Apply this configuration using kubectl:

```shell
kubectl apply -f gateway.yaml
```

Verify the Gateway was created:

```shell
kubectl get gateway
```

## Creating Routes

Routes define how traffic should be directed to your services. Let's create a simple HTTPRoute that directs traffic to a backend service:

```yaml
apiVersion: networking.datumapis.com/v1alpha
kind: HTTPRoute
metadata:
  name: my-route
spec:
  parentRefs:
    - name: my-gateway
      kind: Gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api
      backendRefs:
        - name: my-endpoint
          kind: EndpointSlice
          port: 8080
```

This route configuration:
- Attaches to our previously created gateway
- Routes all requests with path prefix "/api" to a service named "my-endpoint" on port 8080

Apply the route:

```shell
kubectl apply -f route.yaml
```

## Configuring Endpoints

Endpoints in Datum Gateway are defined using EndpointSlice resources, which provide a more efficient way to manage service endpoints. Here's an example of how to define endpoints for your gateway:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-endpoint
addressType: IPv4
ports:
  - name: http
    port: 8080
    protocol: TCP
endpoints:
  - addresses:
      - "192.0.2.1"
    conditions:
      ready: true
  - addresses:
      - "192.0.2.2"
    conditions:
      ready: true
```

This EndpointSlice configuration:
- Defines a set of endpoints for a service named "my-endpoint"
- Specifies two endpoints with IPv4 addresses
- Includes port configuration for HTTP traffic
- References the actual pods that will receive the traffic
- Includes readiness conditions for each endpoint

Apply the endpoints:

```shell
kubectl apply -f endpoints.yaml
```

## Verifying the Setup

Check the status of your gateway components:

```shell
# Check Gateway status
kubectl get gateway

# Check Routes
kubectl get httproute

# Check EndpointSlices
kubectl get endpointslices
```

## Next Steps

- Understand how to using Datum's observability tools

## Troubleshooting

Common issues and their solutions:

1. Gateway not accepting traffic:
   - Verify the Gateway is in the "Ready" state
   - Check that the GatewayClass is properly configured
   - Ensure the listeners are correctly defined

2. Routes not working:
   - Confirm the parentRefs point to an existing Gateway
   - Verify the hostnames are correctly configured
   - Check that the EndpointSlices exist and have ready endpoints

3. Endpoints not receiving traffic:
   - Ensure the EndpointSlice addresses are correct
   - Verify the ports are correctly configured
   - Check that the endpoints are marked as ready

