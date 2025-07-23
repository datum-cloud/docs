---
title: Export telemetry to Grafana Cloud
weight: 2
---

This tutorial shows you how to export metrics from your Datum platform to
Grafana Cloud using an ExportPolicy and Secret.

## Before you begin

This tutorial assumes you have already:

- [Registered a Datum account]({{< relref "get-started" >}})
- [Installed and configured the necessary tools]({{< ref "tools.md" >}})
- [Created a Datum project]({{< ref "create-project" >}})
- [Configured a kubeconfig context for your project]( {{< ref
    "create-project#add-a-kubeconfig-context-for-your-project" >}} )
- A Grafana Cloud account with an active instance

## Overview

You will configure metric export by:

1. Accessing your Grafana Cloud instance
2. Generating Prometheus remote write configuration
3. Creating Datum Secret and ExportPolicy resources

The process extracts connection details from Grafana Cloud's generated
configuration and creates the necessary Datum resources automatically.

## Step 1: Access your Grafana Cloud instance

If you don't have a Grafana Cloud account,
<a href="https://grafana.com/" target="_blank">create one at grafana.com</a>.

1. Sign in to <a href="https://grafana.com/auth/sign-up/" target="_blank">Grafana Cloud</a>
2. Navigate to your desired instance
3. Copy your instance URL (for example: `https://play.grafana.net`)

## Step 2: Generate connection URL

Use this form to generate the Grafana Cloud connection URL:

<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h4>Grafana Cloud Connection URL Generator</h4>
  <form id="urlGenerator">
    <div style="margin-bottom: 10px;">
      <label for="instanceUrl" style="display: block; margin-bottom: 5px;">Grafana Cloud Instance URL:</label>
      <input type="url" id="instanceUrl" placeholder="https://play.grafana.net" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
    </div>
  </form>
  <div id="connectionUrl" style="margin-top: 15px; display: none;">
    <p><strong>Connection URL (for Step 3):</strong></p>
    <p><a id="generatedUrl" href="#" target="_blank" style="word-break: break-all; font-family: monospace;"></a></p>
  </div>
</div>

<script>

function generateConnectionUrl() {
  let instanceUrl = document.getElementById('instanceUrl').value;

  if (!instanceUrl.trim()) {
    document.getElementById('connectionUrl').style.display = 'none';
    return;
  }

  // Add https:// if no scheme is provided
  if (!instanceUrl.match(/^https?:\/\//)) {
    instanceUrl = 'https://' + instanceUrl;
  }

  try {
    const url = new URL(instanceUrl);
    const connectionUrl = `${url.origin}/connections/add-new-connection/hmInstancePromId?remoteWrite=direct`;

    document.getElementById('generatedUrl').href = connectionUrl;
    document.getElementById('generatedUrl').textContent = connectionUrl;
    document.getElementById('connectionUrl').style.display = 'block';
  } catch (error) {
    document.getElementById('connectionUrl').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const instanceUrlInput = document.getElementById('instanceUrl');
  instanceUrlInput.addEventListener('input', generateConnectionUrl);
});
</script>

## Step 3: Get Prometheus configuration

1. Click the generated connection URL above
2. Choose whether to create a new API token or use an existing one
3. Complete the form and submit it
4. Copy the generated Prometheus configuration YAML

The configuration looks similar to this:

```yaml
remote_write:
  - url: https://prometheus-prod-56-prod-us-east-2.grafana.net/api/prom/push
    basic_auth:
      username: 123456
      password: glc_eyJvIjoiNzA2...
```

## Step 4: Generate and apply Datum resources

Paste your Prometheus configuration below to generate the Secret and ExportPolicy. Use the tabs to choose between applying from stdin or saving to files:

<div markdown="0">

<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h4>Datum Resource Generator</h4>
  <form id="resourceGenerator">
    <div style="margin-bottom: 20px;">
      <label for="prometheusConfig" style="display: block; margin-bottom: 5px;">Prometheus Configuration YAML:</label>
      <textarea id="prometheusConfig" rows="8" placeholder="Paste your Prometheus remote_write configuration here..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace;"></textarea>
    </div>
  </form>

  <div id="configWarning" style="margin-top: 15px; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; color: #856404; display: none;">
    <strong>⚠️ Configuration Error:</strong> <span id="warningMessage"></span>
  </div>
</div>

  <div id="generatedResources" style="margin-top: 20px;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h4>Secret</h4>
      <div style="margin-bottom: 15px;">
        <label for="secretName" style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>
        <input type="text" id="secretName" value="grafana-cloud-credentials" style="width: 400px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div id="secretPlaceholder" style="padding: 20px; text-align: center; color: #6c757d; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 4px;">
        <p style="margin: 0; font-style: italic;">Provide your Prometheus configuration above to generate the Secret manifest</p>
      </div>
      <div id="secretSection" style="display: none;">
        <ul class="nav nav-tabs" id="tabs-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="secret-tabs-04-00-tab" data-bs-toggle="tab" data-bs-target="#secret-tabs-04-00" role="tab" data-td-tp-persist="apply from stdin" aria-controls="secret-tabs-04-00" aria-selected="true">
              Apply from stdin
            </button>
          </li><li class="nav-item" role="presentation">
            <button class="nav-link" id="secret-tabs-04-01-tab" data-bs-toggle="tab" data-bs-target="#secret-tabs-04-01" role="tab" data-td-tp-persist="apply from file" aria-controls="secret-tabs-04-01" aria-selected="false" tabindex="-1">
              Apply from file
            </button>
          </li>
        </ul>
        <div class="tab-content" id="tabs-4-content">
          <div class="tab-body tab-pane fade" id="secret-tabs-04-00" role="tabpanel" aria-labelled-by="secret-tabs-04-00-tab" tabindex="4" aria-labelledby="secret-tabs-04-00-tab">
            <div class="highlight">
              <pre tabindex="0" style="background-color:#f8f8f8;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-yaml" data-lang="yaml" id="secretStdinOutput"></code></pre>
            </div>
          </div>
          <div class="tab-body tab-pane fade active show" id="secret-tabs-04-01" role="tabpanel" aria-labelled-by="secret-tabs-04-01-tab" tabindex="4" aria-labelledby="tabs-04-01-tab">
            <p>Save and apply the following resource to your project:</p>
            <div class="highlight">
              <pre tabindex="0" style="background-color:#f8f8f8;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-yaml" data-lang="yaml" id="secretFileOutput"></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h4>ExportPolicy</h4>
      <div style="margin-bottom: 15px;">
        <label for="exportPolicyName" style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>
        <input type="text" id="exportPolicyName" value="export-gateway-telemetry" style="width: 400px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>
      <div id="exportPolicyPlaceholder" style="padding: 20px; text-align: center; color: #6c757d; background: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 4px;">
        <p style="margin: 0; font-style: italic;">Provide your Prometheus configuration above to generate the ExportPolicy manifest</p>
      </div>
      <div id="exportPolicySection" style="display: none;">
        <ul class="nav nav-tabs" id="tabs-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="exportPolicy-tabs-04-00-tab" data-bs-toggle="tab" data-bs-target="#exportPolicy-tabs-04-00" role="tab" data-td-tp-persist="apply from stdin" aria-controls="exportPolicy-tabs-04-00" aria-selected="true">
              Apply from stdin
            </button>
          </li><li class="nav-item" role="presentation">
            <button class="nav-link" id="exportPolicy-tabs-04-01-tab" data-bs-toggle="tab" data-bs-target="#exportPolicy-tabs-04-01" role="tab" data-td-tp-persist="apply from file" aria-controls="exportPolicy-tabs-04-01" aria-selected="false" tabindex="-1">
              Apply from file
            </button>
          </li>
        </ul>
        <div class="tab-content" id="tabs-4-content">
          <div class="tab-body tab-pane fade" id="exportPolicy-tabs-04-00" role="tabpanel" aria-labelled-by="exportPolicy-tabs-04-00-tab" tabindex="4" aria-labelledby="exportPolicy-tabs-04-00-tab">
            <div class="highlight">
              <pre tabindex="0" style="background-color:#f8f8f8;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-yaml" data-lang="yaml" id="exportPolicyStdinOutput"></code></pre>
            </div>
          </div>
          <div class="tab-body tab-pane fade active show" id="exportPolicy-tabs-04-01" role="tabpanel" aria-labelled-by="exportPolicy-tabs-04-01-tab" tabindex="4" aria-labelledby="tabs-04-01-tab">
            <p>Save and apply the following resource to your project:</p>
            <div class="highlight">
              <pre tabindex="0" style="background-color:#f8f8f8;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-yaml" data-lang="yaml" id="exportPolicyFileOutput"></code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<!-- markdownlint-disable no-inline-html no-reversed-links line-length -->
<script>

function generateResources() {
  const configText = document.getElementById('prometheusConfig').value;
  const secretName = document.getElementById('secretName').value;
  const exportPolicyName = document.getElementById('exportPolicyName').value;
  const warningDiv = document.getElementById('configWarning');
  const warningMessage = document.getElementById('warningMessage');

  // Hide warning initially
  warningDiv.style.display = 'none';

  if (!configText.trim()) {
    document.getElementById('secretSection').style.display = 'none';
    document.getElementById('exportPolicySection').style.display = 'none';
    document.getElementById('secretPlaceholder').style.display = 'block';
    document.getElementById('exportPolicyPlaceholder').style.display = 'block';
    return;
  }

  if (!secretName.trim() || !exportPolicyName.trim()) {
    warningMessage.textContent = 'Please provide names for both Secret and ExportPolicy resources.';
    warningDiv.style.display = 'block';
    return;
  }

  try {
    // Parse the YAML configuration
    const lines = configText.split('\n');
    let url = '';
    let username = '';
    let password = '';
    let inBasicAuth = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      console.log(`Line ${i}: "${line}"`);

      if (line.startsWith('- url:') || line.startsWith('url:')) {
        url = line.split('url:')[1].trim();
        // Remove quotes if present
        url = url.replace(/^["']|["']$/g, '');
      } else if (line.startsWith('basic_auth:')) {
        inBasicAuth = true;
      } else if (inBasicAuth && line.startsWith('username:')) {
        username = line.split('username:')[1].trim();
        username = username.replace(/^["']|["']$/g, '');
      } else if (inBasicAuth && line.startsWith('password:')) {
        password = line.split('password:')[1].trim();
        password = password.replace(/^["']|["']$/g, '');
      } else if (line.startsWith('scrape_configs:') || line.startsWith('global:')) {
        inBasicAuth = false;
      }
    }

    if (!url || !username || !password) {
      let missingFields = [];
      if (!url) missingFields.push('remote_write URL');
      if (!username) missingFields.push('username');
      if (!password) missingFields.push('password');

      warningMessage.textContent = `Could not find required fields in configuration: ${missingFields.join(', ')}. Please ensure your Prometheus config includes a remote_write section with basic_auth credentials.`;
      warningDiv.style.display = 'block';
      document.getElementById('secretSection').style.display = 'none';
      document.getElementById('exportPolicySection').style.display = 'none';
      document.getElementById('secretPlaceholder').style.display = 'block';
      document.getElementById('exportPolicyPlaceholder').style.display = 'block';
      return;
    }

    // Encode credentials for Secret
    const encodedUsername = btoa(username);
    const encodedPassword = btoa(password);

    // Generate Secret YAML
    const secretYaml = `apiVersion: v1
kind: Secret
metadata:
  name: ${secretName}
type: kubernetes.io/basic-auth
data:
  username: ${encodedUsername}
  password: ${encodedPassword}`;

    // Generate ExportPolicy YAML
    const exportPolicyYaml = `apiVersion: telemetry.miloapis.com/v1alpha1
kind: ExportPolicy
metadata:
  name: ${exportPolicyName}
spec:
  sources:
    - name: gateway-metrics
      metrics:
        metricsql: |-
          {service_name="gateway.networking.k8s.io"}
  sinks:
    - name: grafana-cloud-metrics
      sources:
        - gateway-metrics
      target:
        prometheusRemoteWrite:
          endpoint: "${url}"
          authentication:
            basicAuth:
              secretRef:
                name: "${secretName}"`;

    // Display results

    const secretOutput = document.getElementById('secretOutput');
    const exportPolicyOutput = document.getElementById('exportPolicyOutput');

    console.log('secretOutput element:', secretOutput);
    console.log('exportPolicyOutput element:', exportPolicyOutput);

    // Update tabpane content
    const secretStdinOutput = document.getElementById('secretStdinOutput');
    const secretFileOutput = document.getElementById('secretFileOutput');
    const exportPolicyStdinOutput = document.getElementById('exportPolicyStdinOutput');
    const exportPolicyFileOutput = document.getElementById('exportPolicyFileOutput');
    const secretSection = document.getElementById('secretSection');
    const exportPolicySection = document.getElementById('exportPolicySection');

    if (secretStdinOutput && secretFileOutput && exportPolicyStdinOutput && exportPolicyFileOutput) {
      // Generate stdin commands
      const secretStdinCommand = `cat <<EOF | kubectl apply --server-side -f -\n${secretYaml}\nEOF`;
      const exportPolicyStdinCommand = `cat <<EOF | kubectl apply --server-side -f -\n${exportPolicyYaml}\nEOF`;

      // Update all outputs
      secretStdinOutput.textContent = secretStdinCommand;
      secretFileOutput.textContent = secretYaml;
      exportPolicyStdinOutput.textContent = exportPolicyStdinCommand;
      exportPolicyFileOutput.textContent = exportPolicyYaml;

      // Show the sections and hide placeholders
      secretSection.style.display = 'block';
      exportPolicySection.style.display = 'block';
      document.getElementById('secretPlaceholder').style.display = 'none';
      document.getElementById('exportPolicyPlaceholder').style.display = 'none';

      // Update verification commands
      updateVerifyCommands();
    } else {
      console.error('Could not find required tabpane elements');
    }

  } catch (error) {
    console.log(error);
    warningMessage.textContent = `Error parsing configuration: ${error.message}. Please ensure you have pasted valid Prometheus YAML configuration.`;
    warningDiv.style.display = 'block';
    document.getElementById('secretSection').style.display = 'none';
    document.getElementById('exportPolicySection').style.display = 'none';
    document.getElementById('secretPlaceholder').style.display = 'block';
    document.getElementById('exportPolicyPlaceholder').style.display = 'block';
  }
}

function updateVerifyCommands() {
  const secretName = document.getElementById('secretName').value;
  const exportPolicyName = document.getElementById('exportPolicyName').value;

  const secretVerifyCommand = document.getElementById('secretVerifyCommand');
  const exportPolicyVerifyCommand = document.getElementById('exportPolicyVerifyCommand');

  if (secretVerifyCommand) {
    secretVerifyCommand.textContent = `kubectl get secret ${secretName}`;
  }

  if (exportPolicyVerifyCommand) {
    exportPolicyVerifyCommand.textContent = `kubectl get exportpolicy ${exportPolicyName}`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const configInput = document.getElementById('prometheusConfig');
  const secretNameInput = document.getElementById('secretName');
  const exportPolicyNameInput = document.getElementById('exportPolicyName');

  configInput.addEventListener('input', generateResources);
  secretNameInput.addEventListener('input', function() {
    generateResources();
    updateVerifyCommands();
  });
  exportPolicyNameInput.addEventListener('input', function() {
    generateResources();
    updateVerifyCommands();
  });

  // Initialize verify commands on page load
  updateVerifyCommands();
});
</script>

## Step 5: Verify the configuration

Check that your resources were created successfully using the names you specified:

**Verify the Secret:**

<div class="highlight"><pre tabindex="0" style="background-color:#f8f8f8;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><div class="click-to-copy"><button type="button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="body" class="fas fa-copy btn btn-sm td-click-to-copy" aria-label="Copy to clipboard" data-bs-original-title="Copy to clipboard"></button></div><code class="language-shell" data-lang="shell"><span style="display:flex;"><span id="secretVerifyCommand">kubectl get secret grafana-cloud-credentials
</span></span></code></pre></div>

**Verify the ExportPolicy:**

<div class="highlight"><pre tabindex="0" style="background-color:#f8f8f8;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><div class="click-to-copy"><button type="button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-container="body" class="fas fa-copy btn btn-sm td-click-to-copy" aria-label="Copy to clipboard" data-bs-original-title="Copy to clipboard"></button></div><code class="language-shell" data-lang="shell"><span style="display:flex;"><span id="exportPolicyVerifyCommand">kubectl get exportpolicy export-gateway-telemetry
</span></span></code></pre></div>

Your metrics should now export to Grafana Cloud. You can view them in your
Grafana Cloud instance's Explore section or create dashboards to visualize the
data.

## Troubleshooting

If metrics aren't appearing in Grafana Cloud:

1. **Check Secret encoding**: Ensure username and password are correctly base64
   encoded
2. **Verify endpoint URL**: Confirm the Prometheus remote write endpoint is
   accessible
3. **Review ExportPolicy**: Check that the `metricsql` selector matches your
   services
4. **Check authentication**: Verify your API token has write permissions for
   Prometheus

For additional help, consult the [Datum telemetry
documentation](/docs/api/telemetry/) or [Grafana Cloud
documentation](https://grafana.com/docs/grafana-cloud/).
