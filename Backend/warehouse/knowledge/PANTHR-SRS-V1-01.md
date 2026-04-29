# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

## 1 INTRODUCTION
The PANTHR™ Software Requirements Specification (SRS) defines the functional, performance, and interface requirements for the display’s processing subsystem. The software architecture is designed to support high-fidelity graphics and multi-source video fusion on a single monolithic 2560x1024 LCD.

---

### 1.1 Scope
This document specifies the software-level requirements for the PANTHR™ unit. It provides the basis for the Software Design Description (SDD) and serves as the primary reference for the Software Development and Verification teams.

---

### 1.2 Acronyms and Abbreviations
**Table 1.1 : List of Acronyms and Abbreviations**

| Abbreviation | Description |
|--------------|-------------|
| SRS | Software Requirements Specification |
| API | Application Programming Interface |
| BDF | Binary Definition File |
| GUI | Graphical User Interface |
| NVIS | Night Vision Imaging System |
| SVS | Synthetic Vision System |
| EVS | Enhanced Vision System |
| CVS | Combined Vision System |

---

### 1.3 Referenced Documents
#### 1.3.1 External Documents
**Table 1.2 : External Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178C | DAL A |
| 2 | Avionics Application Software Standard Interface | ARINC 653 | - |

#### 1.3.2 Internal Documents
**Table 1.3 : Internal Referenced Documents**

| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | SyRS | PANTHR-SyRS-V1.0 | 1.0 |
| 2 | HRS | PANTHR-HRS-V1.0 | 1.0 |

---

## 2 FUNCTIONAL REQUIREMENTS

### 2.1 Video and Graphic Presentation
- **PANTHR-SRS-001:** The software shall support the simultaneous presentation of video and graphics from up to four (4) external sources.
- **PANTHR-SRS-002:** The software shall render a monolithic 2560 x 1024 resolution image at 128 dpi.
- **PANTHR-SRS-003:** The software shall support 8-bit color depth for high-fidelity graphic rendering.

### 2.2 Touch Interaction and Gestures
- **PANTHR-SRS-004:** The software shall interface with the IR touch sensor to detect and process multi-touch inputs.
- **PANTHR-SRS-005:** The software shall implement "Swipe" gesture recognition for screen navigation.
- **PANTHR-SRS-006:** The software shall implement "Pinch-Zoom" capability for map and sensor video manipulation.

### 2.3 System Control and Brightness
- **PANTHR-SRS-007:** The software shall implement brightness control logic for Day, Night, and NVIS B operational modes.
- **PANTHR-SRS-008:** The software shall interface with bezel-mounted switches for system state transitions.
- **PANTHR-SRS-009:** The software shall support NVIS B provisions as per MIL-STD-3009.

---

## 3 PERFORMANCE REQUIREMENTS

### 3.1 Dual-Channel Fault Tolerance
- **PANTHR-SRS-010:** The software shall implement a fail-operational architecture using the dual-channel processing subsystem.
- **PANTHR-SRS-011:** In the event of a single channel failure, the software shall ensure the entire display remains usable ("full-screen" fault tolerance).

### 3.2 Throughput and Latency
- **PANTHR-SRS-012:** The software shall process and render incoming video streams with a maximum latency of 33ms (equivalent to one frame at 30fps).

---

## 4 INTERFACE REQUIREMENTS

### 4.1 External Interfaces
- **PANTHR-SRS-013:** The software shall include drivers for DVI (Copper/Fibre) video input acquisition.
- **PANTHR-SRS-014:** The software shall support data communication over RS-422.
- **PANTHR-SRS-015:** The software shall optionally support the ARINC 818 protocol for high-speed digital video.

---

## 5 DESIGN CONSTRAINTS
- **Modular Architecture:** The software shall be developed using a modular, open architecture to facilitate long-term supportability and technology insertion.

---

## ANNEXURES

### Annexure B : Requirement Traceability Matrix
**Table B 1 : Requirement Traceability Matrix**

| S.No. | Requirement ID | Description | SyRS REF | Section Ref |
|-------|----------------|-------------|----------|-------------|
| 1 | PANTHR-SRS-001 | 4 Source Video Fusion | PANTHR-SyRS-001 | 2.1 |
| 2 | PANTHR-SRS-006 | Pinch-Zoom Capability | PANTHR-SyRS-003 | 2.2 |
| 3 | PANTHR-SRS-010 | Dual-Channel Redundancy | PANTHR-SyRS-001 | 3.1 |

---

### Annexure C : Validation Matrix
**Table C 1 : Validation Matrix**

| Requirement ID | Description | Verification Method | Note |
|----------------|-------------|---------------------|------|
| PANTHR-SRS-001 | Multi-Source Video | DEMONSTRATION | System Test |
| PANTHR-SRS-005 | Swipe Gesture | TEST | Integration |
| PANTHR-SRS-011 | Fault Tolerance | ANALYSIS / TEST | Fault Injection |

---

## Document Control
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Requirements Specification (SRS) |
| Document ID | PANTHR-SRS-V1.0 |
| Product Name | PANTHR™ Large Area Display |
| Version | 1.0 |
| Date | April 16, 2026 |

---

## Revision History
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 1.0 | April 16, 2026 | ArchTech AI | Initial baseline for PANTHR Software |

---
*End of Document*