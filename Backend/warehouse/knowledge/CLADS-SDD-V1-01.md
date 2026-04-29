# SOFTWARE DESIGN DESCRIPTION (SDD) - CLADS

---

## 1 INTRODUCTION
The CLADS Software Design Description (SDD) provides a detailed architectural and low-level design overview. It describes the implementation of an Integrated Modular Avionics (IMA) node capable of hosting multiple Design Assurance Level (DAL) applications with strict time and space partitioning.

---

### 1.1 Scope
This document details the internal software architecture, RTOS configuration, and partition management for the CLADS. It focuses on the rendering pipeline, the GPU health monitoring interface, and the high-speed data bus drivers required for panoramic visualization.

---

### 1.2 Acronyms and Abbreviations

| Abbreviation | Description |
|--------------|-------------|
| SDD | Software Design Description |
| RTOS | Real-Time Operating System |
| HAL | Hardware Abstraction Layer |
| AFDX | Avionics Full-Duplex Switched Ethernet |
| IMA | Integrated Modular Avionics |
| API | Application Programming Interface |
| SVS | Synthetic Vision System |

---

### 1.3 Referenced Documents

#### 1.3.1 External Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178C | - |
| 2 | ARINC 653 Software Specification | ARINC 653 | - |

#### 1.3.2 Internal Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | SyRS | CLADS-SyRS-V1.0 | 1.0 |
| 2 | SRS | CLADS-SRS-V1.0 | 1.0 |

---

## 2 SOFTWARE ARCHITECTURE

### 2.1 Software Hierarchy
The CLADS software architecture follows a layered approach to ensure DAL A compliance and modularity:

1. **Hardware Abstraction Layer (HAL):** Low-level drivers for 10GbE, AFDX, and GPU register access.
2. **ARINC 653 RTOS Layer:** Manages time and space partitioning for software applications.
3. **Core Graphics Engine:** Anti-aliased rendering pipeline optimized for the 20x8 inch display surface.
4. **Partitioned Applications:**
    - **PFD Partition (DAL A):** Primary flight symbology and safety-critical alerts.
    - **SVS/Mission Partition (DAL C):** Synthetic vision and moving maps.
    - **Monitor Partition (DAL A):** GPU heartbeat generation and health status reporting.

### 2.2 Task Scheduling (ARINC 653)
The system utilizes cyclic scheduling to ensure deterministic performance of critical displays.

| Partition | Frequency | Duration (Time Slice) | Criticality |
|-----------|-----------|-----------------------|-------------|
| PFD_CORE  | 60 Hz     | 8.0 ms               | DAL A       |
| SVS_GEN   | 30 Hz     | 4.0 ms               | DAL C       |
| I_O_MGMT  | 100 Hz    | 2.0 ms               | DAL A       |
| MONITOR   | 10 Hz     | 1.0 ms               | DAL A       |

---

## 3 DETAILED DESIGN

### 3.1 Redundancy and Health Monitoring
The software design incorporates a "GPU Heartbeat" mechanism:
- **Heartbeat Generation:** The software rendering task writes a unique, incrementing token to a shared memory register at the end of every frame.
- **Independent Validation:** An external hardware monitor samples this register. If the token fails to update, the hardware bridge triggers a Red-X overlay.

### 3.2 Graphics Pipeline Design
The rendering engine is optimized for sub-frame latency:
- **Direct Video Ingest:** Sensor video from 10GbE interfaces is mapped directly to the graphics buffer via DMA (Direct Memory Access).
- **Sub-frame Processing:** Symbology overlays are rendered in a separate buffer and composited with video in less than 16.6ms.

---

## 4 INTERFACE DESIGN

### 4.1 Communication Drivers
- **AFDX Stack:** Implements the full protocol stack for reliable message exchange with the IMA backbone.
- **10GbE Interface:** High-throughput driver for raw sensor video ingestion.

---

## 5 DESIGN TRACEABILITY

**Table 5.1 : Traceability Matrix (SDD to SRS)**

| SDD Section | Design Element | SRS Requirement ID | Traceability Status |
|-------------|----------------|--------------------|---------------------|
| 2.1 | ARINC 653 RTOS | CLADS-SRS-001 | Traced |
| 2.2 | Deterministic Scheduler| CLADS-SRS-009 | Traced |
| 3.1 | Heartbeat Logic | CLADS-SRS-007 | Traced |
| 4.1 | 10GbE Stack | CLADS-SRS-011 | Traced |

---

## 6 MEMORY MAP & RESOURCE ALLOCATION

| Segment | Address Range | Purpose |
|---------|---------------|---------|
| KERNEL  | 0x00000000 - 0x001FFFFF | ARINC 653 Kernel & HAL |
| DAL_A_P | 0x00200000 - 0x04FFFFFF | Primary Flight Partition Space |
| VIDEO_B | 0x05000000 - 0x0FFFFFFF | Panoramic Framebuffer (20x8) |

---

## DOCUMENT CONTROL
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Design Description (SDD) |
| Document ID | CLADS-SDD-V1.0 |
| Product Name | CLADS Panoramic Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## REVISION HISTORY
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Software Design Baseline |

---
*End of Document*