---
title: Datum Cloud Glossary
description: Definitions for terminology and concepts used in Datum Cloud and its documentation.
weight: 8
---

## API Resource

A Kubernetes-style custom resource that represents infrastructure components in
Datum Cloud. API resources are defined in YAML and can be managed using standard
Kubernetes tools like `kubectl`, `kustomize`, or Terraform.

## Bring Your Own Cloud (BYOC)

A deployment model that allows customers to run Datum Cloud infrastructure on
their own cloud providers or on-premises environments while connecting to the
Datum Cloud control plane for management, observability, and operations.

## Container Workload

A type of workload that runs applications packaged in OCI-compliant container
images. Container workloads provide lightweight, portable deployment units that
can be orchestrated across Datum's network cloud infrastructure.

## Control Plane

The centralized management layer of Datum Cloud that handles API requests,
resource orchestration, policy enforcement, and observability. The control plane
ensures that declared infrastructure state is reconciled and maintained across
all connected locations.

## Custom Resource

A Kubernetes API extension that allows Datum Cloud to define
infrastructure-specific objects like Networks, Workloads, and Locations. Custom
resources enable the use of standard Kubernetes tooling while providing
domain-specific functionality for network cloud operations.

## Data Plane

The infrastructure layer where actual workload traffic flows and where compute
instances are deployed. Data plane resources can run on Datum's managed global
infrastructure or on customer-controlled BYOC zones.

## Federated Infrastructure

An architecture that allows Datum Cloud to operate across multiple cloud
providers and locations while maintaining unified management through a single
control plane. This enables customers to deploy workloads anywhere while
maintaining consistent operational practices.

## Gateway API

A Kubernetes standard (GatewayClass, Gateway, HTTPRoute) used by Datum Cloud to
define how external or internal traffic connects to services. The Gateway API
provides a declarative way to configure load balancing, routing, and traffic
management.

## Instance

A compute resource (virtual machine or container) that runs as part of a
workload deployment. Instances are managed by infrastructure provider operators
and can be deployed across multiple locations based on placement rules.

## Instance Template

A specification that defines the configuration for compute instances within a
workload, including machine type, image, storage, and network attachments.
Instance templates enable consistent and repeatable deployments across different
locations.

## IP Address Management (IPAM)

The automated allocation and management of IP addresses within Datum Cloud
networks. IPAM ensures efficient use of address space and prevents conflicts
across distributed workload deployments.

## Location

A geographical and cloud provider context where Datum workloads can be deployed.
Locations define the available infrastructure zones and provide the foundation
for workload placement decisions based on latency, compliance, or performance
requirements.

## Network

A virtual private cloud (VPC) network that defines how workloads communicate
within Datum Cloud. Networks provide isolated networking environments with
configurable subnets, routing, and security policies.

## Network Binding

A resource that defines an intent to attach to a Network in a given Location,
such as a Workload Deployment being scheduled to a Location that will need to attach Instances to the Network. The control plane reacts to this resource by ensuring appropriate Network Contexts are provisioned.

## Network Context

A logical partition of a Network that helps organize and manage networking
resources such as Subnets across different Locations. A functioning Network will have one or more Network Contexts.

## Network Function Virtualization (NFV)

The virtualization of network services that traditionally ran on dedicated
hardware. Datum Cloud supports deployment and lifecycle management of both
commercial and open source NFV technologies as software-based workloads.

## Network Policy

Security rules that control traffic flow between endpoints on a network, and
external resources. Network policies provide fine-grained access control and
segmentation within Datum Cloud environments.

## Open Network Cloud

Datum's vision for a network infrastructure platform that can run anywhere - on
managed global infrastructure or federated with customer-controlled locations -
while being built on open source technologies under the AGPL v3 license.

## Placement Rules

Configuration that determines where workload instances should be deployed across
available locations and providers. Placement rules consider factors like latency
requirements, compliance needs, resource availability, and cost optimization.

## Provider Operator

A software component that manages the lifecycle of infrastructure resources on
specific cloud providers (e.g., Google Cloud, AWS, Azure). Provider operators
translate Datum Cloud resource definitions into provider-specific actions like
creating VMs or configuring networks.

## Reconciliation

The continuous process of ensuring that the actual state of infrastructure
resources matches the desired state defined in API resource specifications.
Reconciliation automatically handles failures, scaling, and configuration drift.

## Scaling Behavior

Configuration that defines how workloads should automatically scale in response
to demand, resource utilization, or other triggers. Scaling behavior includes
policies for minimum and maximum replicas, and horizontal scaling expectations.

## Service Chaining

The ability to route traffic through a sequence of network services or
functions, enabling complex traffic processing workflows. Service chaining
allows for advanced traffic management, security filtering, and protocol
transformations.

## Subnet

A network segment within a larger Network that provides IP address allocation
and routing boundaries. Subnets can provide the basic connectivity fabric for
workload instances.

## SubnetClaim

A request for subnet resources that automatically provisions the necessary
network infrastructure. SubnetClaims provide a declarative way to request
network addresses for use on a Network while allowing for IPAM policies to decide what addresses should be issued.

## Virtual Machine Workload

A type of workload that runs applications on traditional virtual machines rather
than containers. VM workloads provide full operating system isolation and are
suitable for legacy applications or specific compliance requirements.

## Volume Mount

Storage attachment configuration for workload instances, defining how storage
volumes should be connected to running compute instances. Volume mounts enable
stateful workloads with data persistence, as well as injecting content from ConfigMaps or Secrets via a filesystem path.

## Workload

A provider-agnostic specification for managing groups of compute instances (VMs
or containers) including their configuration, placement, scaling, networking,
and storage requirements. Workloads are the primary unit of application
deployment in Datum Cloud.

## Workload Deployment

A partition of a Workload created as a result of placement rules. Each Workload Deployment is responsible for maintaining the lifecycle of Instances as defined by the placement rule's scale settings. A single Workload may have one or more Workload Deployments, with each being individually responsible for its set of instances.

## Zone

A specific availability zone or data center location within a broader
geographical region. Zones provide fault isolation and allow for
high-availability deployments across multiple failure domains.
