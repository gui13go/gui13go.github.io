---
title: "SSH Fundamentals: A Practical Hands-On Guide"
date: 2026-09-06T00:58:40Z
draft: false
description: "A deep dive into SSH architecture, cryptographic handshakes, key generation, hardening sshd_config, multiplexing, and advanced tunneling."
tags: ["Linux", "GNU/Linux", "Encryption", "Ubuntu", "SSH", "Security", "Networking"]
categories: ["Security", "Linux", "Networking"]
cover:
  image: "https://gui13go.github.io/images/ssh-fundamentals-cover.jpeg"
  alt: "SSH Fundamentals: A Practical Hands-On Guide"
  caption: "Secure Shell (SSH) Architecture & Operations"
  relative: false
canonicalURL: "https://guilhermeviegas.substack.com/p/ssh-fundamentals"
---

Secure Shell (SSH) is a popular protocol used for securely connecting to a server over an **encrypted** channel. Unlike older protocols like Telnet, which transmit data such as usernames and passwords in cleartext, SSH uses asymmetric encryption to protect your information.
**Learning Objectives**
By the end of this exercise, you will be able to:
- Establish a remote connection using standard SSH.
- Generate and deploy SSH key pairs for passwordless authentication.
- Securely transfer files between a local machine and a remote server.
- Understand basic SSH tunneling concepts.
**Prerequisites**- A terminal emulator (e.g., Terminal on macOS/Linux, PowerShell or Command Prompt on Windows).
- Access to a remote Linux server (e.g., Ubuntu or Kali Linux).
- The remote server’s IP address and your login credentials.
**Exercise 0: Find out IP**
First, it is important to know the IP address of the destination machine:

```bash
ip addr show
# or
hostname -I
# or
ip route get 1.1.1.1 | awk ‘{print $7; exit}’ 
# Environment variable (recommended for reuse in commands)
export SERVER_IP=$(ip route get 1.1.1.1 | awk ‘{print $7; exit}’)
echo $SERVER_IP
## 192.168.1.166 (as an example)
```

**Exercise 1: Basic Connection**
The most basic way to connect to a server is using a username and an IP address.

```bash
# Connect to the server
ssh server-user@$SERVER_IP
## If this is your first time connecting, you will be asked to verify the host authenticity. Type yes.
## Enter your password when prompted.
```

**Exercise 2: Secure File Transfer**
Transferring files between local and remote machines is a common task. You can use scp (Secure Copy Protocol) or rsync for this purpose.

```bash
# Copy a single file to remote server
## Replace /path/ to your actual path within the server
scp file.txt server-user@$SERVER_IP:/path/

# Copy an entire directory recursively
scp -r folder/ server-user@$SERVER_IP:/path/
```

For large transfers or ongoing synchronization, rsync is a powerful alternative that only transfers modified files and supports resuming interrupted transfers.
**Exercise 3: Key-Based Authentication**
Using SSH keys is more secure and convenient than passwords. SSH uses a public and private key pair for authentication.

```bash
# Generate key (press Enter for defaults)
ssh-keygen -t ed25519 -C "client-user@mylaptop"
## -t specifies the "type" of algorithm to generate the SSH key.
## -C adds a human‑readable "comment" to the end of your public key (stored in the .pub file, e.g., ~/.ssh/id_ed25519.pub) 
## Note that ed25519 is preferred over the older rsa algorithm because it is faster, more secure, and produces smaller keys.

# (optional) Check the private key (do not share with anyone)
cat /home/client-user/.ssh/id_ed25519

# Copy public key to the server
ssh-copy-id server-user@$SERVER_IP
# Enter password one last time

# Should now connect without password
ssh server-user@$SERVER_IP
exit

# Create SSH config on Vivobook for shortcut
cat << 'EOF' >> ~/.ssh/config

Host serverABC
    HostName <SERVER_IP_ADDRESS>
    User userABC
    Port 22
    IdentityFile ~/.ssh/id_ed25519
EOF

# Now it is possible to connect to the server with just
ssh serverABC
```

- If connection times out: check firewall (“sudo ufw status” on both)
- If permission denied: verify “~/.ssh” permissions (700) and key permissions (600/644)
- If connection refused: verify the SSH service is running using “sudo systemctl status ssh”

![SSH Architecture & Connection Workflow](/images/ssh-architecture-diagram.jpeg)

**Exercise 4: Tailscale Connection**
Tailscale simplifies SSH connections by creating a private network (tailnet) between your devices, allowing you to connect securely from anywhere without needing to be on the same local network.

```bash
# Install Tailscale on both your local machine and remote server
curl -fsSL https://tailscale.com/install.sh | sh
# Start Tailscale and authenticate
sudo tailscale up
## Follow the authentication URL printed in your terminal output to join the device to your tailnet.
## Enable Tailscale SSH in your Tailscale admin console to permit secure SSH access across devices.

# Check status of connected devices
tailscale status

# Retrieve the IPv4 address of the device
tailscale ip -4
TAILNET_SERVER_IP=$(tailscale ip -4)

# Connect to the remote server
ssh server-user@$TAILNET_SERVER_IP

# Just like before, you may configure a shortcut
nano ~/.ssh/config

## Other commands worth mentioning
tailscale ping <device-name>
tailscale logout
tailscale down
tailscale update
```

- If the host machine goes to sleep, the Tailscale service will pause because the operating system is not running. It should automatically resume when the machine wakes up.
- If your Tailscale account is configured with key expiry, the node key might expire, requiring re-authentication. (This is common for ephemeral nodes or if configured in the admin console).
**Exercise 5: Server Hardening**
Securing the SSH service on the server is critical. Edit /etc/ssh/sshd_config on your remote server to restrict access:

```bash
# Edit sshd_config to harden remote server access
nano /etc/ssh/sshd_config

# Disable root login for better security
PermitRootLogin no

# Disable password authentication once keys are set up
PasswordAuthentication no

# Change default port (e.g., 2222) to reduce brute-force noise
Port 2222
```

**Exercise 6: Managing Multiple Identities**
If you use passphrases on keys, or manage multiple Git/SSH accounts, use these tools to streamline workflows:

```bash
# Start ssh-agent to cache your passphrase in memory
eval "$(ssh-agent -s)"

# Add your key to the agent
ssh-add ~/.ssh/id_ed25519

# For multiple accounts, define host aliases in ~/.ssh/config
cat << 'EOF' >> ~/.ssh/config

Host work-git
    HostName github.com
    IdentityFile ~/.ssh/id_work

Host personal-git
    HostName github.com
    IdentityFile ~/.ssh/id_personal
EOF

# Instead of cloning with the standard URL
git clone git@github.com:company/repo.git

# You replace github.com with your alias
## Uses ~/.ssh/id_work
git clone git@work-git:company/repo.git

## Uses ~/.ssh/id_personal
git clone git@personal-git:username/repo.git
```

**Exercise 7: Advanced Connectivity**
When a server is only accessible through an intermediary (a bastion host), use ProxyJump. ProxyJump is generally preferred over the older -W or -L tunneling methods because it is easier to configure and more secure, as it does not require the jump host to be able to decrypt the traffic.

```bash
# Connect through a jump host (-J)
ssh -J jump-user@jump-host user@target-server
```

Sometimes you may need to access a web service running on the remote server (e.g., a database GUI or monitoring tool) that is not exposed to the public internet. You can tunnel this traffic through your SSH connection via Port Forwarding.

```bash
ssh -L 8080:localhost:3000 serverABC
```

This command connects to serverABC and forwards any traffic sent to localhost:8080 on your local machine to localhost:3000 on the remote server.
**Exercise 8: Auditing and Compliance**
Regularly audit your SSH configuration for security weaknesses using tools like ssh-audit:

```bash
# Install and run ssh-audit
pip install ssh-audit
ssh-audit <target-IP>
```

**Summary of SSH Tools****Security Best Practices**- **Use Key Passphrases:** Always protect your private keys with a passphrase.
- **Audit Access:** Use tools like Teleport for auditing and controlling infrastructure access.
- **Avoid Cleartext:** Never use Telnet for remote administration, as it lacks encryption.
**Conclusion**
Mastering SSH is an essential skill for system administrators and developers alike. By moving beyond basic password authentication to public-key authentication, configuring connection shortcuts, and adopting best practices, you establish a secure, reliable foundation for managing remote infrastructure safely and efficiently.