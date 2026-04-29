# HARDWARE REQUIREMENTS SPECIFICATION (HRS)

---

## 1 INTRODUCTION
The MFD-640 Hardware Requirements Specification (HRS) defines the physical, electrical, and interface constraints for the Multi-Function Display unit. Designed as a compact retrofit solution, the hardware is optimized for space-constrained cockpits while providing high-performance visualization capabilities.

---

### 1.1 Scope
This document explains how the hardware design meets the system-level requirements for the MFD-640. It serves the Hardware Design (HDD) department for the preparation and verification of the unit, focusing on mechanical assembly, power distribution, and I/O connectivity.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| AMLCD | Active Matrix Liquid Crystal Display |
| CSDB | Commercial Standard Data Bus |
| HRS | Hardware Requirements Specification |
| LED | Light Emitting Diode |
| RGB | Red Green Blue |
| VGA | Video Graphics Array |
| VDC | Volts Direct Current |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Environmental Conditions for Airborne Equip | RTCA/DO-160D | - |
| 2 | Aircraft Electrical Power Characteristics | MIL-STD-704 | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | System Requirements Specification | MFD640-SyRS-V1.0 | 1.0 |

---

## 2 MODULE OVERVIEW
The MFD-640 is a self-contained display unit featuring a 5.7-inch diagonal AMLCD. The hardware architecture integrates a high-efficiency LED backlight system and a high-density I/O board to support various legacy and modern avionics interfaces.

---

### 2.1 Features
* **Compact Footprint:** High-depth, narrow-width chassis for versatile cockpit installation.
* **High-Efficiency Backlight:** Reliable LED-based lighting system with low power dissipation.
* **Extensive I/O:** Support for ARINC 429, ARINC 708, RS-422, and VGA video.
* **Bezel Controls:** Integrated function switches for mode and range selection.

---

### 2.2 Applications
* **Cockpit Retrofit:** Consolidation of single-function instruments into a multi-mission display.
* **Mission Visualization:** Real-time display of Terrain, Weather, and FMS data.

---

## 3 BLOCK DIAGRAM
The hardware architecture utilizes a centralized processing core that manages data acquisition from dual VGA ports and multiple ARINC channels.

[Image of avionics display hardware block diagram showing I/O processor and LCD controller]

---

## 4 SPECIFICATIONS
**Table 4.1 : Specifications**

| Parameter | Specification |
|-----------|---------------|
| **MECHANICAL** | |
| Dimensions (HxWxD) | 5.23 in x 5.975 in x 8.27 in |
| Weight | 7.75 lbs |
| Faceplate Options | Gray or Black |
| **ELECTRICAL** | |
| Input Power | 28 VDC standard |
| Lighting Bus | 5V or 28V configurable |
| Power Consumption | 90 Watts maximum |
| **OPTICAL** | |
| Display Type | Active Matrix Color LCD |
| Graphics | 256K colors (True 18-bit), anti-aliased |
| Viewing Angle | +/- 60° Horizontal |
| **ENVIRONMENTAL** | |
| Cooling | External cooling not required (Convection cooled) |
| Standards | RTCA/DO-160D |

---

### 4.1 Specification Statement – Power Module
The unit operates on 28 VDC primary aircraft power. The internal power supply provides regulated rails for the 18-bit graphics engine and the LED backlight driver.

---

### 4.2 Specification Statement – Input and Output Interfaces
- **Data Bus I/O:** Support for ARINC 429/419 (6 Rx, 2 Tx), ARINC 561/568, and ARINC 453/708A.
- **Serial Bus:** 2 Ports of RS-422 (CSDB).
- **Video:** 2 High-resolution VGA ports for external sensor or mission computer input.
- **Discrete I/O:** 12 Discrete Inputs (4 @ +28V/Open, 8 @ Ground/Open) and 4 Discrete Outputs.

---

### 4.3 Specification Statement – Mechanical Assembly
The unit is designed for panel mounting with an 8.27-inch depth (excluding connectors). The front bezel includes integrated switches for "DIM", "MENU", and "SEL" functions.

---

## 5 PROCESSING REQUIREMENT
The hardware processing subsystem handles anti-aliased graphic generation with 64 levels of gray per color, ensuring crisp visualization of Synthetic Vision and Weather Radar data.

---

## 6 FAT VALIDATION REQUIREMENT
**Table 6.1 : FAT Validation Requirements**

| Requirement ID | Requirement | Testing Plan |
|----------------|-------------|--------------|
| MFD640-HRS-001 | Power Consumption | Verify current draw does not exceed 90W at 28 VDC. |
| MFD640-HRS-002 | Video Acquisition | Verify signal integrity and resolution on both VGA ports. |

---

## ANNEXURES

### Annexure A : KC Implementation
**Table A 1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-MFD640-HRS-01 | Weight 7.75 lbs | Table 4.1 |
| KC-MFD640-HRS-02 | Max Power 90W | Table 4.1 |

---

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | HRS Section No. |
|-------|----------------|-------------|----------|-----------------|
| 1 | MFD640-HRS-001 | Primary Input 28 VDC | MFD640-SyRS-006 | 4.1 |
| 2 | MFD640-HRS-002 | VGA Video Ports | MFD640-SyRS-004 | 4.2 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method |
|----------------|-------------|---------------------|
| MFD640-HRS-001 | Power Max 90W | QUAL TEST |
| MFD640-HRS-002 | Dimensions | INSPECTION |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Hardware Requirements Specification (HRS) |
| Document ID | MFD640-HRS-V1.0 |
| Product Name | MFD-640 Multi-Function Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Draft for MFD-640 Hardware |

---
*End of Document*