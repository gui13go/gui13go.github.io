---
title: "Building a Digital Fortress: Cyber Security with Cloud Armor & Terraform"
date: 2026-02-07T16:02:38Z
draft: false
description: "How to design, codify, and deploy an enterprise-grade WAF and DDoS mitigation architecture on Google Cloud Platform using Cloud Armor and Terraform."
tags: ["GCP", "Terraform", "Cloud Armor", "Cybersecurity", "Cloud Architecture", "DevOps", "Infrastructure as Code"]
categories: ["Cloud", "Security", "Terraform"]
cover:
  image: "https://gui13go.github.io/images/building-a-digital-fortress-cover.png"
  alt: "Building a Digital Fortress: Cyber Security with Cloud Armor & Terraform"
  caption: "Google Cloud Armor & Terraform Cybersecurity Architecture"
  relative: false
canonicalURL: "https://guilhermeviegas.substack.com/p/building-a-digital-fortress"
---

## 1. Introduction

In an era that automated bots and script kiddies can make quite a mess in one’s website, “security through obscurity” is no longer a viable strategy for any public-facing application—even a portfolio site. To protect my portfolio hub, I implemented **Google Cloud Armor**, a global-scale Web Application Firewall (WAF) and DDoS mitigation service.

This article details how I leveraged **Infrastructure as Code (IaC)** securely using Terraform to deploy a defense-in-depth strategy, featuring Geo-blocking, OWASP Top 10 protection, and AI-driven Adaptive Protection.

## 2. Defense at the Edge

Cloud Armor doesn’t sit on my server; it sits at the **edge** of Google’s network. This means malicious traffic is dropped at the Point of Presence (PoP) closest to the attacker, miles away from my actual application infrastructure.

![Cloud Armor Architecture Flow](/images/cloud-armor-diagram.png)

By integrating Cloud Armor with the **External HTTP(S) Load Balancer**, I ensure that my application only processes legitimate, clean requests, saving on compute costs and protecting against resource exhaustion.

## 3. The Implementation Strategy

I used Terraform to define my security policy as a version-controlled artifact. The resource `google_compute_security_policy` acts as the container for all my **rules**.

```hcl
resource "google_compute_security_policy" "security_policy" {
  project     = var.project_apps_id
  name        = "portfolio-security-policy"
  description = "Cloud Armor policy: Geo-blocking + OWASP Top 10 + Adaptive Protection"

  # ... Rule #1: Block specific regions
  # ... Rule #2: Prevent Common Attacks (WAF: SQLi, XSS, RCE, LFI)
  # ... Rule #3: Default Rule (Allow everything else)
  # ... Rule #4: AI-driven Adaptive Protection for Layer 7 DDoS
}
```

After that, the security policy simply needs to be pointed in the backend, as in `security_policy = google_compute_security_policy.security_policy.id`.

```hcl
resource "google_compute_backend_service" "backend" {
  # ... Setup
  security_policy = google_compute_security_policy.security_policy.id
  # ... Backend logic
}
```

### Rule #1: Geo-Fencing (Reducing the Attack Surface)

The most efficient firewall rule is the one that drops the most traffic with the least processing power. Geo-blocking allows us to eliminate traffic from regions where we have no legitimate user base or high volumes of attack traffic.

For this deployment, I enforced a strict block on traffic originating from Israel as a form of protest. By leveraging Cloud Armor’s location-based expressions, I have enforced a total block on Israeli traffic. This serves as a personal sanction against the state’s military actions and an expression of solidarity with those affected by the ongoing conflict.

We target `origin.region_code` and, if it is a match, the results take to a “403 Forbidden“ page.

```bash
rule {
  action   = "deny(403)"
  priority = "1000"
  match {
    expr {
      # ISO 3166-1 alpha-2 code for Israel
      expression = "origin.region_code == 'IL'"
    }
  }
  description = "Geo-block: Deny requests from Israel"
}
```

### Rule #2: WAF (Web Application Firewall)

Once a request passes the geographic filter, it undergoes deep packet inspection. Cloud Armor utilizes Google’s massive threat intelligence database to identify malicious payloads. The main protection sets cover:

1.  **SQL Injection (SQLi)**: Detects patterns like `’ OR 1=1` designed to dump databases.

2.  **Cross-Site Scripting (XSS)**: Blocks `<script>` tags and other vectors attempting to inject client-side code.

3.  **Remote Code Execution (RCE)**: Identifies attempts to run shell commands (e.g., `cmd.exe`, `/bin/sh`).

4.  **Local File Inclusion (LFI)**: Stops directory traversal attacks (e.g., `../../etc/passwd`).

```bash
rule {
  action   = "deny(403)"
  priority = "2000"
  match {
    expr {
      # Combining standard stable rulesets
      expression = <<-EOT
        evaluatePreconfiguredExpr('sqli-v33-stable') ||
        evaluatePreconfiguredExpr('xss-v33-stable') ||
        evaluatePreconfiguredExpr('rce-v33-stable') ||
        evaluatePreconfiguredExpr('lfi-v33-stable')
      EOT
    }
  }
  description = "WAF: Protect against SQLi, XSS, RCE, and LFI"
}
```

Note: We use the “stable” version of the rule sets to prevent automatic updates from introducing false positives.

### Rule #3: AI-drive Adaptive Protection (for Layer 7 DDoS)

Signature-based WAFs are great for known attacks, but fail against zero-day exploits or subtle Layer 7 DDoS attacks (e.g., “low and slow”).

**Adaptive Protection** builds a machine-learning model of my application’s “normal” traffic patterns. It looks at:

- Request rate per IP

- User-Agent distribution

- URL popularity

If it detects an anomaly—like a sudden spike in requests to a specific endpoint—it generates an alert and can even suggest a mitigation rule automatically.

```bash
adaptive_protection_config {
  layer_7_ddos_defense_config {
    enable = true
  }
}
```

### Rule #4: The Baseline (Default Allow)

In a “Negative Security Model” (which is standard for public websites), we block known bad actors and allow everything else. The final rule in our chain is an unconditional **Allow** for the rest of the world.

```bash
rule {
  action   = "allow"
  priority = "2147483647" # (max)
  match {
    versioned_expr = "SRC_IPS_V1"
    config {
      src_ip_ranges = ["*"]
    }
  }
  description = "Default: Allow all remaining traffic"
}
```

## 4. Advanced Capabilities: Future-Proofing

Cloud Armor is extensive. Beyond my current baseline, here are some features for specific use-cases:

**Rate Limiting:** To prevent brute-force attacks on my admin login or API scraping:

- **Throttle:** Slow down requests from a single IP to 10 per minute.

- **Ban:** Automatically ban an IP for 1 hour if they exceed 50 requests/minute.

**Bot Management:** Cloud Armor integrates with **reCAPTCHA Enterprise**. Instead of showing a puzzle, it scores the incoming request.

- **Score 0.1 (Bot):** Block or redirect to a “honeypot”.

- **Score 0.9 (Human):** Allow pass-through.

This is critical for preventing credential stuffing without hurting user experience.

**Preview Mode:** Before enforcing a new strict WAF rule, we can use `preview_mode = true`. This logs what would have been blocked, allowing to audit for False Positives without taking the site down for legitimate users.

## 5. Verification & Observability

Trust, but verify. Security is invisible until you look at the logs.

We can also simulate a safe attack to verify whether the rules are active. Though, I wont cover it in this blog post.

**Observability:**Cloud Armor logs every decision to **Cloud Logging**. I can create dashboards to visualize:

- **Map of Blocked Requests**: Visualizing the Geo-blocking in action.

- **Attack Trends**: seeing spikes in SQLi attempts.

- **Adaptive Protection Alerts**: Notification of potential DDoS attempts.

## 6. Conclusion

By implementing Cloud Armor via Terraform, I have achieved:

1.  **Security as Code**: My security policy is versioned, reviewed, and reproducible.

2.  **Global Scale**: Defense happens at Google’s edge, not my server.

3.  **Future Proofing**: AI-driven protection adapts to new threats automatically.

The result is a portfolio that is not just a showcase of code, but a demonstration of professional-grade infrastructure engineering. More than that, it is a piece of tech activism against the horrors of military aggression. Consider this 403 error my contribution to the resistance.

