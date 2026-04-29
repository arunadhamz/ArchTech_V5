# HARDWARE REQUIREMENTS SPECIFICATION (HRS) - CLADS

---

## 1 INTRODUCTION
The Cockpit Large Area Display System (CLADS) Hardware Requirements Specification (HRS) defines the physical, electrical, and interface constraints for the panoramic intelligent display. The hardware is designed to support high-performance computing for Integrated Modular Avionics (IMA) and long-term reliability in extreme flight environments.

---

### 1.1 Scope
This document explains how the hardware design meets the system-level requirements for the CLADS. It serves as the primary technical reference for Hardware Design (HDD) and Verification teams, focusing on the dual-channel architecture and redundancy management.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| AFDX | Avionics Full-Duplex Switched Ethernet |
| AMLCD | Active Matrix Liquid Crystal Display |
| CLADS | Cockpit Large Area Display System |
| DAL | Design Assurance Level |
| GPU | Graphics Processing Unit |
| IMA | Integrated Modular Avionics |
| NVIS | Night Vision Imaging System |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Design Assurance Guidance for Airborne HW | RTCA/DO-254 | - |
| 2 | Environmental Conditions for Airborne Equip | RTCA/DO-160G | - |
| 3 | Environmental Engineering Considerations | MIL-STD-810H | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | System Requirements Specification | CLADS-SyRS-V1.0 | 1.0 |

---

## 2 MODULE OVERVIEW
The CLADS hardware is a ruggedized 20x8 inch display system. It integrates a high-resolution panoramic AMLCD with a dual-channel redundant processing core, ensuring that no single point of hardware failure results in the loss of primary flight data.

---

### 2.1 Features
* **Panoramic Display:** 20x8 inch active area for enhanced situational awareness.
* **Dual-Channel Redundancy:** Independent processing paths for high-availability mission computing.
* **Fail-Operational Backlight:** Redundant LED strings to maintain visibility after partial failure.
* **Integrated Monitoring:** Independent FPGA for frame freeze and GPU health monitoring.

---

## 3 BLOCK DIAGRAM
The hardware architecture features two symmetric processing channels (Channel A and Channel B) that share data via a cross-channel link, with an independent monitor FPGA controlling the final output bridge.

[Image of dual-channel redundant avionics display architecture block diagram]

---

## 4 SPECIFICATIONS
**Table 4.1 : Specifications**

| Parameter | Specification |
|-----------|---------------|
| **MECHANICAL** | |
| Display Size | 20 x 8 inches |
| Weight | < 15 lbs (6.8 kg) |
| Mounting | Standard cockpit panel footprint |
| **ELECTRICAL** | |
| Input Power | 28 VDC Primary Aircraft Power |
| Power Consumption | < 150 Watts (at maximum brightness) |
| Backlight System | NVIS Compliant LED |
| **INTERFACE** | |
| High-Speed Data | 10GbE / AFDX Support |
| Video Input | High-Definition Sensor Video (sub-frame latency) |
| **ENVIRONMENTAL** | |
| Operating Temp | Per DO-160G / MIL-STD-810H |
| Integrity | DAL A Capable |

---

### 4.1 Specification Statement – Processing Engine
The processing subsystem shall utilize an ARINC 653 compliant hardware architecture to support robust time and space partitioning for multiple applications.

---

### 4.2 Specification Statement – Safety Monitoring
**Requirement ID:** CLADS-HRS-005
The hardware shall include an independent FPGA monitor that samples the GPU "Heartbeat." If the frame remains static for >100ms, the monitor shall force a "RED-X" overlay via the hardware video bridge.

---

## 5 PROCESSING REQUIREMENT
The hardware must support the simultaneous rendering of 3D synthetic vision, digital maps, and sensor video fusion with a total system latency of less than one frame.

---

## 6 FAT VALIDATION REQUIREMENT
**Table 6.1 : FAT Validation Requirements**

| Requirement ID | Requirement | Testing Plan |
|----------------|-------------|--------------|
| CLADS-HRS-001 | Power Max 150W | Measure power draw at 28VDC during full brightness. |
| CLADS-HRS-002 | Fail-Operational Backlight | Simulate single LED string failure and verify display remains readable. |
| CLADS-HRS-003 | Weight Limit | Weigh the final LRU assembly including connectors. |

---

## ANNEXURES

### Annexure A : KC Implementation
**Table A 1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-CLADS-HRS-01 | Weight < 15 lbs | Table 4.1 |
| KC-CLADS-HRS-02 | Frame Freeze < 100ms | Section 4.2 |

---

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | HRS Section No. |
|-------|----------------|-------------|----------|-----------------|
| 1 | CLADS-HRS-001 | Maximum Power 150W | CLADS-SyRS-002 | 4.0 |
| 2 | CLADS-HRS-005 | Independent Monitoring | CLADS-SyRS-005 | 4.2 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method |
|----------------|-------------|---------------------|
| CLADS-HRS-001 | Power Consumption | TEST |
| CLADS-HRS-002 | Redundancy Logic | ANALYSIS |
| CLADS-HRS-003 | Dimensions | INSPECTION |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Hardware Requirements Specification (HRS) |
| Document ID | CLADS-HRS-V1.0 |
| Product Name | CLADS Panoramic Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Draft for CLADS Hardware |

---
*End of Document*