This guide provides step-by-step instructions for setting up a development
environment to install and run the Datum Cloud operators. It is targeted toward
a technical audience familiar with Kubernetes, kubebuilder, and
controller-runtime.

By following this guide, you will be able to:

- Install and configure the required dependencies.
- Set up kind clusters for "upstream" and "infra" control planes.
- Install and run the Workload Operator, Network Services Operator, and Infra
  Provider GCP components.
- Configure and use Config Connector for managing GCP resources.
- Register a Location and create a sample Workload in Kubernetes.