# SOFTWARE DESIGN DESCRIPTION (SDD) - MFD-640

---

## 1 INTRODUCTION
The MFD-640 Software Design Description (SDD) provides a detailed architectural view of the display's software environment. This document translates the functional requirements defined in the SRS into specific software modules, data bus drivers, and memory management strategies.

---

### 1.1 Scope
This document covers the internal software architecture, partition scheduling, and driver logic for the MFD-640. It details how the software manages concurrent data streams from Weather Radar, FMS, and Video sources while maintaining high-fidelity, anti-aliased graphics.

---

### 1.2 Acronyms and Abbreviations

| Abbreviation | Description |
|--------------|-------------|
| SDD | Software Design Description |
| RTOS | Real-Time Operating System |
| HAL | Hardware Abstraction Layer |
| API | Application Programming Interface |
| RGB | Red Green Blue |
| VGA | Video Graphics Array |
| CSDB | Commercial Standard Data Bus |

---

### 1.3 Referenced Documents

#### 1.3.1 External Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | Software Considerations in Airborne Systems | RTCA/DO-178B | - |
| 2 | Multi-Function Displays | FAA TSO-C113 | - |

#### 1.3.2 Internal Documents
| S.No. | Document Name | Document ID | Version |
|-------|---------------|-------------|---------|
| 1 | SyRS | MFD640-SyRS-V1.0 | 1.0 |
| 2 | SRS | MFD640-SRS-V1.0 | 1.0 |

---

## 2 SOFTWARE ARCHITECTURE

### 2.1 Software Hierarchy
The MFD-640 utilizes a layered architecture to ensure modularity and ease of technology insertion:

1. **Hardware Abstraction Layer (HAL):** Interfaces with the I/O board for ARINC 429/708 and VGA acquisition.
2. **Device Drivers:** Specialized drivers for CSDB (RS-422), Discrete I/O, and LED backlight PWM control.
3. **Core Services:** Manages the anti-aliasing engine and 18-bit RGB color mapping.
4. **Application Layer:** Executes mission-specific modules: Weather Radar, Vision-1® SVS, and TAWS.

### 2.2 Task Scheduling and Prioritization
The software uses a deterministic scheduling approach to handle high-rate avionics data without display lag.

| Task ID | Function | Priority | Frequency |
|---------|----------|----------|-----------|
| T_RADAR | ARINC 708/453 Data Processing | High | 50 Hz |
| T_RENDER| Anti-aliased Symbol Generation | High | 60 Hz |
| T_NAV   | FMS Flight Plan & Navaid Parsing | Medium | 10 Hz |
| T_HEALTH| Continuous Built-In Test (CBIT) | Low | 1 Hz |

---

## 3 DETAILED DESIGN

### 3.1 18-bit Graphics Engine Design
The rendering engine is designed to support 256K colors with 6 bits per RGB channel.
- **Anti-Aliasing Logic:** Implemented for lines and text to ensure smooth presentation on the 5.7-inch AMLCD.
- **Gray Shade Mapping:** Specifically optimized for 64 levels per color to enhance 3D terrain and radar return visualization.

### 3.2 Avionics Data Interfacing
The software manages a high-density I/O suite:
- **Radar Driver:** Support for over 20 weather radar types via ARINC 708/453 protocols.
- **Bus Manager:** Concurrent handling of 6 ARINC 429 Rx channels for navaid and FMS data.

---

## 4 INTERFACE DESIGN

### 4.1 External Interfaces
- **VGA Driver:** Manages the acquisition of two external high-resolution video ports.
- **Bezel Controller:** Processes function switch inputs for mode selection (WX, TERM, TRAF, NAV).

---

## 5 DESIGN TRACEABILITY

**Table 5.1 : Traceability Matrix (SDD to SRS)**

| SDD Section | Design Element | SRS Requirement ID | Traceability Status |
|-------------|----------------|--------------------|---------------------|
| 3.1 | Anti-Aliasing Algorithm | MFD640-SRS-002 | Traced |
| 3.2 | ARINC 708 Parser | MFD640-SRS-004 | Traced |
| 4.1 | VGA Video Interface | MFD640-SRS-006 | Traced |

---

## 6 MEMORY MAP & RESOURCE ALLOCATION

| Segment | Address Range | Purpose |
|---------|---------------|---------|
| BOOT_ROM| 0x00000000 - 0x0003FFFF | System Boot & PBIT Logic |
| V_FRAME | 0x00040000 - 0x00AFFFFF | Primary 18-bit Video Framebuffer |
| BUS_DATA| 0x00B00000 - 0x00BFFFFF | ARINC & RS-422 I/O Buffers |

---

## DOCUMENT CONTROL
| Document Information | Details |
|---------------------|---------|
| Document Title | Software Design Description (SDD) |
| Document ID | MFD640-SDD-V1.0 |
| Product Name | MFD-640 Multi-Function Display |
| Version | 1.0 |
| Date | April 17, 2026 |

---

## REVISION HISTORY
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | April 17, 2026 | ArchTech AI | Initial Software Design Baseline |

---
*End of Document*