Clone the following repositories into the same parent folder for ease of use:

- [Workload Operator](https://github.com/datum-cloud/workload-operator/tree/integration/datum-poc)
- [Network Services Operator](https://github.com/datum-cloud/network-services-operator/tree/integration/datum-poc)
- [Infra Provider GCP](https://github.com/datum-cloud/infra-provider-gcp/tree/integration/datum-poc)

> [!IMPORTANT]
> For each repository, change the working branch to `integration/datum-poc`
>
> ```shell
> git -C workload-operator checkout integration/datum-poc
> git -C network-services-operator checkout integration/datum-poc
> git -C infra-provider-gcp checkout integration/datum-poc
> ```

> [!IMPORTANT]
> Ensure the kubectl context is set to `kind-upstream` before executing these
> steps.
>
> ```shell
> kubectl config use-context kind-upstream
> ```

<!-- markdownlint-disable MD028 -->
> [!NOTE]
> The `make` commands can take some time to execute for the first time.

### Workload Operator

1. In a separate terminal, navigate to the cloned `workload-operator` repository:

    ```shell
    cd /path/to/workload-operator
    ```

2. Install CRDs:

    ```shell
    make install
    ```

3. Start the operator:

    ```shell
    make run
    ```

### Network Services Operator

1. In a separate terminal, navigate to the cloned `network-services-operator` repository:

    ```shell
    cd /path/to/network-services-operator
    ```

2. Install CRDs:

    ```shell
    make install
    ```

3. Start the operator:

    ```shell
    make run
    ```

### Infra Provider GCP

1. In a separate terminal, navigate to the cloned `infra-provider-gcp` repository:

    ```shell
    cd /path/to/infra-provider-gcp
    ```

2. Create `infra.kubeconfig` and `upstream.kubeconfig` files pointing to the
   respective control planes.

    ```shell
    kind export kubeconfig --name upstream --kubeconfig upstream.kubeconfig
    kind export kubeconfig --name infra --kubeconfig infra.kubeconfig
    ```

3. Start the operator after ensuring that the `GOOGLE_APPLICATION_CREDENTIALS`
  environment variable is set to the path for the key saved while installing
  [GCP Config Connector](#gcp-config-connector).

    ```shell
    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
    ```

    ```shell
    make run
    ```