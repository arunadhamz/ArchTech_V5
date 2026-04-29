# SOFTWARE DESIGN DESCRIPTION (SDD) - HAWK MK132 MFD

---

## 1 INTRODUCTION
The Software Design Description (SDD) for the Hawk Mk132 Multi-Function Display (MFD) provides a detailed architectural and low-level design overview. It describes how the software handles analog video fusion, bezel interaction, and thermal regulation within the LRU.

---

### 1.1 Scope
This document details the internal software architecture, partition scheduling, and driver logic for the Hawk Mk132 MFD. It covers the RTOS environment, memory mapping for 600x600 resolution buffers, and the logic for maintenance heater activation.

---

### 1.2 Acronyms and Abbreviations

| Abbreviation | Description |
|--------------|-------------|
| SDD | Software Design Description |
| RTOS | Real-Time Operating System |
| ADC | Analog-to-Digital Converter |
| CBIT | Continuous Built-In Test |
| PBIT | Power-On Built-In Test |
| PWM | Pulse Width Modulation |
| V_BUF | Video Buffer |

---

### 1.3 Referenced Documents

#### 1.3.1 External Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178C | DAL A |
| 2 | Preliminary Specification of MFD - Hawk Mk132 | - | 1.0 |

#### 1.3.2 Internal Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | SyRS | HAWK-MFD-SyRS-V1.0 | 1.0 |
| 2 | SRS | HAWK-MFD-SRS-V1.0 | 1.0 |

---

## 2 SOFTWARE ARCHITECTURE

### 2.1 Software Hierarchy
The MFD software utilizes a layered design to separate hardware-specific drivers from high-level display logic:

1. **Hardware Abstraction Layer (HAL):** Manages ADC interfaces for FLIR/Sensor video and GPIO for the 20 bezel soft keys.
2. **RTOS Kernel:** Provides deterministic task scheduling and resource management.
3. **Display Manager:** Handles the fusion of analog video streams with generated symbology/maps.
4. **System Manager:** Executes PBIT/CBIT and monitors thermal telemetry.

### 2.2 Partitioning & Task Scheduling
Tasks are scheduled to ensure responsive bezel interaction and stable video rendering.

| Task / Partition | Function | Priority | Rate |
|-----------|----------|----------|--------|
| T_Video   | Analog Video Acquisition & Scaling | High | 60 Hz |
| T_Bezel   | 20 Soft Key & Rotary Debouncing | Medium | 100 Hz |
| T_Thermal | Heater & Fan PWM Control | Low | 10 Hz |
| T_Health  | Power Rail & Module Monitoring | High | 1 Hz |

---

## 3 DETAILED DESIGN

### 3.1 Analog Video Acquisition
The design incorporates logic to sample incoming analog video (FLIR/Sensor) via an on-board ADC.
- **Scaling:** Logic to map incoming video signals to the 5x5 inch 600x600 pixel grid.
- **Overlay:** Symbology is rendered in a separate buffer and alpha-blended over the sensor video.

### 3.2 Thermal Control Logic
A specialized software module manages the LRU temperature:
- **Cold Start:** If internal telemetry < -40°C, the software activates the 84V heater rail via the SMPS interface.
- **Maintenance:** PWM control of integral fans based on thermal heat exchanger sensors to prevent AMLCD degradation.

---

## 4 INTERFACE DESIGN

### 4.1 External Interfaces
- **ARINC 404 (J1) Interface:** Logic to process primary 28VDC status and signal data received via the main aircraft connector.
- **Bezel Switch Driver:** Processes 20 push-buttons, 1 rotary switch, and 3 rocker switches for menu navigation.

---

## 5 DESIGN TRACEABILITY

**Table 5.1 : Traceability Matrix (SDD to SRS)**

| SDD Section | Design Element | SRS Requirement ID | Traceability Status |
|-------------|----------------|--------------------|---------------------|
| 3.1 | Video Fusion Algorithm | HAWK-SRS-001 | Traced |
| 3.2 | Heater Activation Logic | HAWK-SRS-008 | Traced |
| 4.1 | Bezel Driver | HAWK-SRS-004 | Traced |

---

## 6 MEMORY MAP & RESOURCE ALLOCATION

| Segment | Address Range | Purpose |
|---------|---------------|---------|
| BOOT | 0x00000000 - 0x0001FFFF | FSBL & Initialization |
| FRAME_0 | 0x00020000 - 0x004FFFFF | 600x600 Symbology Buffer |
| FRAME_1 | 0x00500000 - 0x009FFFFF | 600x600 Video Background Buffer |

---

## DOCUMENT CONTROL
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Design Description (SDD) |
| Document ID | HAWK-MFD-SDD-V1.0 |
| Module ID | HAWK-MFD |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## REVISION HISTORY
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Design for Hawk Mk132 Software |

---
*End of Document*