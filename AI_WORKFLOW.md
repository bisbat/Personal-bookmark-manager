## 1. Tools and Models Used

- **Claude 3.5 / Gemini Pro:** วางสถาปัตยกรรม (API Design) และแก้ปัญหาลอจิกซับซ้อน
- **ChatGPT:** สรุป Requirement และระดมไอเดีย
- **Codex GPT-5.6 Terra:** เครื่องมือหลักในการเขียนโค้ด (Auth0, Prisma)
- **GitHub Copilot:** Autocomplete โค้ดพื้นฐาน (Boilerplate) เพื่อความรวดเร็ว

## 2. Work Decomposition

- **Requirement & Planning:** นำโจทย์ตั้งต้นให้ AI ช่วยสรุปและแตก Concept ออกมาเป็นส่วนย่อยๆ เพื่อให้เห็นภาพรวมของสิ่งที่จะต้องทำทั้งหมด และสามารถวางแผนระยะเวลาการทำงานได้อย่างเหมาะสม
- **Context Preparation:** ให้ AI ช่วยร่างไฟล์ `Agent.md` เพื่อใช้เป็น System Prompt หรือคู่มือบริบทของโปรเจกต์ สำหรับนำไปป้อนให้ AI Agent ทำความเข้าใจกฎและทิศทางก่อนเริ่มเขียนโค้ด
- **Backend Setup & Database Design:** ขึ้นโครงโปรเจกต์ NestJS จากนั้นให้ออกแบบตารางข้อมูล (Schema Design) และเชื่อมต่อกับ Prisma ORM เพื่อเตรียมฐานข้อมูลและให้เห็นโครงสร้าง Model ที่ชัดเจน
- **Frontend & Authentication:** ขึ้นโครงโปรเจกต์ฝั่ง Frontend พร้อมกับการติดตั้งและตั้งค่าระบบยืนยันตัวตนด้วย Auth0
- **Core Feature & Security:** พัฒนาระบบจัดการ Bookmark (CRUD Operations) พร้อมกับการทำ `JwtAuthGuard` เพื่อปกป้อง Endpoint และจัดการสิทธิ์ผู้ใช้งาน
- **Testing & Bug Fixing:** ดำเนินการเขียนเทสต์ (E2E Test) และใช้ AI ช่วยวิเคราะห์พร้อมกับแก้ไขบัคที่ตรวจพบ เพื่อให้ระบบทำงานได้ตาม API Contract ที่ออกแบบไว้

## 3. What AI Did Well

- **Boilerplate & UI:** สร้างโครงสร้าง NestJS (Modules, DTOs) และหน้าตา MUI ได้รวดเร็วพร้อมใช้งาน
- **Context Awareness:** เข้าใจโครงสร้างโปรเจกต์และวางไฟล์ได้ถูกต้องตาม Architecture
- **Environment Setup:** แก้ไข Config ซับซ้อน (เช่น Jest กับ Prisma) ได้อย่างตรงจุด

## 4. Where AI Failed & How I Recovered

- **ลืมเปิด Global Validation (เกิด 500 Error):** AI สร้าง DTO แต่ไม่เปิดใช้ Pipe
    - **การแก้ไข:** ตรวจสอบและเพิ่ม `app.useGlobalPipes()` ใน `main.ts` ด้วยตนเอง
- **โค้ดผูกติดกัน (Monolithic):** AI เขียนโค้ดยาวและไม่ยืดหยุ่น
    - **การแก้ไข:** สั่ง Refactor ใหม่เพื่อแยก Component ให้ง่ายต่อการดูแลรักษา
- **สับสนเวอร์ชัน (Version Hallucination):** AI ใช้ Syntax เก่าของ Prisma
    - **การแก้ไข:** อ้างอิงจาก Official Docs และระบุเวอร์ชันใน Prompt เสมอ (เช่น "บังคับใช้ Prisma v.7")
- **คำสั่งตกหล่นเมื่อ Prompt ยาว:** AI ประมวลผลไม่ครบ
    - **การแก้ไข:** แบ่งงานเป็นสเต็ปย่อย (Step-by-step) เพื่อความแม่นยำ

## 5. Prompt Engineering Examples

### The Prompt That Didn't Work

> "สร้าง API สำหรับจัดการ Bookmark ด้วย NestJS ให้หน่อย เอาแบบมีระบบ Auth ด้วย"
**ผลลัพธ์:** AI ให้โค้ดที่ใหญ่เกินไป ทำงานไม่ได้จริง ปะปนกันระหว่าง JWT ธรรมดากับระบบอื่น และไม่มีการป้องกันข้อมูลรั่วไหลระหว่าง User
> 

### The Prompt That Worked

> "Act as an expert NestJS developer. I am building a Bookmark Manager. Write a `BookmarksService` to handle CRUD operations using Prisma.
Strict Requirement:
> 
> 1. Every database query must include `ownerId` extracted from the decoded Auth0 JWT to enforce multi-tenancy.
> 2. Do not trust `ownerId` from the frontend DTO."
> **ผลลัพธ์:** ได้โค้ด Service ที่มีความปลอดภัยสูง โฟกัสเฉพาะจุดที่ต้องการ และนำไปเชื่อมต่อกับ Controller ได้ทันที

## 6. Cost & Token Awareness

- **Error Logs Minimization:** คัดลอกเฉพาะ Stack Trace หรือจุดที่ Error สำคัญ (เช่น `Cannot find module...`) แทนการแนบ Log ทั้งหมด 100 บรรทัด เพื่อประหยัด Token
- กระจาย Token
    - **General Chat AI (ChatGPT/Claude):** เลือกใช้ระดมสมอง สรุปงาน หรือแก้บัคจุดเล็กๆ
    - **AI Agent (Codex):** เลือกใช้วิเคราะห์ภาพรวมโปรเจกต์ การสร้าง Resource ใหม่ และแก้ปัญหาระดับ Integration
    - **AI Assistant (Copilot):** เลือกใช้แก้ไขโค้ดเฉพาะจุดหรือบางบรรทัด เพื่อไม่ให้เปลือง Context Window ของ Agent หลัก