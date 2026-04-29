# HARDWARE REQUIREMENTS SPECIFICATION (HRS)

---

## 1 INTRODUCTION

The SLAD-208 is a high-performance Smart Large Area Display (SLAD) featuring a wide-aspect ratio 20x8 inch screen. It is designed to provide pilots with intuitive and effective access to critical flight information, enabling safe operations under both Visual Flight Rules (VFR) and Instrumental Flight Rules (IFR).

---

### 1.1 Scope

This document will explain how the requirements will meet through the specifications. The targeted audience is HDD. The task for HDD department is as follow, HDD : Preparation and Verification of HRS with respect to the requirement.

---

### 1.2 Acronyms and Abbreviations

The acronyms and abbreviations used in this document are listed in the below Table 1.1.

**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| HRS | Hardware Requirements Specification |
| BID | Board ID |
| ID | Identification |
| PID | Project/ Product ID |
| SID | System ID |
| SYRS | System Requirement Specification |
| SLAD | Smart Large Area Display |
| LCD | Liquid Crystal Display |
| NVG | Night Vision Goggles |
| PSU | Power Supply Unit |
| SSD | Solid State Drive |
| SVS | Synthetic Vision System |
| EVS | Enhanced Vision System |
| CVS | Combined Vision System |

---

### 1.3 Referenced Documents

This section gives the external and internal documents referred to prepare this manual.

#### 1.3.1 External Documents

**Table 1.2 : External Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | Design Assurance Guidance for Airborne HW | RTCA/DO-254 | DAL A | - |
| 2 | Environmental Conditions for Airborne Equip | RTCA/DO-160G | - | - |
| 3 | Environmental Engineering Considerations | MIL-STD-810G | - | - |
| 4 | Aircraft Electrical Power Characteristics | MIL-STD-704 | - | - |

#### 1.3.2 Internal Documents

**Table 1.3 : Internal Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | SyRS | SLAD-208-FG-QAP-XVXX | 1.0 | April 16, 2026 |

---

## 2 MODULE OVERVIEW

The hardware architecture of the SLAD-208 is a fully redundant, single-glass 20x8 inch large area display. The unit features dual redundant electronics and backlight units to ensure continuous high performance even in the case of a single failure. It is capable of showing video from sensors merged with graphics to provide enhanced situational awareness.

---

### 2.1 Features

* **Redundant Architecture**: Fully redundant LCD glass and electronic units including multicore processors, graphic modules, and power supplies.
* **High Resolution**: 2560x1024 pixels on a single 20x8 inch glass.
* **Multi-touch**: Resistive multi-touchscreen enabled with gesture recognition.
* **NVG Compatibility**: Wide brightness dimming range compatible with Night Vision Goggles.
* **Mass Storage**: Two removable 1 Terabyte SSD mSATA devices.

---

### 2.2 Applications

* **EFIS/EICAS**: Display management for PFD and Engine Indicating system.
* **Navigation**: Electronic Horizontal Situation Indicator and Digital Moving Map.
* **Situational Awareness**: Embedded Synthetic Vision System (SVS) and Combined Vision System (CVS).

---

## 3 BLOCK DIAGRAM

The SLAD-208 hardware consists of a redundant driving architecture where two processing and graphic sections drive a single LCD glass.

**Figure 3.1 : Block Diagram of SLAD-208**

---

## 4 SPECIFICATIONS

**Table 4.1 : Specifications**

| Parameter | Specification |
|-----------|---------------|
| Type | Smart Large Area Display (SLAD) |
| Processor | Quad Core (1.4 GHz, 30 DMIPS/MHz per core) |
| **INPUT AND OUTPUT SPECIFICATIONS** | |
| ARINC 429 In / Out | 66 In / 20 Out |
| Ethernet | 7x External Link (10/100/1000 MB), 2x AFDX |
| Video Inputs | 2x ARINC 818, 5x SMTPE, 2x CVBS, 1x DVI IN |
| **POWER REQUIREMENTS** | |
| Voltage | 28 VDC |
| Power Dissipation | Less than 320 W (heater off) |
| **MEMORY** | |
| RAM | 3GB DDR3 |
| Storage | 2x 1TB SSD mSATA |
| **SOFTWARE SUPPORT** | |
| OS | Green Hills Integrity-178 tuMP |
| **INTERFACE / CONNECTORS** | |
| Main Connectors | MIL-STD-38999 |
| **MECHANICAL** | |
| Dimension (LxBxH) in mm | 566 x 215 x 265 |
| **ENVIRONMENTAL** | |
| Operating Temperature | -40°C to +55°C (Full operative) |
| Storage Temperature | -55°C to +85°C |

---

### 4.1 Specification Statement – Type
The unit is an Active Matrix Liquid Crystal Display (AMLCD) with a wide 20x8 inch viewing area and redundant driving electronics.

---

### 4.2 Specification Statement – Size
The display resolution is 2560x1024 pixels. Physical dimensions are 566mm Width, 265mm Height, and 215mm Depth.

---

### 4.3 Specification Statement – Input and Output Specifications
The hardware supports 66 ARINC 429 inputs and 20 outputs. Video I/O is handled via ARINC 818 and SMTPE protocols.

---

### 4.4 Specification Statement – Connectors
Primary interface is via MIL-C-38999 connectors. Frontal access is provided for dual USB 3.0 ports for data loading.

---

### 4.5 Specification Statement – Power Requirements
Nominal operating voltage is 28 VDC. The system includes 50ms hold-up transparency for power interrupts.

---

### 4.6 Specification Statement – Environmental Specifications
Qualified to MIL-STD-810G and RTCA/DO-160G. Operating range covers -40°C to +55°C with peaks up to +70°C.

---

## 5 FPGA DESIGN REQUIREMENT

### 5.1 FPGA / CPLD Description
Two graphic mezzanine card modules provide dedicated GPU processing and sensor management for image fusion.

---

### 5.2 FPGA Block Diagram

**Figure 5.1 : FPGA Block Diagram**

---

### 5.3 Functional Requirement

**Table 5.1 : Functional Requirements**

| S.No. | Function Name | Description | Reference if applicable |
|-------|---------------|-------------|------------------------|
| 1 | Graphic Rendering | GPU frequency of 575 MHz with 2GB DDR5 | SLAD-208-HRS-001 |
| 2 | Image Fusion | Merging SVS terrain with EVS sensor video | SLAD-208-HRS-002 |
| 3 | Redundancy | Dual redundant electronics and backlight | SLAD-208-HRS-003 |

---

## 6 DEVELOPMENT PLATFORM

**Table 6.1 : Development Platform Requirements**

| S.No. | Parameter | Requirement |
|-------|-----------|-------------|
| 1 | Architecture | Quad-Core MultiCore Processor |
| 2 | OS | Green Hills Integrity-178 tuMP |
| 3 | BUS | AFDX / ARINC 429 |

---

## 7 FAT VALIDATION REQUIREMENT

**Table 7.1 : FAT Validation Requirements**

| Requirement ID | Requirement | Testing Plan | Software |
|----------------|-------------|--------------|----------|
| SLAD-208-HRS-001 | Redundant EU Operation | Verify automatic switch-over during simulated EU failure. | Health monitor software |
| SLAD-208-HRS-002 | Touch Gestures | Verify tap, pinch, and rotate recognition on display. | HMI Calibration tool |

---

## 8 DEMO VALIDATION REQUIREMENT

**Table 8.1 : Demo Validation Requirements**

| Requirement ID | Requirement | Testing Plan | Software |
|----------------|-------------|--------------|----------|
| SLAD-208-HRS-003 | Bullet Test Resilience | Verify display continuity after simulated local LCD damage. | Graphics Driver |

---

## ANNEXURES

### Annexure A : KC Implementation

**Table A 1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-SLAD-HRS-01 | Max Weight < 16.5 kg | Table 4.1 |
| KC-SLAD-HRS-02 | Resolution 2560x1024 | Table 4.1 |

---

### Annexure B : Requirement Traceability Matrix

**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | HRS Section No. |
|-------|----------------|-------------|----------|-----------------|
| 1 | SLAD-208-HRS-001 | Power Requirements < 320W | SLAD-SyRS-001 | 4.5 |
| 2 | SLAD-208-HRS-002 | Operating Temp -40 to 55C | SLAD-SyRS-005 | 4.6 |

---

### Annexure C : Validation Matrix

**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| | | QUAL TEST | ATP | INTEGRATION | DEMO | INSPECTION | ANALYSIS | |
| SLAD-208-HRS-001 | Redundancy | | Y | Y | | | | |
| SLAD-208-HRS-002 | Weight | | | | | Y | | |

---

## Document Control

| Document Information | Details |
|---------------------|---------|
| Document Title | Hardware Requirements Specification (HRS) |
| Document ID | SLAD-208-HRS-V1.0 |
| Module Name | SLAD-208 Smart Large Area Display |
| Module ID | SLAD-208 |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History

| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Draft |

---

*End of Document*