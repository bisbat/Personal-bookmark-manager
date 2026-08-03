# Architecture Decision Records (ADRs)

### ADR 1: การจัดการฟีเจอร์ Collection Sharing (โจทย์ข้อ 3.3)

- **ความคลุมเครือ (Ambiguity):** โจทย์มีการกล่าวถึง "A user may want to share a collection with someone else" แต่ไม่มีรายละเอียดเกี่ยวกับ Permission Model, การส่งคำเชิญ (Invite Flow) หรือขอบเขตการเข้าถึง
- **การตัดสินใจ (Decision):** ตัดสินใจ **ไม่ทำ (Not implemented)** ในเวอร์ชันนี้ (Scope Cut)
- **สิ่งที่ยอมแลก (Trade-off):** ยอมให้โปรเจกต์นี้ไม่มีฟีเจอร์การแชร์ตามที่โจทย์บอกใบ้ไว้ เพื่อนำเวลาไปโฟกัสกับ Core CRUD, ระบบ Auth และการทำ E2E Testing ซึ่งมีสัดส่วนคะแนนสูงกว่า (60/100) การทำระบบแชร์แบบครึ่งๆ กลางๆ ภายใต้เวลาที่จำกัดจะสร้างความเสี่ยงด้าน Security ทะลุ Invariant (ข้อมูลรั่วไหล) มากกว่าไม่ทำเลย
- **การออกแบบเผื่ออนาคต (Extensibility):** ออกแบบฟิลด์ `ownerId` ให้เรียบง่าย หากอนาคตต้องการเพิ่มฟีเจอร์นี้ สามารถสร้าง Join table (`CollectionShare`) เพื่อขยายสิทธิ์ได้โดยไม่ต้องรื้อ Schema เดิม

### ADR 2: รูปแบบการยืนยันตัวตน (OAuth2 Authentication Flow)

- **ความคลุมเครือ (Ambiguity):** Auth0 Tenant (Discovery Document) รองรับทั้งรูปแบบ Implicit Flow (`token`, `id_token`) และรูปแบบ PKCE (`plain`, `S256`)
- **การตัดสินใจ (Decision):** บังคับใช้ **Authorization Code Flow + PKCE (S256)** เท่านั้น ห้ามใช้ Implicit Flow และ `plain` เด็ดขาด
- **สิ่งที่ยอมแลก (Trade-off):** การเขียนโค้ดฝั่ง Frontend มีขั้นตอนยุ่งยากขึ้นเพราะต้องมีจังหวะ Code Exchange แต่แลกมากับมาตรฐานความปลอดภัย ป้องกันการดักจับ Token (Interception) ได้ดีกว่า Implicit Flow

### ADR 3: การเลือกประเภทของ Token สำหรับยืนยันตัวตนที่ Backend API

- **ความคลุมเครือ (Ambiguity):** ควรใช้ Token ประเภทใด (Access Token vs. ID Token) เป็น Bearer Credential ส่งไปหา Backend
- **การตัดสินใจ (Decision):** เลือกใช้ **Access Token**
- **สิ่งที่ยอมแลก (Trade-off):** ฝั่ง Frontend ต้องระบุ API Audience (`https://bbl-candidate-test-api`) เพิ่มเติมตอนทำ Auth Request แต่ออกแบบได้ถูกต้องตามสถาปัตยกรรม OAuth2 อย่างแท้จริง (Access Token ใช้สำหรับ Resource Server ส่วน ID Token ใช้สำหรับ Client เท่านั้น)
- **วิธีบังคับ AI (AI Steering):** AI มักจะสับสนและพยายามดึง ID Token มาใช้ทำ Authorization header จึงต้องบังคับใน Prompt ให้ "ดึงค่า `access_token` มาใส่เป็น Bearer token เท่านั้น และตั้งค่า audience ให้ตรงกับ API ที่เตรียมไว้"