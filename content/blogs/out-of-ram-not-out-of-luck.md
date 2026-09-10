---
title: "Out of RAM, Not Out of Luck: How the Linux Kernel Balances RAM and Swap"
date: 2026-08-01T20:04:43Z
draft: false
description: "A deep dive into how the Linux kernel balances physical RAM and swap to keep demanding workloads, LLM inference, and multi-tasking environments alive."
tags: ["Kernel", "Linux", "GNU/Linux", "Swappiness", "Ubuntu", "RAM", "SWAP", "LLM", "SSD"]
categories: ["Linux", "Kernel", "Performance"]
cover:
  image: "https://gui13go.github.io/images/out-of-ram-cover.png"
  alt: "Out of RAM, Not Out of Luck"
  caption: "Linux Kernel Memory Management & Swap Strategies"
  relative: false
canonicalURL: "https://guilhermeviegas.substack.com/p/out-of-ram-not-out-of-luck"
---

If you do any serious data analysis, local engineering, or web research, you know the specific terror of a freezing Linux desktop.

It usually starts subtly: audio playing in a background tab begins to stutter, the mouse cursor becomes sluggish, and your terminal stops responding to keystrokes. Before you know it, the system enters a thrashing spiral, forcing you to reach for the physical power button.

For a long time, my daily workflow on Ubuntu was plagued by this exact cycle. Between holding dozens (sometimes hundreds) of heavy Chrome tabs open and loading massive multi-gigabyte datasets into memory using Python or R, my physical RAM would vanish within a few hours. The result? **Restarting the machine multiple times a day just to get a responsive system back.**

The assumption is often: “I just need to buy more physical RAM.” But while more hardware helps, the underlying issue is how the Linux kernel manages physical memory and swap space when memory pressure hits peak levels. By configuring adequate swap space and tuning kernel parameters, you can eliminate system lockups entirely.

Here is a brief introduction to the Linux kernel’s memory management mechanics and a practical guide to configuring, expanding, and tuning swap on Ubuntu.

### 1. Under the Hood: How Linux Handles Memory Pressure

To understand why your machine freezes when RAM runs low, you have to look at how the kernel categorizes physical memory pages:
- **File-backed pages (Page Cache):** Cached data from disk (files, binaries, libraries). Reclaiming these is cheap—the kernel can simply discard them if they haven’t been modified, because it can re-read them from disk whenever needed.
- **Anonymous memory:** Memory allocated directly by processes for dynamic data structures (e.g., your Python dataframes, R objects, or JavaScript heap inside a browser tab). These pages have no backing file on disk.

When physical RAM fills up, the Linux kernel must reclaim memory to satisfy new allocations. If you have **no swap space** (or very little), the kernel cannot page out anonymous memory. Its only choice is to aggressively strip away the page cache.

Once the page cache is completely depleted, every single disk access—opening a menu, switching tabs, running a shell command—requires reading raw binaries directly from your SSD/HDD. The CPU spends 99% of its time waiting for I/O operations (I/O wait). This state is called **thrashing**, and to the end-user, it looks like a hard freeze. If memory pressure escalates further, the Out-Of-Memory (OOM) killer kicks in and starts forcibly killing processes.

**The Fix:** Adequate swap space gives the kernel a safety valve. It can move cold, inactive anonymous pages (like that idle Chrome tab from 3 hours ago) out of physical RAM and onto disk, preserving physical RAM for active processing threads and vital page caches.

### 2. Diagnose Your Current Memory & Swap Setup

Before altering your system configuration, inspect your current memory usage, swap allocation, and swapping behavior.

Check Current Memory and Swap:

```bash
free -h
```

Inspect Active Swap Devices (swap partition vs. swap file):

```bash
swapon --show
```

Monitor Real-Time Memory & Swap Activity:

```bash
vmstat 1 5
```

### 3. Expand Your Swap Memory on Ubuntu

If your default swap is only 2GB or 4GB, a heavy dataset will easily saturate it. Expanding your swap space to 16GB or 32GB (depending on your disk space) provides enough buffer to keep demanding workloads alive.

Here is how to safely replace or increase a swap file on Ubuntu without rebooting:

Turn Off Existing Swap

```bash
sudo swapoff -a
```

Allocate a New Swap File

```bash
sudo fallocate -l 16G /swapfile
```

Note: If your filesystem is btrfs or fallocate causes issues, use dd instead:

```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=16384 status=progress
```

Secure File PermissionsSwap files must be strictly readable/writable only by root to prevent security vulnerabilities:

```bash
sudo chmod 600 /swapfile
```

Formats the file into a Swap area

```bash
sudo mkswap /swapfile
```

Activate the New Swap

```bash
sudo swapon /swapfile
```

Verify the Expansion

```bash
free -h
swapon --show
```

Make the Swap Permanent Across RebootsCheck if /swapfile is already registered in /etc/fstab:

```bash
cat /etc/fstab | grep swap
```

If it isn’t listed, append it:

```bash
echo ‘/swapfile none swap sw 0 0’ | sudo tee -a /etc/fstab
```

### 4. Fine-Tuning Kernel Behavior (swappiness)

Now that you have enough swap capacity, you must instruct the kernel how to use it. This is controlled via the `vm.swappiness` parameter.

A common misconception is that `swappiness=60` means “start swapping when RAM reaches 60% capacity.” This is incorrect.

`swappiness` is a relative ratio value ranging from 0 to 200 (in modern kernels) that tells the kernel how aggressively to reclaim **anonymous pages vs. file cache**:

## Swap Tendency ≈ swappiness

- **High**`swappiness`**(e.g., 60–100):** The kernel actively swaps out idle, inactive memory pages to disk early, preserving your file/page cache in physical RAM.
- **Low**`swappiness`**(e.g., 10–20):** The kernel avoids swapping anonymous pages at all costs, discarding page cache instead. This often leads to system stalls when RAM runs low because page caches disappear completely.

Check Current Swappiness

```bash
cat /proc/sys/vm/swappiness
```

(Ubuntu defaults to 60)
Test a New Value ImmediatelyTo change swappiness to 20 without rebooting:

```bash
sudo sysctl vm.swappiness=20
```

Make swappiness PermanentAdd or update the value in /etc/sysctl.conf:

```bash
echo "vm.swappiness=20" | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl --system
```

### 5. When It Comes to LLMs

If your GPU (VRAM) or system RAM has just enough capacity to hold a model (e.g., a 7B or 14B model), running inference will push your system to its limit.

When you run an LLM alongside memory-heavy desktop tasks (like browser tabs, IDEs, or compilation jobs):
- **What Swap Does:** The Linux kernel moves cold, inactive desktop applications (like background Chrome tabs or Slack) out of physical RAM and into Swap.
- **The Result:** Your physical RAM remains free for the active LLM processes and its KV-cache, **preventing Out-Of-Memory (OOM) crashes** without tanking your text-generation speed.

Though, if you try to load a model that is **larger than your physical memory** (e.g., trying to run a 32GB model on a system with only 16GB of RAM + 32GB of Swap), the behavior changes drastically.

During LLM inference, **every single token generated requires a full forward pass through 100% of the model’s weights**.
- **The Bottleneck:** If active weights reside in Swap on an NVMe SSD (capable of ~3–7 GB/s), the CPU must wait for disk I/O on every single token, compared to system RAM (~30–60 GB/s) or VRAM (~300–1000 GB/s).
- **The Performance Hit:** Instead of getting 20–30 tokens per second, generation speed will drop to 0.1 to 1 token per second (or worse), causing severe disk thrashing.

By increasing your swap file size and tuning swappiness, you transform system behavior under heavy load: instead of hard-freezing and requiring a reboot, your system gracefully pages out idle processes, keeping your active datasets, IDE, and LLMs responsive.

Thanks for reading! Subscribe for free to receive new posts and support my work.