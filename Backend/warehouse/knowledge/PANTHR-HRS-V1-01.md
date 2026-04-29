# HARDWARE REQUIREMENTS SPECIFICATION (HRS)

---

## 1 INTRODUCTION

The PANTHR™ is a high-performance Smart Large Area Display (SLAD) featuring a wide-aspect ratio 20x8 inch Active Matrix LCD screen. It is designed to provide pilots with intuitive and high-fidelity access to critical flight information, enabling safe operations in tactical environments.

---

### 1.1 Scope

This document explains how the system requirements for the PANTHR display are met through hardware specifications. It serves the Hardware Design (HDD) department for the preparation and verification of the unit against tactical aircraft environment requirements.

---

### 1.2 Acronyms and Abbreviations

The acronyms and abbreviations used in this document are listed in the below Table 1.1.

**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| AMLCD | Active Matrix Liquid Crystal Display |
| HRS | Hardware Requirements Specification |
| DVI | Digital Visual Interface |
| IR | Infrared |
| MTBF | Mean Time Between Failure |
| NVIS | Night Vision Imaging System |
| VDC | Volts Direct Current |

---

### 1.3 Referenced Documents

This section gives the external and internal documents referred to prepare this manual.

#### 1.3.1 External Documents

**Table 1.2 : External Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | L3Harris PANTHR Technical Datasheet | - | - | 09/2019 |
| 2 | General Capabilities Information (Non-ITAR) | - | - | - |

#### 1.3.2 Internal Documents

**Table 1.3 : Internal Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | SyRS | PANTHR-SyRS-V1.0 | 1.0 | April 16, 2026 |

---

## 2 MODULE OVERVIEW

The PANTHR hardware is a self-contained, fault-tolerant display system. It features a single, monolithic 2560x1024 active matrix LCD driven by a dual-channel high-performance processing subsystem to ensure continuous operation and high reliability in tactical mission environments.

---

### 2.1 Features

* **Full-Screen Fault Tolerance**: Unique architecture provides unsurpassed reliability with unlimited usage of the entire display even during partial hardware failure.
* **High Resolution**: 2560x1024 pixels at 128 dpi with 8-bit color depth on a single 20x8 inch glass.
* **Dual-Channel Processing**: Redundant high-performance computing subsystem for critical data handling.
* **Touch Interaction**: Optional IR touch screen supporting multi-touch gestures including swipe and pinch-zoom.
* **LED Backlighting**: Optimized for sunlight readability (Day) and night operational modes (Night/NVIS).

---

### 2.2 Applications

* **Tactical Aircraft**: Display management for high-fidelity sensor video and tactical flight graphics.
* **Mission Systems**: Used across air, land, sea, and space domains for situational awareness.

---

## 3 BLOCK DIAGRAM

The PANTHR hardware utilizes a modular, open architecture where a dual-channel high-performance processing subsystem drives the monolithic LCD panel.

**Figure 3.1 : Block Diagram of PANTHR™**

---

## 4 SPECIFICATIONS

**Table 4.1 : Specifications**

| Parameter | Specification |
|-----------|---------------|
| Type | Smart Large Area Display (SLAD) / LAD |
| Processing | Dual-Channel High-Performance Subsystem |
| **INPUT AND OUTPUT SPECIFICATIONS** | |
| Primary Interfaces | DVI (copper); RS-422 |
| Optional Interfaces | DVI (fibre); ARINC 818; DisplayPort™ |
| **POWER REQUIREMENTS** | |
| Voltage | 28 VDC |
| Power Consumption | 150 W nominal (full bright/fans on) |
| **OPTICAL PERFORMANCE** | |
| Resolution | 2560 x 1024 pixels, 128 dpi |
| Luminance (Day) | 10 fL to 290 fL (minimum) |
| Luminance (Night) | 0.025 fL to 25 fL |
| Viewing Angle | ±90° horizontal/vertical inherent |
| Contrast Ratio | > 10:1 (high ambient lighting) |
| **MECHANICAL** | |
| Dimensions (w x h x d) | 21.79" x 9.73" x 4.75" |
| Weight | 20 lb. minimum |
| Cooling | Internal fans |
| **ENVIRONMENTAL** | |
| Operating Temperature | -40°C to +71°C |
| Storage Temperature | -54°C to +85°C |
| Altitude | 65,000 ft. |
| Reliability | > 5,000 hours MTBF |

---

### 4.1 Specification Statement – Type
The unit is a self-contained, high-resolution Active Matrix Liquid Crystal Display (AMLCD) with a wide 20x8 inch viewing area and fault-tolerant driving electronics.

---

### 4.2 Specification Statement – Size
The display active area is 20.0" (w) x 8.0" (h) with a 21.5" diagonal. The resolution is 2560 x 1024 pixels.

---

### 4.3 Specification Statement – Input and Output Specifications
The system supports primary video/data via DVI (copper) and RS-422, with modular support for high-speed ARINC 818 or DisplayPort™.

---

### 4.4 Specification Statement – Connectors
The physical interface includes primary connectors for power and video, supporting both copper and optional fibre connections.

---

### 4.5 Specification Statement – Power Requirements
The system operates on 28 VDC with a nominal power dissipation of 150 W when the backlight is at full brightness and fans are active.

---

### 4.6 Specification Statement – Environmental Specifications
Ruggedized for tactical aircraft environments. Qualified for temperatures up to +71°C and altitudes up to 65,000 ft.

---

## 5 FPGA / PROCESSING DESIGN REQUIREMENT

### 5.1 Architecture Description
The modular, open architecture is driven by a dual-channel high-performance processing subsystem providing required computing performance for multi-source video fusion.

---

### 5.2 Functional Requirement

**Table 5.1 : Functional Requirements**

| S.No. | Function Name | Description | Reference if applicable |
|-------|---------------|-------------|------------------------|
| 1 | Graphic Rendering | Support for crisp presentations of video and graphics from up to 4 sources | PANTHR-HRS-001 |
| 2 | Gesture Recognition | IR touch screen processing for swipe and pinch-zoom | PANTHR-HRS-002 |
| 3 | Fault Tolerance | Full-screen redundancy for unlimited display usage | PANTHR-HRS-003 |

---

## 6 DEVELOPMENT PLATFORM

**Table 6.1 : Development Platform Requirements**

| S.No. | Parameter | Requirement |
|-------|-----------|-------------|
| 1 | Architecture | Dual-Channel High-Performance Processing |
| 2 | Design | Modular, Open Architecture |

---

## 7 FAT VALIDATION REQUIREMENT

**Table 7.1 : FAT Validation Requirements**

| Requirement ID | Requirement | Testing Plan | Software |
|----------------|-------------|--------------|----------|
| PANTHR-HRS-001 | Redundant Operation | Verify display continuity during single channel fault injection. | System Health Monitor |
| PANTHR-HRS-002 | Touch Interaction | Verify gesture accuracy (swipe/pinch-zoom) across the full screen. | Touch Calibration Tool |

---

## 8 DEMO VALIDATION REQUIREMENT

**Table 8.1 : Demo Validation Requirements**

| Requirement ID | Requirement | Testing Plan | Software |
|----------------|-------------|--------------|----------|
| PANTHR-HRS-003 | Environmental Resilience | Verify optical performance and fan operation at +71°C. | Thermal Monitor |

---

## ANNEXURES

### Annexure A : KC Implementation

**Table A 1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-PANTHR-HRS-01 | Resolution 2560x1024 | Table 4.1 |
| KC-PANTHR-HRS-02 | Max Altitude 65,000 ft | Table 4.1 |

---

### Annexure B : Requirement Traceability Matrix

**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | HRS Section No. |
|-------|----------------|-------------|----------|-----------------|
| 1 | PANTHR-HRS-001 | Power Consumption 150W | PANTHR-SyRS-005 | 4.5 |
| 2 | PANTHR-HRS-002 | Operating Temp -40 to +71C | PANTHR-SyRS-005 | 4.6 |

---

### Annexure C : Validation Matrix

**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| | | QUAL TEST | ATP | INTEGRATION | DEMO | INSPECTION | ANALYSIS | |
| PANTHR-HRS-001 | Redundancy | | Y | Y | | | | |
| PANTHR-HRS-002 | Dimensions | | | | | Y | | |

---

## Document Control

| Document Information | Details |
|---------------------|---------|
| Document Title | Hardware Requirements Specification (HRS) |
| Document ID | PANTHR-HRS-V1.0 |
| Module Name | PANTHR™ Large Area Display |
| Module ID | PANTHR |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History

| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Draft based on L3Harris PANTHR Specs |

---

*End of Document*