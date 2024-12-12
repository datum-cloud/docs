### Create Kind Clusters

1. Create an "upstream" control plane:

    ```shell
    kind create cluster --name upstream
    ```

2. Create an "infra" control plane:

    ```shell
    kind create cluster --name infra
    ```