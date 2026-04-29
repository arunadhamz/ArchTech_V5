# SOFTWARE REQUIREMENTS SPECIFICATION (SRS) - MPCDTI

---

## 1 INTRODUCTION
The Software Requirements Specification (SRS) for the Multi-Purpose Cockpit Display of Traffic Information (MPCDTI) defines the functional and performance requirements for the ADS-B In processing suite. The software is responsible for the simultaneous execution of surveillance applications and the arbitration of automated flight guidance.

---

### 1.1 Scope
This document specifies the software-level requirements for the MPCDTI unit. It provides the basis for the Software Design Description (SDD) and ensures the implementation follows the "elemental function" architecture required for NextGen compatibility.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| SRS | Software Requirements Specification |
| ASAS | Airborne Separation Assurance System |
| ATSA | Airborne Traffic Situational Awareness |
| CDTI | Cockpit Display of Traffic Information |
| PBIT | Power-On Built-In Test |
| NAS | National Airspace System |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178B | - |
| 2 | ADS-B In Applications Performance | RTCA DO-317 | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | System Requirements Specification | MPCDTI-SyRS-V1.0 | 1.0 |
| 2 | Hardware Requirements Specification | MPCDTI-HRS-V1.0 | 1.0 |

---

## 2 FUNCTIONAL REQUIREMENTS

### 2.1 Elemental Function Management
- **MPCDTI-SRS-001:** The software shall decompose ADS-B In applications into elemental functions to allow for reusable code modules.
- **MPCDTI-SRS-002:** The software shall support the simultaneous enablement of compatible applications (e.g., ATSA-AIRB and ATSA-SURF).

### 2.2 Algorithm Selection and Transition
- **MPCDTI-SRS-003:** The software shall implement an Automatic Algorithm Selection logic to determine the appropriate application based on the current flight phase.
- **MPCDTI-SRS-004:** The software shall manage the transition between spacing and separation algorithms without interrupting traffic visualization.

### 2.3 Output Arbitration and Guidance
- **MPCDTI-SRS-005:** The software shall provide an Arbitration Layer to evaluate outputs from all active applications.
- **MPCDTI-SRS-006:** The software shall prioritize safety-critical separation guidance over efficiency-based spacing cues.
- **MPCDTI-SRS-007:** The software shall prevent the output of conflicting or infeasible lateral/longitudinal guidance to the flight crew.

---

## 3 PERFORMANCE REQUIREMENTS

### 3.1 Data Integrity and Update Rates
- **MPCDTI-SRS-008:** The software shall process traffic data updates from ADS-B, TIS-B, and FIS-B sources at the rates specified in RTCA DO-317.
- **MPCDTI-SRS-009:** The software shall execute Continuous Built-In Test (CBIT) to ensure the integrity of the arbitration logic.

---

## 4 INTERFACE REQUIREMENTS

### 4.1 Display and User Interface
- **MPCDTI-SRS-010:** The software shall render traffic symbols according to CDTI standards for NextGen environments.
- **MPCDTI-SRS-011:** The software shall support mode selection and pilot-initiated overrides via the cockpit display interface.

---

## ANNEXURES

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | Section Ref |
|-------|----------------|-------------|----------|-------------|
| 1 | MPCDTI-SRS-001 | Elemental Function Reuse | MPCDTI-SyRS-001 | 2.1 |
| 2 | MPCDTI-SRS-003 | Auto-Algorithm Selection | MPCDTI-SyRS-002 | 2.2 |
| 3 | MPCDTI-SRS-005 | Output Arbitration Logic | MPCDTI-SyRS-003 | 2.3 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| MPCDTI-SRS-001 | Modularity | INSPECTION | Code Review |
| MPCDTI-SRS-005 | Arbitration Logic | ANALYSIS / SIM | Conflict Scenarios |
| MPCDTI-SRS-007 | Guidance Safety | TEST | |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Requirements Specification (SRS) |
| Document ID | MPCDTI-SRS-V1.0 |
| Product Name | MPCDTI Integrated Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Draft for MPCDTI Software |

---
*End of Document*