---
title: Create a Datum HTTPProxy (Reverse Proxy)
weight: 1
---

## Before you begin

This tutorial assumes you have already:

- [Registered a Datum account]({{< relref "get-started" >}})
- [Installed and configured the necessary tools]({{< ref "tools.md" >}})
- [Created a Datum project]({{< ref "create-project" >}})

## Understanding HTTPProxy

An HTTPProxy is a simplified way to configure HTTP reverse proxy functionality
in Datum. It automatically creates and manages Gateway, HTTPRoute, and
EndpointSlice resources for you, reducing the complexity of manual
configuration.

HTTPProxy provides:

- Simple single-manifest configuration for reverse proxy setups
- Automatic backend endpoint resolution from URLs
- Built-in support for path-based routing and header manipulation
- Seamless integration with Datum's global proxy infrastructure

This tutorial will create an HTTPProxy that proxies traffic to
[example.com](https://www.example.com) as the backend service.

## Creating a Basic HTTPProxy

Let's create a simple HTTPProxy that will route traffic to example.com. Here's
the basic configuration:

{{< tabpane text=true left=true >}}
  {{% tab header="Apply from stdin" lang="en" %}}

  ```yaml
  cat <<EOF | kubectl apply -f -
  apiVersion: networking.datumapis.com/v1alpha
  kind: HTTPProxy
  metadata:
    name: httpproxy-sample-example-com
  spec:
    rules:
        - backends:
          - endpoint: https://example.com
  EOF
  ```

  {{% /tab %}}

  {{% tab header="Apply from file" lang="en" %}}

  Save and apply the following resource to your project:

  ```yaml
  apiVersion: networking.datumapis.com/v1alpha
  kind: HTTPProxy
  metadata:
    name: httpproxy-sample-example-com
  spec:
    rules:
        - backends:
          - endpoint: https://example.com
  ```

  {{% /tab %}}
{{< /tabpane >}}

Summary of this HTTPProxy's configuration:

- **Rule Matching**: A default path prefix match is inserted which matches all
  incoming requests and forwards them to the backend.

- **Backend URL Components**: The `endpoint: https://example.com` URL is parsed
  to extract:
  - **Scheme**: `https` (determines the protocol for backend connections)
  - **Host**: `example.com` (the target hostname for proxy requests)
  - **Port**: `443` (inferred from HTTPS scheme)

- **Single Backend Limitation**: Currently, HTTPProxy supports only one backend
  endpoint per rule.

## Verifying the HTTPProxy

Check that your HTTPProxy was created and programmed successfully:

```shell
kubectl get httpproxy httpproxy-sample-example-com
```

You should see output similar to:

```shell
NAME                           HOSTNAME                                                       PROGRAMMED   AGE
httpproxy-sample-example-com   c4b9c93d-97c2-46d1-972e-48197cc9a9da.prism.e2e.env.datum.net   True         11s
```

The key fields in this output are:

- **NAME**: Your HTTPProxy resource name
- **HOSTNAME**: The auto-generated hostname where your proxy is accessible
- **PROGRAMMED**: `True` indicates the HTTPProxy has been successfully
  configured
- **AGE**: How long the resource has existed

## Testing the HTTPProxy

Once your HTTPProxy shows `PROGRAMMED: True`, you can test it using the
generated hostname:

```shell
# Use the hostname from kubectl get httpproxy output
curl -v http://c4b9c93d-97c2-46d1-972e-48197cc9a9da.prism.e2e.env.datum.net
```

Alternatively, copy the hostname into a browser to view example.com content
served through your Datum HTTPProxy.

## Understanding Generated Resources

HTTPProxy automatically creates several Kubernetes resources behind the scenes:

### 1. Gateway Resource

Check the generated Gateway:

```shell
kubectl get gateway
```

The HTTPProxy creates a Gateway that handles incoming traffic and provides the
external hostname.

### 2. HTTPRoute Resource

View the generated HTTPRoute:

```shell
kubectl get httproute
```

The HTTPRoute defines the routing rules and connects the Gateway to the backend
endpoints.

### 3. EndpointSlice Resource

Examine the generated EndpointSlice:

```shell
kubectl get endpointslices
```

The EndpointSlice contains the resolved IP addresses and port information for
the backend service extracted from your `endpoint` URL.

## Advanced Configuration

HTTPProxy leverages many existing [Gateway API][gateway-api] features, including
[matches][gateway-matches] and [filters][gateway-filters]. Datum supports all
[Core][gateway-core] Gateway API capabilities, providing you with a rich set of
traffic management features through the simplified HTTPProxy interface.

[gateway-api]: https://gateway-api.sigs.k8s.io/
[gateway-matches]: https://gateway-api.sigs.k8s.io/reference/spec/#httproutematch
[gateway-filters]: https://gateway-api.sigs.k8s.io/reference/spec/#httproutefilter
[gateway-core]: https://gateway-api.sigs.k8s.io/concepts/conformance/?h=core#2-support-levels

### Multiple Path Rules

You can define multiple routing rules within a single HTTPProxy:

{{< tabpane text=true left=true >}}
  {{% tab header="Apply from stdin" lang="en" %}}

  ```yaml
  cat <<EOF | kubectl apply -f -
  apiVersion: networking.datumapis.com/v1alpha
  kind: HTTPProxy
  metadata:
    name: httpproxy-multi-path
  spec:
    rules:
      - name: root-route
        matches:
          - path:
              type: PathPrefix
              value: /
        backends:
          - endpoint: https://example.com
      - name: headers-route
        matches:
          - path:
              type: PathPrefix
              value: /headers
        backends:
          - endpoint: https://httpbingo.org
  EOF
  ```

  {{% /tab %}}

  {{% tab header="Apply from file" lang="en" %}}

  Save and apply the following resource to your project:

  ```yaml
  apiVersion: networking.datumapis.com/v1alpha
  kind: HTTPProxy
  metadata:
    name: httpproxy-multi-path
  spec:
    rules:
      - name: root-route
        matches:
          - path:
              type: PathPrefix
              value: /
        backends:
          - endpoint: https://example.com
      - name: headers-route
        matches:
          - path:
              type: PathPrefix
              value: /headers
        backends:
          - endpoint: https://httpbingo.org
  ```

  {{% /tab %}}
{{< /tabpane >}}

### Header-based Routing and rewrite filters

HTTPProxy supports header-based matching and request rewrites:

{{< tabpane text=true left=true >}}
  {{% tab header="Apply from stdin" lang="en" %}}

  ```yaml
  cat <<EOF | kubectl apply -f -
  apiVersion: networking.datumapis.com/v1alpha
  kind: HTTPProxy
  metadata:
    name: httpproxy-header-based
  spec:
    rules:
      - name: headers
        matches:
          - headers:
              - name: x-rule
                value: headers
        filters:
          - type: URLRewrite
            urlRewrite:
              path:
                type: ReplaceFullPath
                replaceFullPath: /headers
        backends:
          - endpoint: https://httpbingo.org
      - name: ip
        matches:
          - headers:
              - name: x-rule
                value: ip
        filters:
          - type: URLRewrite
            urlRewrite:
              path:
                type: ReplaceFullPath
                replaceFullPath: /ip
        backends:
          - endpoint: https://httpbingo.org
  EOF
  ```

  {{% /tab %}}

  {{% tab header="Apply from file" lang="en" %}}

  Save and apply the following resource to your project:

  ```yaml
  apiVersion: networking.datumapis.com/v1alpha
  kind: HTTPProxy
  metadata:
    name: httpproxy-header-based
  spec:
    rules:
      - name: headers
        matches:
          - headers:
              - name: x-rule
                value: headers
        filters:
          - type: URLRewrite
            urlRewrite:
              path:
                type: ReplaceFullPath
                replaceFullPath: /headers
        backends:
          - endpoint: https://httpbingo.org
      - name: ip
        matches:
          - headers:
              - name: x-rule
                value: ip
        filters:
          - type: URLRewrite
            urlRewrite:
              path:
                type: ReplaceFullPath
                replaceFullPath: /ip
        backends:
          - endpoint: https://httpbingo.org
  ```

  {{% /tab %}}
{{< /tabpane >}}

Once your HTTPProxy shows `PROGRAMMED: True`, you can test it using the
generated hostname:

**Headers Rule**:

```shell
# Use the hostname from kubectl get httpproxy output
curl -H "x-rule: headers" -v http://c4b9c93d-97c2-46d1-972e-48197cc9a9da.prism.e2e.env.datum.net
```

You should see output similar to:

```json
{
  "headers": {
    "Accept": [
      "*/*"
    ],
    // ...
  }
}
```

**IP Rule**:

```shell
# Use the hostname from kubectl get httpproxy output
curl -H "x-rule: ip" -v http://c4b9c93d-97c2-46d1-972e-48197cc9a9da.prism.e2e.env.datum.net
```

You should see output similar to:

```json
{
  "origin": "127.0.0.1"
}
```

## Next Steps

- Coming soon! Learn about Datum's observability tools and telemetry exporters

## Troubleshooting

Common issues and their solutions:

1. **HTTPProxy not showing PROGRAMMED: True**:
   - Check the HTTPProxy status: `kubectl describe httpproxy <name>`
   - Verify the backend endpoint URL is accessible
   - Ensure the Datum network services operator is running

2. **Generated hostname not responding**:
   - Verify the HTTPProxy status shows `PROGRAMMED: True`
   - Check that the backend service at the endpoint URL is accessible
   - Review the generated Gateway status: `kubectl get gateway -o wide`

3. **Backend URL parsing issues**:
   - Ensure the endpoint URL includes the scheme (http:// or https://)
   - Verify the hostname in the URL is resolvable
   - Check for any typos in the endpoint URL

4. **Checking generated resources**:
   - List all related resources: `kubectl get gateway,httproute,endpointslices`
   - Use `kubectl describe` on any resource showing issues
   - Review logs from the network services operator if resources aren't being
     created
