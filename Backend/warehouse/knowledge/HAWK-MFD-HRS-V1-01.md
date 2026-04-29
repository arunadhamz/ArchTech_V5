# HARDWARE REQUIREMENTS SPECIFICATION (HRS)

---

## 1 INTRODUCTION
The Multi-Function Display (MFD) is a high-performance Line Replaceable Unit (LRU) designed for the Hawk Mk132 aircraft. It utilizes a 5x5 inch Active Matrix Liquid Crystal Display (AMLCD) to provide a clear interface for sensor video and flight symbology.

---

### 1.1 Scope
This document explains how the hardware specifications fulfill the system-level requirements for the Hawk Mk132 MFD. It serves as the primary reference for the Hardware Design (HDD) department for the development, assembly, and verification of the electronic modules and chassis.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| AMLCD | Active Matrix Liquid Crystal Display |
| HRS | Hardware Requirements Specification |
| LRU | Line Replaceable Unit |
| SMPS | Switch Mode Power Supply |
| NVIS | Night Vision Imaging System |
| VDC | Volts Direct Current |
| ARINC | Aeronautical Radio, Incorporated |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | Preliminary Specification of MFD - Hawk Mk132 | - | 1.0 | 04/2026 |
| 2 | Aircraft Electrical Power Characteristics | MIL-STD-704 | - | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | System Requirements Specification | HAWK-MFD-SyRS-V1.0 | 1.0 |

---

## 2 MODULE OVERVIEW
The MFD is contained within a cast aluminium chassis. The hardware architecture is modular, consisting of a Video Module, Switch Mode Power Supply (SMPS), Display Assembly, and a Key Panel, all interconnected via a backplane assembly.

---

### 2.1 Features
* **AMLCD Technology:** 5x5 inch (127 x 127 mm) active area.
* **Pilot Interface:** 20 push-button soft keys, one rotary switch, and three rocker switches.
* **Thermal Management:** Integral fan and heat exchangers for component cooling.
* **Cold Start Capability:** Specialized heaters for AMLCD and backlight maintenance.
* **Rugged Interface:** 106-way ARINC 404 (J1) connector for aircraft interfacing.

---

### 2.2 Applications
* **Hawk Mk132 Cockpit:** Primary display for FLIR, sensor video, and digital maps.
* **Tactical Mission Management:** Real-time visualization of mission-critical data.

---

## 3 BLOCK DIAGRAM
The hardware architecture features a backplane-centric design where the SMPS provides regulated power rails to the Video and Display modules.

[Image of avionics MFD hardware block diagram showing SMPS, Video Module, and Display Assembly]

---

## 4 SPECIFICATIONS
**Table 4.1 : Specifications**

| Parameter | Specification |
|-----------|---------------|
| **MECHANICAL** | |
| Dimensions (WxDxH) | 6.69 in x 11.20 in x 7.44 in |
| Weight | < 4.745 kg |
| Chassis Material | Cast Aluminium |
| **ELECTRICAL** | |
| Input Power | 28 VDC |
| Power Consumption | < 255 W |
| SMPS Outputs | +5V, 3.3V, 42V, 46V, 84V (Cold Start) |
| **OPTICAL** | |
| Active Area | 5.0" x 5.0" |
| Resolution | 600 x 600 pixels (min) |
| NVIS | Class B Compatible |
| **ENVIRONMENTAL** | |
| Operating Temp | -40°C to +71°C |
| Altitude | 50,000 ft |

---

### 4.1 Specification Statement – Power Module (SMPS)
The SMPS provides input-to-output isolation. It specifically generates 84V for cold start heaters and dedicated rails (42V/46V) for backlight and AMLCD maintenance.

---

### 4.2 Specification Statement – Thermal Management
The hardware includes an integral fan installed on the back panel. Thermal control is achieved through heat exchangers that regulate the temperature of the AMLCD and electronic modules.

---

### 4.3 Specification Statement – Interface Connectors
The rear of the unit features a 106-way Rectangular Wall ARINC 404 (J1) connector for aircraft power and signal interface.

---

## 5 PROCESSING REQUIREMENT
The Video Module assembly processes incoming analog video information from FLIR and camera sources, overlaying symbology onto the AMLCD.

---

## 6 FAT VALIDATION REQUIREMENT
**Table 7.1 : FAT Validation Requirements**

| Requirement ID | Requirement | Testing Plan |
|----------------|-------------|--------------|
| HAWK-HRS-001 | Cold Start Heater | Verify 84V rail activation and AMLCD warmup at -40°C. |
| HAWK-HRS-002 | Bezel Switch Logic | Verify electrical continuity and debounce of 20 soft keys. |

---

## ANNEXURES

### Annexure A : KC Implementation
**Table A 1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-HAWK-HRS-01 | Power Consumption < 255W | Table 4.1 |
| KC-HAWK-HRS-02 | Total Weight < 4.745 kg | Table 4.1 |

---

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | HRS Section No. |
|-------|----------------|-------------|----------|-----------------|
| 1 | HAWK-HRS-001 | Input Voltage 28 VDC | HAWK-SyRS-002 | 4.0 |
| 2 | HAWK-HRS-002 | Operating Temp -40 to +71C | HAWK-SyRS-005 | 4.0 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method |
|----------------|-------------|---------------------|
| HAWK-HRS-001 | Thermal Management | QUAL TEST |
| HAWK-HRS-002 | Dimensions | INSPECTION |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Hardware Requirements Specification (HRS) |
| Document ID | HAWK-MFD-HRS-V1.0 |
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