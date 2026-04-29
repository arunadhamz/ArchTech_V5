# SYSTEM REQUIREMENTS SPECIFICATION (SyRS)

---

## 1 INTRODUCTION
The PANTHR™ Large Area Display (LAD) is a high-performance, self-contained, fault-tolerant multi-function display featuring a wide-aspect ratio screen [cite: 15, 17]. It is designed to provide pilots with intuitive and effective access to high-fidelity graphics and video from up to four external sources [cite: 17].

---

### 1.1 Scope
This document specifies the system-level requirements and technical specifications for the PANTHR™ display [cite: 7, 15]. It defines the hardware architecture, optical performance, and environmental constraints required for tactical aircraft environments [cite: 7, 11].

---

### 1.2 Referenced Documents

The documents referred to prepare the System Requirements Specification (SyRS) are listed in the tables below.

#### 1.2.1 External Documents
**Table 1.1: External Referenced Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | L3Harris PANTHR Technical Datasheet | - | - | 09/2019 [cite: 26] |
| 2 | General Capabilities Information (Non-ITAR) | - | - | [cite: 27] |

#### 1.2.2 Internal Documents
**Table 1.2: Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version | Date |
|-------|---------------|-------------|---------|------|
| 1 | PANTHR Project Roadmap | PANTHR-PR-001 | 1.0 | April 16, 2026 |

---

### 1.3 Acronyms and Abbreviations
**Table 1.3: List of Abbreviations and Acronyms**

| Abbreviation | Description |
|--------------|-------------|
| AMLCD | Active Matrix Liquid Crystal Display [cite: 9] |
| LAD | Large Area Display [cite: 15] |
| MTBF | Mean Time Between Failure [cite: 7] |
| NVIS | Night Vision Imaging System [cite: 7] |
| LED | Light-Emitting Diode [cite: 7] |
| DVI | Digital Visual Interface [cite: 7] |

---

## 2 SYSTEM OVERVIEW
The PANTHR™ is a fully redundant, monolithic 20x8 inch display system [cite: 4, 18]. It is characterized by high-resolution output (2560x1024 pixels) and a dual-channel high-performance processing subsystem [cite: 7, 11]. The unit ensures continuous high performance through "full-screen" fault tolerance, allowing unlimited usage of the entire display even during partial failures [cite: 18].

---

### 2.1 System Block Diagram
The architecture consists of a dual-channel processing subsystem and modular open-architecture mezzanine cards that drive the single monolithic LCD panel [cite: 11, 12, 17].

[Image of dual-channel avionics display architecture]

---

### 2.2 System Specifications
**Table 2.1: System Specifications**

| Parameter | Specification |
|-----------|---------------|
| Display Type | Active Matrix LCD (AMLCD) [cite: 4, 9] |
| Resolution | 2560 x 1024 pixels, 128 dpi [cite: 7] |
| Active Area | 20.0" (w) x 8.0" (h); 21.5" diagonal [cite: 7] |
| Viewing Angle | ±90° horizontal/vertical inherent [cite: 7] |
| MTBF | > 5,000 hours [cite: 7] |
| Power | 28 VDC, 150 W nominal (full bright/fans on) [cite: 7] |

---

## 3 SYSTEM LEVEL REQUIREMENTS

**Table 3.1: System Level Requirements**

| Requirement ID | Function Description |
|----------------|---------------------|
| PANTHR-SyRS-001 | Hardware: Dual-channel high-performance processing subsystem [cite: 11] |
| PANTHR-SyRS-002 | Software: Modular, open architecture design [cite: 12] |
| PANTHR-SyRS-003 | Interface: Support for DVI, RS-422, and optional ARINC 818 [cite: 7] |
| PANTHR-SyRS-004 | Mechanical: Self-contained, 20 lb minimum ruggedized envelope [cite: 7, 15] |
| PANTHR-SyRS-005 | Environmental: Certification for tactical aircraft environments [cite: 7] |

---

### 3.1 Hardware Requirements Specification
**Requirement ID:** PANTHR-SyRS-001

**Table 3.2: Hardware Requirements Specifications**

| S. No. | Section | Specification |
|--------|---------|---------------|
| (3.1.1) | Display | 20"x8" Active Matrix LCD [cite: 4] |
| (3.1.2) | Backlight | LED supporting Day (290 fL) and Night (0.025 fL) modes [cite: 7, 10] |
| (3.1.3) | Processor | Dual-channel high-performance processing subsystem [cite: 11] |
| (3.1.4) | Touch Screen | Optional IR touch screen with swipe/pinch-zoom [cite: 7, 13] |
| (3.1.5) | NVIS | NVIS B Provisions [cite: 7] |
| (3.1.6) | Contrast | > 10:1 in high ambient lighting [cite: 7] |
| (3.1.7) | Interfaces | DVI (Copper/Fibre), RS-422, ARINC 818, DisplayPort [cite: 7] |

---

### 3.2 Software Requirements Specification
**Requirement ID:** PANTHR-SyRS-002
The PANTHR™ software suite utilizes an open architecture to manage multi-source data [cite: 12]. Key functional components include:
- **Modular Architecture:** Designed for long-term supportability [cite: 12, 16].
- **Graphic Processing:** Crisp presentations of video from up to 4 external sources [cite: 9, 17].
- **Input Handling:** Support for bezel-mounted switches and IR touch gestures [cite: 8, 13].

---

### 3.3 External Interface Requirements Specification
**Requirement ID:** PANTHR-SyRS-003

**Table 3.3: External Interface Requirements Specifications**

| S. No. | Interface Type | Specification |
|--------|----------------|---------------|
| (3.3.1) | Primary I/O | DVI (Copper) and RS-422 [cite: 7] |
| (3.3.2) | Optional Video | ARINC 818 and DisplayPort [cite: 7] |
| (3.3.3) | Control | Bezel-mounted switches and brightness control (Off-Night-Day) [cite: 8] |

---

### 3.4 Mechanical Requirements Specification
**Requirement ID:** PANTHR-SyRS-004

**Table 3.4: Mechanical Requirements Specifications**

| S. No. | Specification | Requirement | Remarks |
|--------|---------------|-------------|---------|
| (3.4.1) | Dimensions | 21.79" (w) x 9.73" (h) x 4.75" (d) [cite: 7] | [cite: 19, 20, 21, 23, 24] |
| (3.4.2) | Weight | 20 lb. minimum [cite: 7] | |
| (3.4.5) | Cooling | Internal fans [cite: 7] | |
| (3.4.6) | Ruggedization | Tactical aircraft environment [cite: 7] | |

---

### 3.5 Environmental Requirements Specification
**Requirement ID:** PANTHR-SyRS-005

**Table 3.5: Environmental Requirements Specifications**

| Type of Test | Severity | Duration | Remarks |
|--------------|----------|----------|---------|
| (3.5.1) Operating Temp | -40°C to +71°C [cite: 7] | Continuous | Tactical aircraft environment [cite: 7] |
| (3.5.2) Storage Temp | -54°C to +85°C [cite: 7] | - | |
| (3.5.3) Altitude | 65,000 ft [cite: 7] | Continuous | |

---

## 4 DETAILED DESCRIPTION
The PANTHR™ Large Area Display is a best-value solution providing high-fidelity graphics and video via a dual-channel high-performance processing subsystem [cite: 11, 16, 17]. Its unique "full-screen" fault tolerance ensures that the system remains operational for critical missions even in the event of partial failures [cite: 18].

---

## ANNEXURES

### Annexure A - KC Implementation
**Table A1: Key Characteristics ID**

| Key Characteristics ID | KC Name/ Specification | Requirement/Section Ref |
|------------------------|------------------------|------------------------|
| KC-PANTHR-SyRS-01 | Resolution 2560x1024 [cite: 7] | Section 2.2 |
| KC-PANTHR-SyRS-02 | Operating Altitude 65,000 ft [cite: 7] | Section 3.5.3 |

---

### Annexure E: Validation Matrix
**Table E5.1: Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| PANTHR-SyRS-001 | Dual-Channel Architecture | ANALYSIS | Design Review |
| PANTHR-SyRS-004 | Dimensions/Weight | INSPECTION | Physical check |
| PANTHR-SyRS-005 | Environmental Range | QUAL TEST | Lab testing |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | System Requirements Specification (SyRS) |
| Document ID | PANTHR-SyRS-V1.0 |
| Product Name | PANTHR™ Large Area Display |
| Product ID | PANTHR |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial Draft with PANTHR Datasheet Specs |

---
*End of Document*