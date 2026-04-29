# SYSTEM REQUIREMENTS SPECIFICATION (SyRS)

---

## 1 INTRODUCTION
The Multi-Function Display (MFD) for the Hawk Mk132 aircraft is a Line Replaceable Unit (LRU) designed to provide pilots with critical flight, sensor, and mission data. It is built around a high-performance flat-panel Active Matrix Liquid Crystal Display (AMLCD) to ensure clear visualization in all tactical flight phases.

---

### 1.1 Scope
This document specifies the system-level requirements for the Hawk Mk132 MFD. It defines the hardware architecture, functional capabilities, and environmental constraints required for certification and operation within the Hawk Mk132 aircraft environment.

---

### 1.2 Referenced Documents
The documents referred to in the preparation of this System Requirements Specification (SyRS) are listed below.

#### 1.2.1 External Documents
**Table 1.1 : External Referenced Documents**

| S.No. | Document Name | Version | Date |
|-------|---------------|---------|------|
| 1 | Preliminary Specification of MFD - Hawk Mk132 | 1.0 | April 16, 2026 |
| 2 | ARINC 404 Connector Standards | - | - |

#### 1.2.2 Internal Documents
**Table 1.2 : Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Hawk Mk132 Project Quality Plan | HAWK-PQP-01 | 1.0 |

---

### 1.3 Acronyms and Abbreviations
**Table 1.3 : List of Abbreviations and Acronyms**

| Abbreviation | Description |
|--------------|-------------|
| AMLCD | Active Matrix Liquid Crystal Display |
| FLIR | Forward Looking Infra-Red |
| LRU | Line Replaceable Unit |
| MFD | Multi-Function Display |
| NVIS | Night Vision Imaging System |
| VDC | Volts Direct Current |

---

## 2 SYSTEM OVERVIEW
The MFD is contained in a cast aluminium chassis with a backplane assembly providing electrical interconnections between video, power, and display modules. The system processes analog video information from external sensors (FLIR, camera) and internal symbology/map generators.

---

### 2.1 System Specifications
**Table 2.1 : System Specifications**

| Parameter | Specification |
|-----------|---------------|
| Display Type | 5 x 5 inch (127 x 127 mm) AMLCD |
| Resolution | 600 x 600 pixels (Minimum) |
| Power Consumption | < 255 W |
| Weight | < 4.745 kg |
| Input Power | 28 VDC (per MIL-STD-704) |

---

## 3 SYSTEM LEVEL REQUIREMENTS

**Table 3.1 : System Level Requirements**

| Requirement ID | Function Description |
|----------------|---------------------|
| HAWK-SyRS-001 | The system shall display analog video from FLIR and sensor cameras. |
| HAWK-SyRS-002 | The system shall incorporate 20 push-button soft keys on the front bezel. |
| HAWK-SyRS-003 | The system shall provide internal cooling via integral fans and heat exchangers. |
| HAWK-SyRS-004 | The system shall support NVIS Class B operational modes. |
| HAWK-SyRS-005 | The system shall be ruggedized for Hawk Mk132 environmental profiles. |

---

### 3.1 Optical Requirements Specification
**Requirement ID:** HAWK-SyRS-001

- **Luminance:** Support for high-ambient sunlight and night vision environments.
- **NVIS:** Compatible with Night Vision Goggles (NVG) as per NVIS Class B.
- **Viewing Angle:** Optimized for cockpit installation in Hawk Mk132.

---

### 3.2 Hardware Requirements Specification
**Requirement ID:** HAWK-SyRS-002

- **Bezel Interface:** 20 soft keys, one rotary switch, and three rocker switches for pilot interaction.
- **Chassis:** Cast aluminium assembly with a 106-way ARINC 404 (J1) connector.
- **Power Module:** SMPS unit providing +5V, 3.3V, 42V, 46V, and 84V (cold start) rails.

---

### 3.3 Environmental Requirements Specification
**Requirement ID:** HAWK-SyRS-005

**Table 3.5 : Environmental Requirements Specifications**

| Type of Test | Severity / Range | Remarks |
|--------------|------------------|---------|
| Operating Temp | -40°C to +71°C | Continuous operation |
| Storage Temp | -55°C to +85°C | |
| Vibration | As per Hawk Mk132 profile | |
| EMI/EMC | Applicable per MIL-STD-461 | |
| Altitude | 50,000 ft | |

---

## 4 DETAILED DESCRIPTION
The MFD incorporates specialized heaters for the AMLCD and backlight to support cold start operations at -40°C. The integral fan logic monitors thermal telemetry to regulate heat exchangers, ensuring the longevity of the electronic modules.

---

## ANNEXURES

### Annexure A - KC Implementation
**Table A1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-HAWK-SyRS-01 | Weight < 4.745 kg | Section 2.1 |
| KC-HAWK-SyRS-02 | Max Power < 255 W | Section 2.1 |

---

### Annexure E : Validation Matrix
**Table E5.1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| HAWK-SyRS-001 | Analog Video Fusion | TEST | |
| HAWK-SyRS-002 | Bezel Key Interaction | INSPECTION / TEST | |
| HAWK-SyRS-005 | Environmental Range | QUAL TEST | Lab Testing |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | System Requirements Specification (SyRS) |
| Document ID | HAWK-MFD-SyRS-V1.0 |
| Product Name | Multi-Function Display Unit (Hawk Mk132) |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Draft based on Hawk Mk132 Techspec |

---
*End of Document*