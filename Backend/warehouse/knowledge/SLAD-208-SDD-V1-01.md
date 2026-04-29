# SOFTWARE DESIGN DESCRIPTION (SDD) - SLAD-208

---

## 1 INTRODUCTION

The SLAD-208 Software Design Description (SDD) provides a low-level architectural view of the Flight Visualization Suite. This document details how the software requirements defined in the SRS are realized through specific software components, partition scheduling, and driver logic.

---

### 1.1 Scope
This document explains the internal software architecture and detailed design for the SLAD-208 Smart Large Area Display. It covers the RTOS configuration, memory mapping, and the implementation of high-level features like ARINC 661 rendering and CVS fusion.

---

### 1.2 Acronyms and Abbreviations

| Abbreviation | Description |
|--------------|-------------|
| SDD | Software Design Description |
| RTOS | Real-Time Operating System |
| HAL | Hardware Abstraction Layer |
| APEX | Application Executive (ARINC 653) |
| BDF | Binary Definition File |
| MMU | Memory Management Unit |
| CBIT | Continuous Built-In Test |

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
| 1 | SyRS | SLAD-208-FG-QAP-XVXX | 1.0 |
| 2 | SRS | SLAD-208-SRS-V1.1 | 1.1 |

---

## 2 SOFTWARE ARCHITECTURE

### 2.1 Software Hierarchy
The system utilizes a layered architecture to maintain strict isolation between safety-critical and maintenance tasks.

1. **Hardware Abstraction Layer (HAL):** Interfaces with ZynqMP registers and the Mezzanine GPU.
2. **Kernel (Integrity-178 tuMP):** Manages core allocation and ARINC 653 partitioning.
3. **Service Layer:** Implements APEX APIs for Inter-Partition Communication (IPC).
4. **Application Layer:** Contains the ARINC 661 Server and Sensor Fusion logic.

### 2.2 Partitioning & Scheduling
The software utilizes Time and Space partitioning. The CPU Major Frame is 100ms.

| Partition | Core | Budget | Function |
|-----------|------|--------|----------|
| P1_Display| 0,1  | 60ms   | OpenGL Rendering |
| P2_Comm   | 2    | 20ms   | AFDX/429 I/O |
| P3_Fusion | 3    | 20ms   | SVS/EVS Overlay |

---

## 3 DETAILED DESIGN

### 3.1 Graphic Rendering Logic (ARINC 661)
The Graphic Server design is based on a widget-tree structure. It parses BDF files into memory during the "Initialization State" and updates widget parameters based on UDP packets received from User Applications.

### 3.2 Sensor Fusion (CVS) Implementation
The CVS logic utilizes the ZynqMP programmable logic to accelerate alpha-blending. The software design manages the DMA synchronization between the EVS video buffer and the SVS graphical framebuffer.

---

## 4 INTERFACE DESIGN

### 4.1 Internal Interfaces
- **Sampling Ports:** Used for continuous data like Airspeed and Altitude.
- **Queuing Ports:** Used for event-driven data like Pilot warnings.

### 4.2 External Interfaces
- **USB 3.0 Driver:** Implemented in the Maintenance partition for offline data loading.
- **Ethernet Stack:** Supporting AFDX protocol for flight data acquisition.

---

## 5 DESIGN TRACEABILITY

**Table 5.1 : Traceability Matrix (SDD to SRS)**

| SDD Section | Design Element | SRS Requirement ID | Traceability Status |
|-------------|----------------|--------------------|---------------------|
| 2.2 | ARINC 653 Scheduler | SLAD-SRS-FR-01 | Traced |
| 3.1 | ARINC 661 Server | SLAD-SRS-FR-02 | Traced |
| 3.2 | Alpha-Blending Algorithm | SLAD-SRS-FR-03 | Traced |
| 4.2 | AFDX Driver Logic | SLAD-SRS-FR-03 | Traced |

---

## 6 MEMORY MAP & RESOURCE ALLOCATION

| Segment | Address Range | Purpose |
|---------|---------------|---------|
| OCM | 0xFFFC0000 - 0xFFFFFFFF | On-Chip Memory for Boot/FSBL |
| DDR_LOW | 0x00000000 - 0x7FFFFFFF | Kernel & Display Partition |
| DDR_HIGH| 0x80000000 - 0xBFFFFFFF | Mission Data & Fusion Buffers |

---

## DOCUMENT CONTROL
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Design Description (SDD) |
| Document ID | SLAD-208-SDD-V1.0 |
| Module ID | SLAD-208 |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## REVISION HISTORY
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Design Baseline |

---
*End of Document*