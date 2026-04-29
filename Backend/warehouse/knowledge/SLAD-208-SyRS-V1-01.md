# SYSTEM REQUIREMENTS SPECIFICATION (SyRS)

---

## 1 INTRODUCTION
The SLAD-208 is a high-performance Smart Large Area Display (SLAD) featuring a wide-aspect ratio screen. It is designed to provide pilots with intuitive and effective access to critical flight information, enabling safe operations under both Visual Flight Rules (VFR) and Instrumental Flight Rules (IFR).

---

### 1.1 Scope
This document specifies the system-level requirements and technical specifications for the SLAD-208. It defines the hardware architecture, software functionality, and environmental constraints required to achieve certification up to DAL A. The targeted audience is the HDD department for preparation and verification of the system against customer requirements.

---

### 1.2 Referenced Documents

The documents referred to prepare the System Requirements Specification (SyRS) are listed in the below tables.

#### 1.2.1 External Documents
**Table 1.1 : External Referenced Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178C | DAL A | - |
| 2 | Design Assurance Guidance for Airborne HW | RTCA/DO-254 | DAL A | - |
| 3 | Environmental Conditions for Airborne Equip | RTCA/DO-160G | - | - |
| 4 | Environmental Engineering Considerations | MIL-STD-810G | - | - |
| 5 | Aircraft Electrical Power Characteristics | MIL-STD-704 | - | - |

#### 1.2.2 Internal Documents
**Table 1.2 : Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | SyRS | SLAD-208-FG-QAP-XVXX | 1.0 | April 16, 2026 |

---

### 1.3 Acronyms and Abbreviations
**Table 1.3 : List of Abbreviations and Acronyms**

| Abbreviation | Description |
|--------------|-------------|
| CVS | Combined Vision System (SVS + EVS) |
| DAL | Design Assurance Level |
| DMG | Digital Map Generator |
| EVS | Enhanced Vision System |
| NVG | Night Vision Goggles |
| SVS | Synthetic Vision System |
| SLAD | Smart Large Area Display |

---

## 2 SYSTEM OVERVIEW
The SLAD-208 is a fully redundant, single-glass 20x8 inch display system. It is characterized by its lightweight design, low power consumption, and high-resolution output (2560x1024 pixels). The unit offers dual redundant electronics and backlight systems, ensuring continuous high performance even in the event of a single component failure.

---

### 2.1 System Block Diagram
The system architecture consists of two independent Electronic Units (EU) and graphic mezzanine cards that drive the single LCD panel and redundant backlight.

**Figure 2.1 : System Block Diagram**

---

### 2.2 System Specifications
**Table 2.1 : System Specifications**

| Parameter | Specification |
|-----------|---------------|
| Display Type | Active Matrix LCD |
| Resolution | 2560 x 1024 pixels |
| Active Area | 20 x 8 inches |
| Viewing Angle | Horizontal: 60° / Vertical: -5° to +35° |
| MTBF | 4900 Flight Hours @ AIC 25°C |
| Power | 28 VDC (MIL-STD-704 compliant) |

---

## 3 SYSTEM LEVEL REQUIREMENTS

**Table 3.1 : System Level Requirements**

| Requirement ID | Function Description |
|----------------|---------------------|
| SLAD-SyRS-001 | Hardware: Redundant MultiCore CPU & GPU architecture |
| SLAD-SyRS-002 | Software: ARINC 653 partitioning via RTOS |
| SLAD-SyRS-003 | Interface: Support for AFDX and ARINC 429 protocols |
| SLAD-SyRS-004 | Mechanical: Envelope and weight for cockpit integration |
| SLAD-SyRS-005 | Environmental: Certification for harsh flight conditions |

---

### 3.1 Hardware Requirements Specification
**Requirement ID :** SLAD-SyRS-001

**Table 3.2 : Hardware Requirements Specifications**

| S. No. | Section | Specification |
|--------|---------|---------------|
| (3.1.1) | EMI Filter | Integrated MIL-STD-461 compliant filtering |
| (3.1.2) | DC-DC Converter | Redundant PSU with 50ms hold-up transparency |
| (3.1.3) | Processor | 2x MultiCore CPU modules (1.4 GHz, 30 DMIPS/MHz) |
| (3.1.4) | Performance | Optimized for ARINC 661 Graphic Server |
| (3.1.5) | External Memory | 2x 1TB SSD mSATA for map/nav data |
| (3.1.6) | FPGA | 2x Graphic mezzanine modules (575 MHz GPU) |
| (3.1.7) | Comm Interface | 66x ARINC 429 In, 2x AFDX (ARINC 664 P7) |
| (3.1.10)| Startup Time | Fast boot to operational display < 15s |
| (3.1.12)| Operating Temp | -40°C to +55°C (Full operative) |

---

### 3.2 Software Requirements Specification
**Requirement ID :** SLAD-SyRS-002
The SLAD-208 software suite is developed to RTCA/DO-178C DAL A. Key functional components include:
- **RTOS:** Green Hills Integrity-178 tuMP.
- **Graphic Server:** ARINC 661 implementation.
- **Fusion Logic:** Combined Vision System (CVS) merging terrain (SVS) and IR video (EVS).

---

### 3.3 External Interface Requirements Specification
**Requirement ID :** SLAD-SyRS-003

**Table 3.3 : External Interface Requirements Specifications**

| S. No. | Connector | Signal Assignment | No. of Pins | No. of Connectors |
|--------|-----------|-------------------|-------------|-------------------|
| (3.3.1) | MIL-C-38999 | Power & Low Speed I/O | 128 | 2 |
| (3.3.2) | ARINC 818 | High-Speed Video In | - | 2 |
| (3.3.3) | USB 3.0 | Frontal Data Load | 9 | 2 |

---

### 3.4 Mechanical Requirements Specification
**Requirement ID :** SLAD-SyRS-004

**Table 3.4 : Mechanical Requirements Specifications**

| S. No. | Specification | Requirement | Remarks |
|--------|---------------|-------------|---------|
| (3.4.1) | Overall Dimension | 566 x 265 x 215 mm | L x W x H |
| (3.4.2) | Weight | 16.2 Kg | Max weight |
| (3.4.5) | Cooling | Convection + Internal Fans | Redundant cooling |
| (3.4.6) | Finish | Matte Black | Anti-reflective |

---

### 3.5 Environmental Requirements Specification
**Requirement ID :** SLAD-SyRS-005

**Table 3.5 : Environmental Requirements Specifications**

| Type of Test/ Standard Reference | Severity | Duration | Remarks |
|----------------------------------|----------|----------|---------|
| (3.5.1) High Temp (MIL-810G) | +55°C (Op) / +70°C (Short term) | 24 Hours | No functional loss |
| (3.5.2) Low Temp (MIL-810G) | -40°C | 24 Hours | Startup verified |
| (3.5.3) Power (MIL-704/DO-160) | 50ms Transparency | Continuous | No reset on drop |

---

## 4 DETAILED DESCRIPTION
The system utilizes a "Single Glass" redundant driving architecture. This ensures that even in the case of significant physical damage to a portion of the LCD (e.g., bullet perforation), the remaining screen area continues to function correctly, managed by the secondary Electronic Unit.

---

### 4.1 Subsystem / Module 1: Electronic Unit (EU)
The EU manages the primary processing, partition management, and communication with the aircraft data bus.

**Table 4.1 : EU Specifications**

| Reference | Parameter | Specification |
|-----------|-----------|---------------|
| 4.1.1 | Type | Quad-Core MultiCore Module |
| 4.1.3 | Features | Secure Software Loader (ARINC 615) |
| 4.1.6 | Power Requirements | 28 VDC Nominal |
| 4.1.7 | Power Dissipation | Low power consumption architecture |

---

## ANNEXURES

### Annexure A - KC Implementation
**Table A1 : Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-SLAD-SyRS-01 | Max Weight < 16.5 kg | Section 3.4.2 |
| KC-SLAD-SyRS-02 | Resolution 2560x1024 | Section 2.2 |

---

### Annexure E : Validation Matrix
**Table E5.1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| SLAD-SyRS-001 | CPU Architecture | ANALYSIS | Design Review |
| SLAD-SyRS-004 | Weight/Dimension | INSPECTION | Physical check |
| SLAD-SyRS-005 | High/Low Temp | QUAL TEST | Lab testing |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | System Requirements Specification (SyRS) |
| Document ID | SLAD-208-FG-QAP-XVXX |
| Product Name | SLAD-208 Smart Large Area Display |
| Product ID | SLAD-208 |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Draft with Leonardo Specs |

---
*End of Document*