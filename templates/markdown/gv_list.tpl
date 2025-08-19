{{- define "gvList" -}}
{{- $groupVersions := . -}}

---
title: API Reference
draft: false
weight: 3
---

## Packages
{{- range $groupVersions }}
- {{ markdownRenderGVLink . }}
{{- end }}

{{ range $groupVersions }}
{{ template "gvDetails" . }}
{{ end }}

{{- end -}}
