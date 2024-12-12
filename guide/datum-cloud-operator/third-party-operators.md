## Install Third Party Operators

### cert-manager

Install cert-manager in the "upstream" control plane:

```shell
kubectl --context kind-upstream apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
```

Ensure that cert-manager pods are running and ready:

```shell
kubectl --context kind-upstream wait -n cert-manager \
  --for=condition=Ready pod --all
```

Output should be similar to the following:

```shell
pod/cert-manager-b6fd485d9-2s78z condition met
pod/cert-manager-cainjector-dcc5966bc-ntbw4 condition met
pod/cert-manager-webhook-dfb76c7bd-vxgb8 condition met
```

Refer to the [cert-manager installation guide](https://cert-manager.io/docs/installation/)
for more details.

### GCP Config Connector

GCP Config Connector is used to manage Google Cloud resources directly from
Kubernetes. The infra-provider-gcp application integrates with GCP Config
Connector to create and maintain resources in GCP based on Kubernetes custom
resources.

> [!TIP]
>
> The service account creation instructions in the installation guide result
> in granting significantly more access to the GCP project than necessary. It
> is recommended to only bind the following roles to the service account:
>
> - `roles/compute.admin`
> - `roles/container.admin`
> - `roles/secretmanager.admin`
> - `roles/iam.serviceAccountAdmin`
> - `roles/iam.serviceAccountUser`

<!-- markdownlint-disable MD028 -->
> [!NOTE]
> The section "Specifying where to create your resources" can be skipped.

1. Set the kubectl context to `kind-infra` in order to target the correct control
   plane while following the Config Connector installation guide.

    ```shell
    kubectl config use-context kind-infra
    ```

2. Follow the [installation guide](https://cloud.google.com/config-connector/docs/how-to/install-other-kubernetes),
   making sure to retain the service account credential saved to `key.json`, as
   this will be required later by `infra-provider-gcp`.

3. Set the kubectl context back to `kind-upstream`.

    ```shell
    kubectl config use-context kind-upstream
    ```