# SYSTEM REQUIREMENTS SPECIFICATION (SyRS) - MPCDTI

---

## 1 INTRODUCTION
The Multi-Purpose Cockpit Display of Traffic Information (MPCDTI) is an integrated avionics system designed to manage multiple ADS-B In applications within a single piece of equipment. It facilitates the modernization of the National Airspace System (NAS) by providing advanced traffic visualization and automated guidance arbitration.

---

### 1.1 Scope
This document specifies the system-level requirements for the MPCDTI. It defines the functional architecture, simultaneous application enablement, and the output arbitration logic required to prevent conflicting flight crew guidance in a NextGen environment.

---

### 1.2 Referenced Documents
#### 1.2.1 External Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Next Generation Air Transportation System | NextGen | - |
| 2 | ADS-B In Applications Performance | RTCA DO-317 | - |

#### 1.2.2 Internal Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | MPCDTI Overview and Performance Requirements | Case #10-2768 | 2010 |

---

### 1.3 Acronyms and Abbreviations
| Abbreviation | Description |
|--------------|-------------|
| ADS-B | Automatic Dependent Surveillance-Broadcast |
| CDTI | Cockpit Display of Traffic Information |
| MPCDTI | Multi-Purpose Cockpit Display of Traffic Information |
| NAS | National Airspace System |
| ASAS | Airborne Separation Assurance System |

---

## 2 SYSTEM OVERVIEW
The MPCDTI integrates four key architectural elements: elemental functions, simultaneous enablement, automatic algorithm selection, and output arbitration. This allows the system to manage multiple ADS-B In applications (e.g., ATSA-SURF, ATSA-AIRB) while ensuring operational safety.

---

### 2.1 System Specifications
| Parameter | Specification |
|-----------|---------------|
| Application Support | Multiple simultaneous ADS-B In apps |
| Core Architecture | Functional modularity |
| Input Sources | ADS-B, TIS-B, FIS-B |
| Guidance | Conflict-free longitudinal/lateral cues |

---

## 3 SYSTEM LEVEL REQUIREMENTS

**Table 3.1 : System Level Requirements**

| Requirement ID | Function Description |
|----------------|---------------------|
| MPCDTI-SyRS-001 | The system shall support the simultaneous enablement of compatible ADS-B In applications. |
| MPCDTI-SyRS-002 | The system shall implement an Automatic Algorithm Selection logic based on flight phase. |
| MPCDTI-SyRS-003 | The system shall provide Output Arbitration to prevent conflicting guidance to the crew. |
| MPCDTI-SyRS-004 | The system shall process traffic data for ATSA (Airborne Traffic Situational Awareness). |
| MPCDTI-SyRS-005 | The system shall transition between spacing and separation algorithms automatically. |

---

### 3.1 Elemental Functional Requirements
**Requirement ID:** MPCDTI-SyRS-001
The system design shall decompose applications into elemental functions to allow for reusable software modules across different ADS-B operations.

### 3.2 Guidance Arbitration Requirements
**Requirement ID:** MPCDTI-SyRS-003
The system shall utilize an arbitration layer that prioritizes safety-critical separation guidance over efficiency-based spacing guidance when both are active.

---

## 4 DETAILED DESCRIPTION
The MPCDTI differentiates itself from standard CDTIs by its ability to package the capability to manage multiple applications. By using automated algorithm selection, the system reduces pilot workload during transitions between different phases of flight, such as moving from en-route spacing to terminal area surface surveillance.

---

## ANNEXURES

### Annexure A - KC Implementation
| KC ID | KC Name/ Specification | Section Ref |
|-------|------------------------|-------------|
| KC-MPCDTI-01 | Simultaneous Enablement | Section 2.0 |
| KC-MPCDTI-02 | Output Arbitration Logic | Section 3.2 |

### Annexure E - Validation Matrix
| Requirement ID | Description | Method |
|----------------|-------------|--------|
| MPCDTI-SyRS-001 | Multi-App Enablement | TEST |
| MPCDTI-SyRS-003 | Guidance Arbitration | ANALYSIS / SIM |
| MPCDTI-SyRS-005 | Algorithm Transition | DEMONSTRATION |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | System Requirements Specification (SyRS) |
| Document ID | MPCDTI-SyRS-V1.0 |
| Product Name | MPCDTI Integrated Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Draft for MPCDTI Project |

---
*End of Document*