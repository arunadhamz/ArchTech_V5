# SYSTEM REQUIREMENTS SPECIFICATION (SyRS)

---

## 1 INTRODUCTION
The MFD-640 is a high-performance Multi-Function Display (MFD) designed as a versatile retrofit solution for a wide range of aircraft platforms. It provides a consolidated visualization hub for mission-critical systems including Weather Radar, FMS, TAWS, and Synthetic Vision.

---

### 1.1 Scope
This document specifies the system-level requirements and technical specifications for the MFD-640. It defines the hardware architecture, software functionality, and environmental constraints required to achieve FAA TSO/ETSO certification. The document serves as the primary reference for hardware and software design departments.

---

### 1.2 Referenced Documents
The documents referred to in the preparation of this System Requirements Specification (SyRS) are listed below.

#### 1.2.1 External Documents
**Table 1.1 : External Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178B | - |
| 2 | Environmental Conditions for Airborne Equip | RTCA/DO-160D | - |
| 3 | Multi-Function Displays | FAA TSO-C113 | - |
| 4 | Airborne Weather Radar | FAA TSO-C63c | - |

#### 1.2.2 Internal Documents
**Table 1.2 : Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | MFD-640 Quality Assurance Plan | MFD640-QAP-01 | 1.0 |

---

### 1.3 Acronyms and Abbreviations
**Table 1.3 : List of Abbreviations and Acronyms**

| Abbreviation | Description |
|--------------|-------------|
| AMLCD | Active Matrix Liquid Crystal Display |
| FMS | Flight Management System |
| TAWS | Terrain Awareness Warning System |
| TSO | Technical Standard Order |
| VGA | Video Graphics Array |
| VDC | Volts Direct Current |

---

## 2 SYSTEM OVERVIEW
The MFD-640 is a compact display unit featuring a high-reliability LED backlight system. It interfaces with a variety of external avionics via multiple data protocols (ARINC 429, ARINC 453, RS-422) to present a multi-layered graphical interface to the pilot.

---

### 2.1 System Specifications
**Table 2.1 : System Specifications**

| Parameter | Specification |
|-----------|---------------|
| Display Type | Active Matrix Color LCD |
| Graphics | 256K colors (True 18-bit), anti-aliased |
| Power Consumption | 90 Watts Maximum |
| Input Power | 28 VDC (Standard) |
| Lighting Bus | 5V or 28V |
| Cooling | External cooling not required |

---

## 3 SYSTEM LEVEL REQUIREMENTS

**Table 3.1 : System Level Requirements**

| Requirement ID | Function Description |
|----------------|---------------------|
| MFD640-SyRS-001 | The system shall display Weather Radar data from over 20 supported radar types. |
| MFD640-SyRS-002 | The system shall display FMS flight plans with surrounding navaids and airports. |
| MFD640-SyRS-003 | The system shall support Synthetic Vision (Vision-1®) and TAWS 2D/3D terrain. |
| MFD640-SyRS-004 | The system shall provide two VGA ports for external video input acquisition. |
| MFD640-SyRS-005 | The system shall support anti-aliased graphics with 64 levels of gray per color. |

---

### 3.1 Optical Requirements Specification
**Requirement ID:** MFD640-SyRS-005

- **Color Depth:** True 18-bit color (6 bits per RGB channel) providing 256K colors.
- **Viewing Angle:** +/- 60 degrees horizontal.
- **Backlight:** High-efficiency LED backlight system for all-conditions readability.

---

### 3.2 Hardware Requirements Specification
- **Bezel Interface:** Function switches and controls for mode selection and configuration.
- **I/O Capability:** Support for ARINC 429/419 (6 Rx, 2 Tx), ARINC 561/568, ARINC 453/708A (2 ports), and RS-422.
- **Discrete I/O:** 12 Discrete Inputs and 4 Discrete Outputs.

---

### 3.3 Environmental Requirements Specification
**Requirement ID:** MFD640-SyRS-006

The unit shall be qualified according to **RTCA/DO-160D** categories for airborne equipment.

| Category | Requirement |
|----------|-------------|
| Temperature | Per DO-160D Section 4 |
| Altitude | Per DO-160D Section 4 |
| Vibration | Per DO-160D Section 8 |
| EMI/EMC | Per DO-160D Section 21 |

---

## 4 DETAILED DESCRIPTION
The MFD-640 is designed as a powerful retrofit solution that eliminates the need for dedicated single-function cockpit instruments. By consolidating traffic, lightning, weather, and video into a single 5-inch class display, it optimizes panel real estate while providing enhanced situational awareness through anti-aliased, high-fidelity graphics.

---

## ANNEXURES

### Annexure A - KC Implementation
**Table A1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-MFD640-SyRS-01 | Weight 7.75 lbs | Section 2.1 |
| KC-MFD640-SyRS-02 | 18-bit True Color | Section 3.1 |

---

### Annexure E : Validation Matrix
**Table E5.1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| MFD640-SyRS-001 | Weather Radar Display | DEMONSTRATION | |
| MFD640-SyRS-004 | VGA Video Input | TEST | |
| MFD640-SyRS-006 | Environmental Compliance | QUAL TEST | DO-160D Testing |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | System Requirements Specification (SyRS) |
| Document ID | MFD640-SyRS-V1.0 |
| Product Name | MFD-640 Multi-Function Display |
| Product ID | MFD-640 |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Draft based on MFD-640 Brochure |

---
*End of Document*