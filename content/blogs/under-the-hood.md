---
title: "Under the Hood: A Guide to Inspecting Hardware, OS, and Networks"
date: 2026-09-13T15:30:00Z
draft: true
description: "A comprehensive deep dive into probing, diagnosing, and benchmarking your Linux system—from CPU topologies and physical RAM to NVMe storage, PCI buses, network interfaces, and modern GPU accelerators."
tags: ["Linux", "Hardware", "CLI", "SysAdmin", "DevOps", "RAM", "Networking", "GPU", "Storage", "Benchmarking"]
categories: ["Linux", "Systems Architecture", "Performance"]
cover:
  image: "/images/under_the_hood_cover.jpeg"
  alt: "Under the Hood: A Guide to Inspecting Hardware, OS, and Networks"
  caption: "Under the Hood: Inspecting Hardware, OS, and Networks in GNU/Linux"
  relative: false
---

Modern software development often treats the underlying computer as an abstract cloud entity with boundless CPU and memory. But whether you are deploying microservices in containers, fine-tuning large language models, troubleshooting high-latency database queries, or setting up a high-performance bare-metal workstation, **software always runs on physical silicon, memory traces, PCIe lanes, and network packets.**

When performance craters, memory pressure mounts, or a device refuses to communicate, high-level tools cannot save you. You must know how to peel back the operating system abstractions and speak directly to the hardware.

Fortunately, GNU/Linux is the most transparent operating system ever engineered. Through a combination of virtual filesystems (`/proc`, `/sys`, `/dev`), kernel system calls, and standardized user-space diagnostic utilities, Linux exposes every clock cycle, thermal diode, memory channel, and bus transfer to anyone who knows where to look.

This guide provides an exhaustive, practical walkthrough for probing, inspecting, and diagnosing every layer of your physical and virtual machine.

```
+-----------------------------------------------------------------------+
|                       USER-SPACE DIAGNOSTIC TOOLS                     |
| (lscpu, dmidecode, free, lsblk, smartctl, ip, ss, nvidia-smi, inxi)   |
+-----------------------------------+-----------------------------------+
                                    |
                    Kernel System Calls & Virtual Files
                                    |
+-----------------------------------v-----------------------------------+
|                            LINUX KERNEL                               |
|   /proc (Process & Memory)   |   /sys (Sysfs Device Tree & Buses)     |
|   /dev (Device Nodes)        |   Kernel Drivers & Netlink Sockets     |
+-----------------------------------+-----------------------------------+
                                    |
                          Direct Hardware Bus / PHY
                                    |
+-----------------------------------v-----------------------------------+
|                         PHYSICAL HARDWARE                             |
|  CPU & Caches  |  DDR4/5 RAM  |  NVMe/SATA Disks  |  NICs  |  GPUs    |
+-----------------------------------------------------------------------+
```

---

## 1. Central Processing Unit (CPU) & Architecture

The Central Processing Unit (CPU) is the computation core of your system. Probing the CPU reveals not just clock speeds and core counts, but instruction set extensions, cache hierarchies, NUMA topologies, and hardware security mitigations.

### Architecture Overview with `lscpu`

The quickest and most informative way to inspect your processor is `lscpu`. It collects data from `sysfs` (`/sys/devices/system/cpu/`) and formats it into a human-readable summary:

```bash
lscpu
```

Key fields to examine in the output:

* **Architecture & Byte Order:** Typically `x86_64` (Little Endian) or `aarch64` (ARM64).
* **CPU(s):** Total logical processing units available to the kernel.
* **Thread(s) per core:** Indicates Simultaneous Multithreading (SMT / Hyper-Threading). If this is `2`, each physical core handles two hardware execution threads.
* **Core(s) per socket:** Physical execution cores per CPU package.
* **Socket(s):** Physical CPU chips installed on the motherboard (common in multi-socket servers).
* **Virtualization:** Look for `VT-x` (Intel) or `AMD-V` (AMD). Without these hardware virtualization flags, hypervisors like KVM, QEMU, or VirtualBox will fall back to slow software emulation.
* **Vulnerabilities:** Modern kernels report active hardware mitigations (e.g., `Meltdown`, `Spectre v1/v2`, `Retbleed`, `Gather data sampling`).

```
Architecture:             x86_64
  CPU op-mode(s):         32-bit, 64-bit
  Address sizes:          48 bits physical, 48 bits virtual
  Byte Order:             Little Endian
CPU(s):                   16
  On-line CPU(s) list:    0-15
Vendor ID:                AuthenticAMD
  Model name:             AMD Ryzen 7 7800X3D 8-Core Processor
    Thread(s) per core:   2
    Core(s) per socket:   8
    Socket(s):            1
Caches (sum of all):      
  L1d:                    256 KiB (8 instances)
  L1i:                    256 KiB (8 instances)
  L2:                     8 MiB (8 instances)
  L3:                     96 MiB (1 instance)
Virtualization features:  
  Virtualization:         AMD-V
```

### Cache Topology: L1, L2, and L3

Memory access latency increases by orders of magnitude as data moves from on-die caches to physical RAM. Modern CPUs feature a multi-tiered hierarchy:
* **L1 Cache (Split into L1i and L1d):** Fastest access (~1 ns, 3-5 CPU cycles). Dedicated to each physical core for instructions (i) and data (d).
* **L2 Cache:** Larger, low-latency cache (~3-4 ns, 12-14 cycles), usually dedicated per core.
* **L3 Cache:** Shared across all cores in a Core Complex (CCX) or socket (~10-20 ns). High-capacity L3 caches (like AMD's 3D V-Cache) dramatically reduce memory trips for database and gaming workloads.

To view the exact cache topology and how cores share them:

```bash
lscpu -C
```

```
NAME ONE-SIZE ALL-SIZE WAYS TYPE        LEVEL SETS PHY-LINE COH-SIZE
L1d       32K     256K    8 Data            1   64        1       64
L1i       32K     256K    8 Instruction     1   64        1       64
L2         1M       8M    8 Unified         2 2048        1       64
L3        96M      96M   16 Unified         3 98304       1       64
```

### Direct Kernel Telemetry: `/proc/cpuinfo`

When you need programmatic access to per-core data or want to verify specific instruction extensions (such as `avx512`, `aes`, or `sse4_2`):

```bash
cat /proc/cpuinfo
```

Check if your CPU supports hardware AES encryption acceleration:

```bash
grep -m1 -E "flags.*aes" /proc/cpuinfo && echo "Hardware AES is supported"
```

Check for Advanced Vector Extensions (vital for vectorized math and local LLM tensor operations):

```bash
grep -m1 -E "flags.*(avx|avx2|avx512)" /proc/cpuinfo
```

### CPU Frequency Scaling & Governors

Modern CPUs dynamically scale clock frequency to balance thermal dissipation and performance. The active CPU frequency governor controls how aggressively the kernel ramps up clocks:

```bash
# Check current governor across all cores
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor | sort | uniq -c
```

Common governors include:
* `performance`: Locks CPU at maximum boost frequencies for lowest latency.
* `powersave`: Prioritizes power conservation (on modern Intel/AMD P-state drivers, acts as a dynamic scaler balanced toward efficiency).
* `schedutil`: Adjusts frequency directly based on CFS scheduler utilization metrics.

To inspect live clock frequencies in real-time across all cores:

```bash
watch -n 1 "grep 'cpu MHz' /proc/cpuinfo"
```

---

## 2. Memory (RAM): Physical DIMMs, Caching, and Virtual Memory

Memory issues are among the most common root causes of production server instability. Diagnosing memory requires distinguishing between **physical silicon** (slots, speeds, timings) and **virtual memory** (buffers, page caches, anonymous allocations, swap).

```
+---------------------------------------------------------------+
|                      TOTAL PHYSICAL RAM                       |
+-------------------------------+-------------------------------+
|       RESERVED / USED         |       AVAILABLE MEMORY        |
|  Kernel + Process Anonymous   |  Free Pages + Reclaimable     |
|  Memory (Programs, Daemons)   |  Page Cache & Inactive Slabs  |
+-------------------------------+-------------------------------+
```

### Physical DIMM Inspection with `dmidecode`

Most users know `free`, but `free` only shows what the kernel manages. It cannot tell you if your memory sticks are running in dual-channel mode, what their rated speeds are, or if an empty RAM slot is available for an upgrade.

`dmidecode` reads the Desktop Management Interface (DMI) / SMBIOS table directly from motherboard firmware (requires root):

```bash
sudo dmidecode -t memory
```

To extract a clean summary of installed physical modules:

```bash
sudo dmidecode -t memory | grep -E "Size:|Type:|Speed:|Manufacturer:|Part Number:|Locator:" | grep -v "No Module Installed"
```

Sample output:

```
Locator: DIMM_A2
Size: 32 GB
Type: DDR5
Speed: 6000 MT/s
Manufacturer: Corsair
Part Number: CMK64GX5M2B6000C30
Locator: DIMM_B2
Size: 32 GB
Type: DDR5
Speed: 6000 MT/s
Manufacturer: Corsair
Part Number: CMK64GX5M2B6000C30
```

> [!TIP]
> **Check Speed vs. Configured Clock:** If your RAM is rated for 6000 MT/s but `Speed:` reports 4800 MT/s, your system is running at default JEDEC speeds. You likely need to enable **XMP** (Intel) or **EXPO** (AMD) inside your motherboard UEFI BIOS.

### Real-Time Memory Telemetry: `free -h`

To understand operating memory state, run:

```bash
free -h
```

Output:

```
               total        used        free      shared  buff/cache   available
Mem:            62Gi        14Gi        32Gi       1.2Gi        16Gi        46Gi
Swap:           32Gi       256Mi        31Gi
```

#### The Golden Rule: Look at `available`, not `free`!
* **`total`:** Total physical RAM detected by the kernel (minus small reserved hardware address spaces).
* **`used`:** Memory actively consumed by user-space applications and kernel allocations.
* **`free`:** Completely untouched memory. In Linux, **free memory is wasted memory**. The kernel uses idle RAM to cache files read from disk.
* **`buff/cache`:** Memory holding file metadata (buffers) and disk blocks (page cache). If an application requests memory, the kernel drops these clean cached blocks instantaneously.
* **`available`:** **The single most important metric.** It is an estimation of how much memory can be allocated without causing the system to swap or thrash.

### Deep Memory Telemetry: `/proc/meminfo`

When troubleshooting Out-Of-Memory (OOM) events or memory leaks, inspect `/proc/meminfo`:

```bash
head -n 25 /proc/meminfo
```

Critical parameters to watch:
* `MemAvailable`: Kernel-calculated ceiling before memory exhaustion.
* `Dirty`: Memory waiting to be committed to disk. A high `Dirty` count under heavy disk write loads indicates storage bottlenecks.
* `AnonPages`: Anonymous memory mapped into processes (non-file backed). These pages *cannot* be discarded without being written to swap.
* `SReclaimable`: Slab cache allocations (directory entries and inodes) that can be reclaimed under memory pressure.

### Monitoring Memory Pressure & Swapping with `vmstat`

To watch real-time paging behavior without installing third-party tools:

```bash
vmstat 1 5
```

```
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0 262144 33554432 1024 16777216    0    0    12    45  120  240  4  2 94  0  0
```

* **`si` (Swap In) & `so` (Swap Out):** Amount of memory swapped from/to disk per second (in kB). If `si` and `so` are consistently non-zero, your machine is memory-starved and thrashing.
* **`wa` (I/O Wait):** Percentage of CPU time spent idling while waiting for disk I/O. A spike here alongside swap activity confirms storage-induced system freezes.

---

## 3. Storage & Block Devices: NVMe, SATA, and Health Telemetry

Understanding your storage topology ensures you do not mount a high-throughput database onto a slow mechanical drive, exhaust inodes, or miss an impending drive failure.

### Linux Storage Naming Conventions

Linux presents block devices in `/dev/` according to their bus controller:
* `/dev/nvmeXnY`: Non-Volatile Memory Express (PCIe SSD). `nvme0n1` represents Controller 0, Namespace 1. Partitions append `p`: `/dev/nvme0n1p1`.
* `/dev/sdX`: SATA/SCSI/SAS drives and standard USB flash sticks (`sda`, `sdb`, etc.). Partitions append digits directly: `/dev/sda1`.
* `/dev/vdX`: Virtual block devices managed by virtio inside KVM/QEMU virtual machines.
* `/dev/mmcblkX`: MultiMediaCard, SD card, or eMMC storage chips.

```
+---------------------------------------------------------------+
|                    PCIe / SATA CONTROLLER                     |
+---------------------------------------------------------------+
       |                                               |
       v                                               v
 /dev/nvme0n1 (Physical NVMe SSD)             /dev/sda (SATA Drive)
   |-- /dev/nvme0n1p1 (FAT32: /boot/efi)        |-- /dev/sda1 (ext4: /data)
   |-- /dev/nvme0n1p2 (ext4: /boot)             `-- /dev/sda2 (swap)
   `-- /dev/nvme0n1p3 (btrfs / LVM: /)
```

### Inspecting Block Device Hierarchy with `lsblk`

`lsblk` displays all accessible storage devices in a clear tree format. Use the `-f` flag to inspect filesystem types, labels, and UUIDs:

```bash
lsblk -o NAME,FSTYPE,FSVER,SIZE,FSAVAIL,FSUSE%,MOUNTPOINTS,MODEL
```

```
NAME        FSTYPE FSVER   SIZE FSAVAIL FSUSE% MOUNTPOINTS          MODEL
nvme0n1                    1.8T                                     Samsung SSD 990 PRO 2TB
├─nvme0n1p1 vfat   FAT32   512M  480.2M      6% /boot/efi           
├─nvme0n1p2 ext4   1.0       1G  620.4M     33% /boot               
└─nvme0n1p3 ext4   1.0     1.8T    1.2T     30% /                   
sda                        7.3T                                     WDC WD80EAZZ-00BKLB0
└─sda1      btrfs          7.3T    4.1T     43% /mnt/storage        
```

### Filesystem Capacity & Inodes: `df`

Check mounted storage usage in human-readable units:

```bash
df -hT -x tmpfs -x devtmpfs
```

> [!WARNING]
> **The Invisible Disk Full Trap: Inode Exhaustion**
> A disk can run out of space even if `df -h` shows hundreds of gigabytes free! Every file and directory on an `ext4` or `xfs` filesystem consumes an **inode**. If an application generates millions of tiny temporary files, all inodes will be consumed, causing every new write operation to fail with `No space left on device`.
>
> Always verify inode availability when debugging disk issues:
> ```bash
> df -i -x tmpfs -x devtmpfs
> ```

### Drive Health & SMART Telemetry: `smartctl`

Solid-State Drives and HDDs continuously monitor internal health indicators using S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology). The `smartmontools` package provides the `smartctl` command.

Check overall health status of an NVMe or SATA drive:

```bash
sudo smartctl -H /dev/nvme0n1
```

```
=== START OF READ SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED
```

To view full wear attributes, temperature history, and error logs:

```bash
sudo smartctl -A /dev/nvme0n1
```

For NVMe drives, inspect the specialized controller log using the official `nvme-cli` tool:

```bash
sudo nvme smart-log /dev/nvme0
```

Key NVMe metrics to inspect:
* `critical_warning`: Must be `0x00`. Any bit set indicates high temperature, backup memory failure, or read-only mode triggered by media failure.
* `temperature`: Real-time sensor reading in Celsius.
* `available_spare`: Percentage of reserved replacement blocks remaining (typically starts at 100%).
* `percentage_used`: Drive endurance indicator. 100% means the drive has reached its factory rated TBW (Terabytes Written). The drive continues to function past 100%, but failure probability rises.
* `media_errors`: Number of unrecoverable data integrity errors encountered by the controller. Should be `0`.

### Real-Time Storage I/O Performance: `iostat`

To diagnose disk bottlenecks and observe read/write latency:

```bash
iostat -xz 1 3
```

```
Device            r/s     w/s     rkB/s     wkB/s  r_await  w_await  aqu-sz  %util
nvme0n1          2.00   85.00     32.00   4520.00     0.08     0.42    0.04   2.10
sda              0.00    1.00      0.00     12.00     0.00     8.50    0.01   0.40
```

* **`r_await` & `w_await`:** Average time (in milliseconds) for read and write requests to be served. On modern NVMe SSDs, this should be sub-millisecond (< 1.0 ms). Values above 20 ms on mechanical disks or 5 ms on SSDs indicate severe I/O queuing.
* **`%util`:** Percentage of elapsed time during which the device was servicing requests. If `%util` approaches `100%`, your storage subsystem is fully saturated.

---

## 4. Networking: Interfaces, IP Addressing, Routing, and Sockets

Modern GNU/Linux networking is managed through the `iproute2` subsystem, which completely replaced the deprecated `net-tools` suite (`ifconfig`, `netstat`, `route`).

```
+---------------------------------------------------------------+
|                      NETWORK OSI LAYERS                       |
+---------------------------------------------------------------+
| Layer 4 (Transport): ss -tulnp (TCP/UDP Ports & Sockets)      |
| Layer 3 (Network):   ip addr, ip route (IPv4/IPv6, Gateways)  |
| Layer 2 (Data Link): ip link (MAC, MTU, Flags)                |
| Layer 1 (Physical):  ethtool (PHY Speed, Duplex, Auto-Neg)    |
+---------------------------------------------------------------+
```

### Physical Link Layer & Negotiation: `ethtool`

Before diagnosing IP configuration or firewall issues, confirm that the physical network interface controller (NIC) has established a healthy link with your switch or router:

```bash
# List physical interfaces
ip link show
```

To probe the hardware link details of a physical Ethernet adapter:

```bash
sudo ethtool enp5s0
```

```
Settings for enp5s0:
	Supported ports: [ TP ]
	Supported link modes:   10baseT/Half 10baseT/Full
	                        100baseT/Half 100baseT/Full
	                        1000baseT/Full
	                        2500baseT/Full
	Speed: 2500Mb/s
	Duplex: Full
	Auto-negotiation: on
	Port: Twisted Pair
	PHYAD: 0
	Transceiver: internal
	Link detected: yes
```

Key fields:
* **Speed:** Negotiated line rate (e.g., `1000Mb/s` for 1 Gbps, `2500Mb/s` for 2.5 Gbps). If your 1 Gbps switch port is negotiating down to `100Mb/s`, you have a damaged patch cable (often pin 4, 5, 7, or 8 broken) or faulty negotiation.
* **Duplex:** Must be `Full`. `Half` duplex causes packet collisions and throughput degradation.
* **Link detected:** Confirms physical carrier electrical signal.

### Network Layer: IP Addresses & Routing

To view all network interfaces and their assigned IPv4/IPv6 addresses in a compact, color-coded format:

```bash
ip -br -c addr show
```

```
lo               UNKNOWN        127.0.0.1/8 ::1/128 
enp5s0           UP             192.168.1.150/24 2001:db8::a1/64 fe80::a00:27ff:fe4e:66a1/64 
wlo1             DOWN           
docker0          UP             172.17.0.1/16 
```

Inspect the kernel routing table:

```bash
ip route show
```

```
default via 192.168.1.1 dev enp5s0 proto dhcp src 192.168.1.150 metric 100 
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 
192.168.1.0/24 dev enp5s0 proto kernel scope link src 192.168.1.150 metric 100 
```

The `default via <IP>` line defines your **Default Gateway**—the router through which all external internet traffic passes. The `metric` determines route priority if multiple interfaces (e.g., Ethernet and Wi-Fi) are active simultaneously (lower values take precedence).

### Transport Layer: Sockets & Ports with `ss`

The `ss` (socket statistics) utility displays network connections, open listening ports, and socket states with unmatched speed.

To find all services actively listening for incoming TCP and UDP connections, along with the process names and PIDs:

```bash
sudo ss -tulnp
```

Breakdown of flags:
* `-t`: TCP sockets.
* `-u`: UDP sockets.
* `-l`: Show only listening sockets (servers waiting for connections).
* `-n`: Do not resolve port numbers to service names (shows `:80` instead of `:http`, preventing slow DNS timeouts).
* `-p`: Show the process owning the socket (requires root/sudo).

```
Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process                                     
tcp    LISTEN  0       128            0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=1042,fd=3))              
tcp    LISTEN  0       511            0.0.0.0:80          0.0.0.0:*      users:(("nginx",pid=1850,fd=6))             
tcp    LISTEN  0       4096     127.0.0.1:5432          0.0.0.0:*      users:(("postgres",pid=1210,fd=7))          
```

To see all established external connections and their transfer states:

```bash
ss -tan state established
```

### DNS Resolution & Nameservers

If network pings to IP addresses (`ping 1.1.1.1`) work, but domain queries (`ping google.com`) fail, DNS resolution is broken. On modern systemd-based distributions (Ubuntu, Debian, Fedora, Arch), DNS is managed by `systemd-resolved`:

```bash
resolvectl status
```

This displays the active DNS servers assigned to each network interface, whether DNSSEC is enabled, and current search domains.

To benchmark DNS lookup latency and inspect authoritative responses:

```bash
dig @1.1.1.1 google.com +stats | grep -E "Query time:|SERVER:"
```

---

## 5. Graphics Processing Units (GPUs) & Compute Accelerators

GPUs are no longer simple display adapters; they are high-throughput parallel compute engines essential for machine learning, 3D rendering, scientific simulations, and hardware-accelerated video transcode pipelines.

```
+---------------------------------------------------------------+
|                       GPU ARCHITECTURE                        |
+---------------------------------------------------------------+
| Display / 3D Graphics: OpenGL, Vulkan, Direct3D (Mesa/DXVK)   |
| Compute / GPGPU:       CUDA, ROCm, OpenCL, SYCL               |
| Kernel Subsystem:      DRM (Direct Rendering Manager) & KMS   |
| Hardware Bus:          PCIe x16 / NVLink Interconnect         |
+---------------------------------------------------------------+
```

### Detecting the GPU on the PCIe Bus

First, verify that the Linux kernel physically recognizes the graphics card on the PCI Express bus, and check which kernel driver is bound to it:

```bash
lspci -nnk | grep -i -A3 -E "vga|3d|display"
```

```
01:00.0 VGA compatible controller [0300]: NVIDIA Corporation AD104 [GeForce RTX 4070 SUPER] [10de:2783] (rev a1)
	Subsystem: ASUSTeK Computer Inc. Device [1043:88ea]
	Kernel driver in use: nvidia
	Kernel modules: nvidiafb, nouveau, nvidia_drm, nvidia
```

Key things to look for:
* **Vendor & Device ID:** `[10de:2783]`. `10de` is NVIDIA (AMD is `1002`, Intel is `8086`).
* **Kernel driver in use:** Confirms driver binding:
  * For NVIDIA: Should be `nvidia`. If it says `nouveau`, the proprietary driver is not loaded and you are running on the reverse-engineered open-source driver (which lacks full compute acceleration and clock management on modern architectures).
  * For AMD: Should be `amdgpu`.
  * For Intel: Should be `i915` (legacy/integrated) or `xe` (modern Arc discrete & Lunar Lake).

### NVIDIA Telemetry: `nvidia-smi`

For NVIDIA GPUs, the System Management Interface (`nvidia-smi`) provides real-time telemetry on VRAM, thermals, power draw, and process utilization:

```bash
nvidia-smi
```

```
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 550.54.14              Driver Version: 550.54.14      CUDA Version: 12.4     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4070...     Off |   00000000:01:00.0  On |                  N/A |
|  0%   42C    P8             12W /  220W |    1420MiB /  12282MiB |      2%      Default |
+-----------------------------------------+------------------------+----------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      1450      G   /usr/bin/gnome-shell                          420MiB |
|    0   N/A  N/A      9820      C   python3 train_model.py                       1000MiB |
+-----------------------------------------------------------------------------------------+
```

#### Querying GPU Telemetry for Automation Scripts
You can query specific GPU metrics formatted as clean CSV values for monitoring scripts or logging:

```bash
nvidia-smi --query-gpu=timestamp,name,temperature.gpu,utilization.gpu,utilization.memory,memory.used,memory.total,power.draw --format=csv -l 1
```

### AMD Telemetry: `rocm-smi` & `radeontop`

For AMD Radeon hardware:
* **ROCm Compute Cards:** Use `rocm-smi` to display GPU clocks, temperature, power, and memory utilization.
* **Gaming & Workstation Graphics:** Use `radeontop` to monitor real-time 3D, shader, vertex, and texture engine loads:

```bash
sudo radeontop
```

### Universal Interactive GPU Monitoring: `nvtop`

`nvtop` (Neat Video Top) is an interactive, multi-vendor GPU status monitor inspired by `htop`. It automatically supports NVIDIA, AMD (AMDGPU), Intel (i915/xe), and Apple Silicon:

```bash
# Install on Debian/Ubuntu
sudo apt install nvtop

# Run
nvtop
```

It draws real-time terminal graphs showing GPU engine load, memory consumption, temperature, and a per-process list sorted by GPU resource usage.

---

## 6. Motherboard, Buses, Firmware, and Peripherals

The motherboard is the physical spine coordinating power delivery, clock generation, and high-speed data buses across your components.

### Motherboard & BIOS Telemetry with `dmidecode`

To inspect motherboard manufacturer, product revision, and firmware version:

```bash
# Motherboard Details
sudo dmidecode -t baseboard
```

```
Base Board Information
	Manufacturer: ASUSTeK COMPUTER INC.
	Product Name: ROG STRIX B650E-F GAMING WIFI
	Version: Rev 1.xx
	Serial Number: 230918239012391
```

```bash
# BIOS / UEFI Details
sudo dmidecode -t bios
```

```
BIOS Information
	Vendor: American Megatrends Inc.
	Version: 2413
	Release Date: 02/06/2024
	BIOS Revision: 5.26
```

> [!TIP]
> **Querying Hardware Identity Without Root:**
> If you do not have `sudo` privileges, you cannot run `dmidecode`. However, the Linux kernel exposes readable DMI information directly through `sysfs`:
> ```bash
> cat /sys/class/dmi/id/board_vendor
> cat /sys/class/dmi/id/board_name
> cat /sys/class/dmi/id/bios_version
> cat /sys/class/dmi/id/product_name
> ```

### PCI Bus Hierarchy: `lspci -tv`

Every graphics card, NVMe controller, audio chipset, and network adapter connects via the Peripheral Component Interconnect Express (PCIe) bus. To visualize the complete PCIe topology, root complexes, bridges, and lanes:

```bash
lspci -tv
```

```
-[0000:00]-+-01.1-[01]--+-00.0  NVIDIA Corporation AD104 [GeForce RTX 4070 SUPER]
           |            \-00.1  NVIDIA Corporation Device 22bc
           +-01.2-[02]----00.0  Samsung Electronics Co Ltd NVMe SSD Controller PM9A1/980
           +-14.0  Advanced Micro Devices, Inc. [AMD] FCH USB XHCI Controller
           +-18.3  Advanced Micro Devices, Inc. [AMD] Device 14e3
```

### USB Bus Hierarchy & Transfer Rates: `lsusb -tv`

USB devices operate across wildly different protocol speeds, from legacy USB 1.1 (1.5 Mbps) to USB 3.2 Gen 2x2 (20 Gbps) and USB4 (40 Gbps). If a high-speed external SSD or capture card performs poorly, it may be negotiating at USB 2.0 speeds due to a poor cable or port mismatch.

Inspect the USB tree and negotiated speeds:

```bash
lsusb -tv
```

```
/:  Bus 02.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/4p, 10000M
    |__ Port 1: Dev 2, If 0, Class=Mass Storage, Driver=uas, 10000M
/:  Bus 01.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/4p, 480M
    |__ Port 2: Dev 3, If 0, Class=Human Interface Device, Driver=usbhid, 12M
```

Notice the speed tags:
* `10000M`: 10 Gbps (USB 3.2 Gen 2) - running optimal UASP storage driver.
* `480M`: 480 Mbps (USB 2.0 High-Speed).
* `12M`: 12 Mbps (USB 1.1 Full-Speed) - typical for mice and keyboards.

### Hardware Diagnostic Events: `dmesg`

When a device connects, disconnects, fails, or throws a hardware bus fault, the kernel logs the event to the kernel ring buffer. Filter the log for warnings and errors:

```bash
sudo dmesg -T --level=err,warn
```

Filter specifically for USB or storage connection events:

```bash
sudo dmesg -T | grep -E -i "usb|nvme|ata|pci" | tail -n 25
```

---

## 7. Thermals, Sensors, and Power Management

Hardware throttling is one of the most frustrating performance killers. A high-end CPU or GPU running inside an unventilated chassis will silently reduce its clock multipliers to avoid thermal destruction.

### Thermal Monitoring with `sensors`

The `lm-sensors` package reads hardware monitoring chips (IT87, NCT6775, etc.) and CPU core thermal diodes:

```bash
# First-time setup (run once to probe hardware sensor buses)
sudo sensors-detect --auto

# View real-time temperatures and voltages
sensors
```

```
k10temp-pci-00c3
Adapter: PCI adapter
Tctl:         +48.2°C  
Tccd1:        +45.0°C  

nvme-pci-0100
Adapter: PCI adapter
Composite:    +41.9°C  (low  = -273.1°C, high = +81.8°C)
                       (crit = +84.8°C)

nct6798-isa-0290
Adapter: ISA adapter
in0:           1.12 V  
fan1:        1240 RPM
fan2:         850 RPM
SYSTIN:       +36.0°C  (high = +80.0°C, hyst = +75.0°C)
CPUTIN:       +44.5°C  (high = +80.0°C, hyst = +75.0°C)
```

Look closely at `high` and `crit` thresholds. If your current temperature approaches `crit`, the hardware is throttling clock frequencies or preparing an emergency thermal shutdown (`PROCHOT`).

### Laptop Battery Health: `upower`

To inspect physical battery wear and discharge rates on laptops:

```bash
# Identify power devices
upower -e

# Query battery telemetry
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

Key fields to check:
* **`energy-full` vs `energy-full-design`:** Comparing current full capacity against original factory capacity indicates battery degradation.
* **`energy-rate`:** Current instantaneous power draw in Watts.
* **`capacity`:** Overall battery health percentage.

---

## 8. Unified Profiling: The SysAdmin's Swiss Army Knife

Rather than running ten individual commands, modern Linux systems offer all-in-one profiling utilities that aggregate system telemetry into structured summaries or interactive dashboards.

### The Gold Standard System Snapshot: `inxi`

`inxi` is the most versatile hardware reporting script available on Linux. It produces complete, highly readable summaries with automatic privacy masking of serial numbers, MAC addresses, and external IPs:

```bash
# Complete system summary with filtered sensitive data
inxi -Fz
```

```
System:
  Kernel: 6.8.0-45-generic arch: x86_64 bits: 64
  Console: pty pts/1 Distro: Ubuntu 24.04 LTS (Noble Numbat)
Machine:
  Type: Desktop Mobo: ASUSTeK model: ROG STRIX B650E-F GAMING WIFI v: Rev 1.xx
    serial: <filter> UEFI: American Megatrends v: 2413 date: 02/06/2024
CPU:
  Info: 8-core model: AMD Ryzen 7 7800X3D bits: 64 type: MT MCP cache:
    L2: 8 MiB L3: 96 MiB
  Speed (MHz): avg: 4200 min/max: 3000/5050 cores: 16
Graphics:
  Device-1: NVIDIA AD104 [GeForce RTX 4070 SUPER] driver: nvidia v: 550.54.14
  Display: server: X.Org v: 1.21.1.11 with: Xwayland v: 23.2.6 driver: X:
    loaded: nvidia gpu: nvidia,nvidia-nvswitch resolution: 2560x1440~144Hz
Audio:
  Device-1: NVIDIA AD104 HDMI Audio driver: snd_hda_intel
Network:
  Device-1: Intel Ethernet I225-V driver: igc
  IF: enp5s0 state: up speed: 2500 Mbps duplex: full mac: <filter>
Drives:
  Local Storage: total: 9.1 TiB used: 3.8 TiB (41.8%)
  ID-1: /dev/nvme0n1 vendor: Samsung model: SSD 990 PRO 2TB size: 1.82 TiB
  ID-2: /dev/sda vendor: Western Digital model: WD80EAZZ size: 7.28 TiB
Partition:
  ID-1: / size: 1.79 TiB used: 540 GiB (29.5%) fs: ext4 dev: /dev/nvme0n1p3
Swap:
  ID-1: swap-1 type: zram size: 32 GiB used: 120 MiB (0.4%) dev: /dev/zram0
Sensors:
  System Temperatures: cpu: 48.0 C mobo: 36.0 C gpu: nvidia temp: 42 C
  Fan Speeds (RPM): cpu: 1240 fan-1: 850
```

### Complete Hardware Inventory: `lshw`

To generate a hierarchical inventory of all hardware components:

```bash
# Concise hardware profile
sudo lshw -short
```

You can even export your system configuration as a structured HTML or JSON report for fleet auditing:

```bash
sudo lshw -html > system_audit.html
```

### Real-Time Interactive Monitoring: `btop`

If you want a modern, graphical terminal monitor that unifies CPU cores, memory/swap, disk activity, network throughput, and GPU utilization:

```bash
sudo apt install btop   # Ubuntu/Debian
btop
```

Featuring mouse support, responsive vector graphs, and responsive keybindings, `btop` has largely superseded older monitors like `top` and `glances` for interactive daily debugging.

---

## 9. Quick Reference Diagnostic Matrix

Keep this cheat sheet handy whenever you need to probe a specific hardware or networking subsystem:

| Diagnostic Question | Primary Command | Key Flags / Files | Root / Sudo? |
| :--- | :--- | :--- | :---: |
| **What CPU and cache levels do I have?** | `lscpu` | `-C` (caches), `-e` (core list) | No |
| **Are CPU vulnerability patches active?** | `lscpu` | Look under `Vulnerabilities` | No |
| **What physical RAM sticks are installed?** | `dmidecode` | `-t memory` | **Yes** |
| **How much RAM is safely available?** | `free` | `-h` (inspect `available`) | No |
| **Are disks swapping or thrashing?** | `vmstat` | `1 5` (inspect `si`, `so`, `wa`) | No |
| **What block devices and mount points exist?** | `lsblk` | `-f` (filesystems, UUIDs) | No |
| **Are any filesystems out of disk space?** | `df` | `-hT` (space), `-i` (inodes) | No |
| **Is an SSD or HDD failing?** | `smartctl` | `-a /dev/<device>`, `-H` (health) | **Yes** |
| **What NVMe wear / temperature is logged?** | `nvme` | `smart-log /dev/nvme0` | **Yes** |
| **What physical link speed is negotiated?** | `ethtool` | `<interface>` (Speed, Duplex) | **Yes** |
| **What are my IP addresses and gateways?** | `ip` | `-br -c addr`, `ip route` | No |
| **What processes listen on what ports?** | `ss` | `-tulnp` | **Yes** |
| **Which GPU kernel driver is running?** | `lspci` | `-nnk \| grep -i -A3 vga` | No |
| **What is my NVIDIA VRAM and power draw?** | `nvidia-smi` | `--query-gpu=...` (CSV mode) | No |
| **What motherboard and BIOS version is loaded?**| `dmidecode` | `-t baseboard`, `-t bios` | **Yes** |
| **What USB devices are connected at what speed?**| `lsusb` | `-tv` | No |
| **What are component temperatures and fan RPMs?**| `sensors` | Direct: `/sys/class/thermal/` | No |
| **Complete system overview with masked serials?**| `inxi` | `-Fz` | No |

---

## 10. Summary & Engineering Takeaways

Troubleshooting Linux hardware is not guesswork. It is a systematic process of deduction that moves from the physical layer up to the application interface:

1. **Verify Physical Existence:** Confirm the controller or device appears on the bus (`lspci`, `lsusb`, `dmidecode`).
2. **Verify Kernel Initialization:** Check that the kernel recognized the hardware, assigned a device node in `/dev/`, and bound an active driver module without errors (`dmesg`, `lspci -k`).
3. **Inspect Subsystem Telemetry:** Check operational parameters, link negotiation, and physical health attributes (`smartctl`, `ethtool`, `sensors`, `nvidia-smi`).
4. **Monitor Contention & Throughput:** Profile live resource consumption, latency, and wait states under real workloads (`vmstat`, `iostat`, `free`, `ss`, `btop`).

When you understand how the Linux kernel abstracts and interfaces with the underlying hardware, you transform from a user who simply executes commands into an engineer who truly knows their metal.
