# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

## 1 INTRODUCTION
The Software Requirements Specification (SRS) for the Hawk Mk132 Multi-Function Display (MFD) defines the functional and performance requirements for the unit’s processing and visualization suite. The software is responsible for fusing analog video with symbology and digital maps on a 600x600 resolution AMLCD.

---

### 1.1 Scope
This document specifies the software-level requirements for the MFD Line Replaceable Unit (LRU). It provides the basis for the Software Design Description (SDD) and serves as the primary reference for software development and verification teams.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| SRS | Software Requirements Specification |
| AMLCD | Active Matrix Liquid Crystal Display |
| FLIR | Forward Looking Infra-Red |
| BIT | Built-In Test |
| NVIS | Night Vision Imaging System |
| GUI | Graphical User Interface |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Referenced Documents**

| S.No. | Document Name | Version | Date |
|-------|---------------|---------|------|
| 1 | Preliminary Specification of MFD - Hawk Mk132 | 1.0 | 04/2026 |
| 2 | Software Considerations in Airborne Systems | RTCA/DO-178C | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | System Requirements Specification | HAWK-MFD-SyRS-V1.0 | 1.0 |
| 2 | Hardware Requirements Specification | HAWK-MFD-HRS-V1.0 | 1.0 |

---

## 2 FUNCTIONAL REQUIREMENTS

### 2.1 Video Processing and Display
- **HAWK-SRS-001:** The software shall process and display analog video information from Forward Looking Infra-Red (FLIR) sources.
- **HAWK-SRS-002:** The software shall support the presentation of sensor video from external camera sources.
- **HAWK-SRS-003:** The software shall overlay symbology and digital map images onto the video background with a minimum resolution of 600 x 600 pixels.

### 2.2 Pilot Interface (Bezel Control)
- **HAWK-SRS-004:** The software shall interface with the 20 push-button soft keys located on the front bezel.
- **HAWK-SRS-005:** The software shall process inputs from the rotary switch and three rocker switches for menu navigation and parameter adjustment.
- **HAWK-SRS-006:** The software shall implement debouncing logic for all bezel-mounted switches.

### 2.3 Thermal and System Management
- **HAWK-SRS-007:** The software shall monitor internal temperature telemetry and control the integral fan operation.
- **HAWK-SRS-008:** The software shall implement logic to activate AMLCD and backlight maintenance heaters during cold start phases (-40°C).
- **HAWK-SRS-009:** The software shall implement Continuous Built-In Test (CBIT) to monitor the health of the Video and Power modules.

---

## 3 PERFORMANCE REQUIREMENTS

### 3.1 Display Performance
- **HAWK-SRS-010:** The software shall ensure flicker-free rendering of symbology at a minimum refresh rate of 60Hz.
- **HAWK-SRS-011:** The software shall support NVIS Class B operational modes without degrading display contrast.

---

## 4 INTERFACE REQUIREMENTS

### 4.1 Hardware-Software Interface
- **HAWK-SRS-012:** The software shall interface with the SMPS module to monitor the status of the 28 VDC primary power and sub-rails (5V, 3.3V, 42V, 46V, 84V).
- **HAWK-SRS-013:** The software shall handle analog-to-digital video conversion for external sensor inputs.

---

## ANNEXURES

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | Section Ref |
|-------|----------------|-------------|----------|-------------|
| 1 | HAWK-SRS-001 | FLIR Video Support | HAWK-SyRS-001 | 2.1 |
| 2 | HAWK-SRS-004 | Bezel Key Interface | HAWK-SyRS-002 | 2.2 |
| 3 | HAWK-SRS-008 | Cold Start Heater Logic | HAWK-SyRS-004 | 2.3 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| HAWK-SRS-001 | Analog Video Fusion | TEST | |
| HAWK-SRS-004 | Bezel Interaction | TEST | Integration |
| HAWK-SRS-009 | Health Monitoring (CBIT) | ANALYSIS / TEST | |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Requirements Specification (SRS) |
| Document ID | HAWK-MFD-SRS-V1.0 |
| Product Name | Hawk Mk132 MFD |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Draft for Hawk Mk132 Project |

---
*End of Document*