# SOFTWARE DESIGN DESCRIPTION (SDD) - MPCDTI

---

## 1 INTRODUCTION
The MPCDTI Software Design Description (SDD) provides a detailed architectural and low-level design overview. It describes how the software manages the simultaneous execution of ADS-B In applications and the critical output arbitration logic required for NextGen operations.

---

### 1.1 Scope
This document details the internal software architecture, partition scheduling, and driver logic for the MPCDTI. It covers the modular design of elemental functions and the implementation of the Arbitration Layer that ensures conflict-free guidance to the flight crew.

---

### 1.2 Acronyms and Abbreviations

| Abbreviation | Description |
|--------------|-------------|
| SDD | Software Design Description |
| RTOS | Real-Time Operating System |
| HAL | Hardware Abstraction Layer |
| ADS-B | Automatic Dependent Surveillance-Broadcast |
| ASAS | Airborne Separation Assurance System |
| CBIT | Continuous Built-In Test |
| API | Application Programming Interface |

---

### 1.3 Referenced Documents

#### 1.3.1 External Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178B | - |
| 2 | ADS-B In Applications Performance | RTCA DO-317 | - |

#### 1.3.2 Internal Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | SyRS | MPCDTI-SyRS-V1.0 | 1.0 |
| 2 | SRS | MPCDTI-SRS-V1.0 | 1.0 |

---

## 2 SOFTWARE ARCHITECTURE

### 2.1 Software Hierarchy
The MPCDTI utilizes a modular, four-layered architecture to manage high-bandwidth surveillance data and multi-app execution:

1. **Hardware Abstraction Layer (HAL):** Manages raw data acquisition from ADS-B, TIS-B, and FIS-B hardware interfaces.
2. **Elemental Function Library:** A repository of reusable software modules (e.g., state estimation, conflict detection) used across multiple applications.
3. **Application Management Layer:** Responsible for "Simultaneous Enablement" and "Automatic Algorithm Selection" based on flight phase.
4. **Arbitration Layer:** The top-level safety-critical partition that evaluates application outputs to prevent conflicting guidance.

### 2.2 Partitioning & Task Scheduling
Tasks are scheduled to ensure deterministic performance of guidance algorithms.

| Task ID | Function | Priority | Rate |
|---------|----------|----------|------|
| T_ARBIT | Output Arbitration & Safety Logic | Critical | 50 Hz |
| T_SURV  | ADS-B/Surveillance Processing | High | 20 Hz |
| T_SVS   | Synthetic Vision & Map Rendering | Medium | 60 Hz |
| T_MGMT  | Mode/App Selection Logic | Low | 5 Hz |

---

## 3 DETAILED DESIGN

### 3.1 Elemental Function Design
To facilitate reusability, applications are decomposed into elemental functions. 
- **Modular Data Structures:** Software modules for ATSA-AIRB and ATSA-SURF utilize shared data structures for traffic states.
- **Resource Isolation:** Each application runs in a protected memory space to prevent cross-partition failures.

### 3.2 Output Arbitration Logic
The Arbitration Layer software implements a rule-based decision engine:
- **Priority Logic:** If a "Separation" application (safety-critical) and a "Spacing" application (efficiency) provide conflicting lateral cues, the Separation command overrides.
- **Feasibility Check:** Algorithms check guidance outputs against aircraft performance limits to prevent "infeasible" guidance.

---

## 4 INTERFACE DESIGN

### 4.1 External Interfaces
- **Surveillance Data Bus:** Drivers for high-speed Ethernet or ARINC 429 to ingest traffic state vectors.
- **Flight Deck Interface:** API for outputting lateral and longitudinal guidance to the primary displays or flight director.

---

## 5 DESIGN TRACEABILITY

**Table 5.1 : Traceability Matrix (SDD to SRS)**

| SDD Section | Design Element | SRS Requirement ID | Traceability Status |
|-------------|----------------|--------------------|---------------------|
| 2.1 | Layered Architecture | MPCDTI-SRS-001 | Traced |
| 2.2 | Real-time Scheduler | MPCDTI-SRS-008 | Traced |
| 3.2 | Arbitration Decision Engine | MPCDTI-SRS-005 | Traced |

---

## 6 MEMORY MAP & RESOURCE ALLOCATION

| Segment | Address Range | Purpose |
|---------|---------------|---------|
| SYS_ROM | 0x00000000 - 0x0007FFFF | Bootloader & Safety Core |
| APP_RAM | 0x00080000 - 0x07FFFFFF | Shared Elemental Function Library |
| ARB_BUFF| 0x08000000 - 0x080FFFFF | Arbitration Data & Output Buffer |

---

## DOCUMENT CONTROL
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Design Description (SDD) |
| Document ID | MPCDTI-SDD-V1.0 |
| Product Name | MPCDTI Integrated Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## REVISION HISTORY
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Software Design for MPCDTI |

---
*End of Document*