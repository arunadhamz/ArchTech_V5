# SOFTWARE DESIGN DESCRIPTION (SDD) - PANTHR™

---

## 1 INTRODUCTION

The PANTHR™ Software Design Description (SDD) provides a low-level architectural view of the display’s software suite. This document details how the software requirements defined in the SRS are realized through specific software components, partition scheduling, and driver logic.

---

### 1.1 Scope
This document explains the internal software architecture and detailed design for the PANTHR™ Large Area Display. It covers the RTOS configuration, memory mapping, and the implementation of high-level features like multi-source video fusion and IR touch interaction.

---

### 1.2 Acronyms and Abbreviations

| Abbreviation | Description |
|--------------|-------------|
| SDD | Software Design Description |
| RTOS | Real-Time Operating System |
| HAL | Hardware Abstraction Layer |
| IPC | Inter-Partition Communication |
| DMA | Direct Memory Access |
| GPU | Graphics Processing Unit |
| FSBL | First Stage Bootloader |

---

### 1.3 Referenced Documents

#### 1.3.1 External Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178C | DAL A |
| 2 | Avionics Application Software Standard Interface | ARINC 653 | P1-3 |

#### 1.3.2 Internal Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | SyRS | PANTHR-SyRS-V1.0 | 1.0 |
| 2 | SRS | PANTHR-SRS-V1.0 | 1.0 |

---

## 2 SOFTWARE ARCHITECTURE

### 2.1 Software Hierarchy
The system utilizes a layered architecture to maintain strict isolation between safety-critical rendering and interface management.

1. **Hardware Abstraction Layer (HAL):** Interfaces with the dual-channel processing hardware and IR touch sensors.
2. **RTOS Kernel:** Manages time and space partitioning for fail-operational performance.
3. **Service Layer:** Implements standard APIs for I/O management and inter-process communication.
4. **Application Layer:** Contains the video fusion logic, gesture recognition engine, and GUI rendering.

### 2.2 Partitioning & Scheduling
The software utilizes a partitioned scheduling approach to ensure that high-fidelity graphics rendering does not interfere with critical system health monitoring.

| Partition | Function | Priority | Budget |
|-----------|----------|----------|--------|
| P1_Render | 2560x1024 Graphic & Video Fusion | High | 60ms |
| P2_Touch  | IR Gesture (Swipe/Pinch-Zoom) Logic | Medium | 20ms |
| P3_Health | Dual-Channel Redundancy & Health Monitor | High | 20ms |

---

## 3 DETAILED DESIGN

### 3.1 Multi-Source Video Fusion Logic
The software manages video inputs from up to four external sources. The design utilizes a centralized framebuffer approach where each source is mapped to a specific window within the 2560x1024 coordinate system. 
- **Alpha Blending:** Managed via hardware acceleration to allow overlay of graphics on top of sensor video.
- **Latency Control:** The pipeline is optimized to maintain a 33ms frame-to-glass latency.

### 3.2 IR Touch Gesture Recognition
The touch interaction software parses raw IR sensor coordinates to identify multi-touch patterns.
- **Swipe Logic:** Detects horizontal and vertical displacement vectors.
- **Pinch-Zoom:** Measures the relative distance change between two touch points to scale the display contents (e.g., maps).

---

## 4 INTERFACE DESIGN

### 4.1 External Interfaces
- **DVI Driver:** Low-level driver for acquiring digital video data via copper or optional fibre links.
- **RS-422 Interface:** Manages control data and status reporting between the display and the aircraft mission computer.
- **Bezel Switch Driver:** Interrupt-driven logic for processing brightness (Off-Night-Day) and functional mode selection.

---

## 5 DESIGN TRACEABILITY

**Table 5.1 : Traceability Matrix (SDD to SRS)**

| SDD Section | Design Element | SRS Requirement ID | Traceability Status |
|-------------|----------------|--------------------|---------------------|
| 3.1 | Video Fusion Algorithm | PANTHR-SRS-001 | Traced |
| 3.2 | Multi-touch Gesture Engine | PANTHR-SRS-006 | Traced |
| 4.1 | DVI/RS-422 Driver Logic | PANTHR-SRS-013 | Traced |

---

## 6 MEMORY MAP & RESOURCE ALLOCATION

| Segment | Address Range | Purpose |
|---------|---------------|---------|
| FSBL | 0xFFFC0000 - 0xFFFFFFFF | Bootloader and UART Initialization |
| V_BUF | 0x00000000 - 0x3FFFFFFF | Primary 2560x1024 Video Framebuffers |
| SYS_MEM | 0x40000000 - 0x7FFFFFFF | RTOS Kernel and Application Space |

---

## DOCUMENT CONTROL
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Design Description (SDD) |
| Document ID | PANTHR-SDD-V1.0 |
| Module ID | PANTHR |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## REVISION HISTORY
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Software Design Baseline |

---
*End of Document*