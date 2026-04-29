# HARDWARE REQUIREMENTS SPECIFICATION (HRS)

---

## 1 INTRODUCTION
The Multi-Purpose Cockpit Display of Traffic Information (MPCDTI) Hardware Requirements Specification (HRS) defines the physical and electrical parameters required to support the NextGen ADS-B In environment. The hardware is designed to provide high-integrity traffic situational awareness and arbitration logic for automated guidance.

---

### 1.1 Scope
This document explains how the hardware architecture supports the system-level requirements for the MPCDTI. It serves as the primary technical reference for the Hardware Design (HDD) department for the development of processing modules and communication interfaces.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| ADS-B | Automatic Dependent Surveillance-Broadcast |
| CDTI | Cockpit Display of Traffic Information |
| HRS | Hardware Requirements Specification |
| FPGA | Field Programmable Gate Array |
| NAS | National Airspace System |
| TIS-B | Traffic Information Service-Broadcast |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Next Generation Air Transportation System | NextGen | - |
| 2 | ADS-B In Applications Performance | RTCA DO-317 | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | System Requirements Specification | MPCDTI-SyRS-V1.0 | 1.0 |

---

## 2 MODULE OVERVIEW
The MPCDTI hardware architecture is designed to handle high-bandwidth surveillance data. It consists of a high-speed processing core, a specialized arbitration module, and multi-protocol communication ports.

---

### 2.1 Features
* **High-Throughput Processing:** Optimized for simultaneous execution of multiple ADS-B In algorithms.
* **Redundant Data Paths:** Dual-channel input for high-reliability traffic data acquisition.
* **Low Latency Output:** Dedicated hardware layer for real-time guidance arbitration.
* **Ruggedized Design:** Compliant with NextGen airborne equipment standards.

---

### 2.2 Applications
* **NextGen Modernization:** Strategic tool for NAS updates and airborne separation assurance.
* **Traffic Situational Awareness:** Primary display for terminal and en-route traffic management.

---

## 3 BLOCK DIAGRAM
The hardware features an Arbitration Layer situated between the application processing cores and the flight deck output interface.

[Image of avionics system block diagram showing ADS-B In processing and output arbitration layer]

---

## 4 SPECIFICATIONS
**Table 4.1 : Specifications**

| Parameter | Specification |
|-----------|---------------|
| **ELECTRICAL** | |
| Input Data Rate | Supports high-bandwidth 1090 ES / UAT |
| Signal Input | ADS-B, TIS-B, FIS-B |
| Arbitration Latency | < 50ms (Guidance update) |
| **MECHANICAL** | |
| Form Factor | Integrated Cockpit Display Unit |
| Chassis Material | Aviation-grade Aluminium |
| **INTERFACE** | |
| Primary Data Bus | High-speed Ethernet / ARINC 429 |
| Guidance Output | Conflict-free lateral/longitudinal cues |

---

### 4.1 Specification Statement – Processing Module
The processing core must be capable of decomposing ADS-B In applications into elemental functions to facilitate simultaneous enablement without resource contention.

---

### 4.2 Specification Statement – Guidance Arbitration Layer
The hardware shall implement a physical or logical isolation layer for output arbitration. This layer ensures that efficiency-based cues do not override safety-critical separation guidance.

---

## 5 PROCESSING REQUIREMENT
The system processes multi-source surveillance data to generate traffic symbols and automated guidance cues. The hardware must support the transition between spacing and separation algorithms with zero-packet loss.

---

## 6 FAT VALIDATION REQUIREMENT
**Table 6.1 : FAT Validation Requirements**

| Requirement ID | Requirement | Testing Plan |
|----------------|-------------|--------------|
| MPCDTI-HRS-001 | Simultaneous App Load | Verify hardware remains stable with 4+ simultaneous applications. |
| MPCDTI-HRS-002 | Arbitration Logic | Inject conflicting guidance and verify the safety-critical cue is prioritized. |

---

## ANNEXURES

### Annexure A : KC Implementation
**Table A 1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-MPCDTI-HRS-01 | Arbitration Latency < 50ms | Table 4.1 |
| KC-MPCDTI-HRS-02 | Concurrent App Support | Section 4.1 |

---

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | HRS Section No. |
|-------|----------------|-------------|----------|-----------------|
| 1 | MPCDTI-HRS-001 | Output Arbitration Layer | MPCDTI-SyRS-003 | 4.2 |
| 2 | MPCDTI-HRS-002 | Simultaneous App Support | MPCDTI-SyRS-001 | 4.1 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method |
|----------------|-------------|---------------------|
| MPCDTI-HRS-001 | Guidance Integrity | ANALYSIS |
| MPCDTI-HRS-002 | Mechanical Chassis | INSPECTION |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Hardware Requirements Specification (HRS) |
| Document ID | MPCDTI-HRS-V1.0 |
| Product Name | MPCDTI Display Unit |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Draft for MPCDTI Hardware |

---
*End of Document*