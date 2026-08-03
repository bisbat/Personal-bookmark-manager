### 1. API Contract (รายละเอียดตัว API)

- *จุดประสงค์: ระบุ Endpoint และ HTTP Methods ทั้งหมดที่ใช้จัดการทรัพยากร (Bookmarks และ User)*
    - `GET /bookmarks` : ดึงรายการ Bookmark ทั้งหมดของผู้ใช้ที่ล็อกอินอยู่
    - `GET /bookmarks/:id` : ดึงข้อมูล Bookmark แบบเจาะจงตาม ID
    - `POST /bookmarks` : สร้าง Bookmark รายการใหม่
    - `PATCH /bookmarks/:id` : แก้ไขข้อมูล Bookmark ตาม ID (ใช้ PATCH เพราะรองรับ Partial Update หรือการแก้ไขข้อมูลเฉพาะบางฟิลด์ เช่น แก้แค่ title หรือ notes)
    - `DELETE /bookmarks/:id` : ลบ Bookmark ตาม ID
    - `GET /me` : ดึงข้อมูล Profile ของผู้ใช้งานปัจจุบันจาก Token
    
    *(**คำแนะนำเพิ่มเติม:** ในมาตรฐาน REST API นิยมใช้คำนามพหูพจน์ เช่น `/bookmarks` มากกว่า `/bookmark` ครับ ผมเลยเติม s ให้ในตัวอย่างนี้)*
    
- **Status Codes***ข้อตกลงในการใช้ HTTP Response Code เพื่อสื่อสารสถานะการทำงาน:*
    - **`200 OK` / `201 Created`** : สำเร็จ (200 สำหรับดึง/แก้ไขข้อมูล, 201 สำหรับสร้างข้อมูลใหม่)
        
        ![Project Screenshot](API_DESIGN(IMG)/image(9).png)
        
        ![Project Screenshot](API_DESIGN(IMG)/image(10).png)
        
    - **`400 Bad Request`** : ข้อมูลที่ส่งมาไม่ผ่านการตรวจสอบ (Validation Error) เช่น ลืมส่ง URL หรือฟอร์แมตผิด
        
        ![Project Screenshot](API_DESIGN(IMG)/image(11).png)
        
    - **`401 Unauthorized`** : เกิดข้อผิดพลาดเกี่ยวกับการยืนยันตัวตน เช่น ไม่ได้แนบ Token มา, Token หมดอายุ หรือ Token ไม่ถูกต้อง
        
        ![Project Screenshot](API_DESIGN(IMG)/image(13).png)
        
    - **`404 Not Found`** : ไม่พบข้อมูลที่ร้องขอ
        - *Security Note:* หากผู้ใช้พยายามเข้าถึง Bookmark ID ที่มีอยู่จริงในระบบ **แต่เป็นของผู้อื่น** ระบบจะบังคับคืนค่า `404 Not Found` (แทนที่จะเป็น 403) เพื่อซ่อนการมีอยู่ของข้อมูลนั้น ป้องกันการคาดเดาหรือสุ่ม ID (ID Enumeration)
            
            ตัวอย่าง จากการยิง Postman เมื่อ bookmark id : 111 ไม่มีอยู่จริง และเมื่อ User คนอื่นพยายามเข้ามาก็ให้ return 404 เพื่อไม่บอกว่ามี Data นี้อยู่จริงๆ เพื่อความปลอดภัยและ private
            
            ![Project Screenshot](API_DESIGN(IMG)/image(12).png)
            
- **Privacy Invariant Enforcement (§3)***กฎความปลอดภัยขั้นเด็ดขาดในการปกป้องข้อมูลส่วนบุคคลแบบ User-Owned Resource:*
    
    ระบบมีการบังคับใช้ความปลอดภัย 2 ชั้น ดังนี้:
    
1. **Authentication Layer:** ใช้ `JwtAuthGuard` ดักจับทุก Request ที่เข้ามา เพื่อยืนยันว่าผู้ใช้มีสิทธิ์เข้าถึง และทำการดึง `userId` ออกมาจาก Token
    
    ![Project Screenshot](API_DESIGN(IMG)/image(8).png)
    
2. **Database / Repository Layer:** ในการ Query ฐานข้อมูลทุกครั้ง (ดึง, แก้ไข, ลบ) มีการบังคับใส่เงื่อนไขดักข้อมูล `where: { id: id, ownerId: user.id }` ควบคู่กันเสมอ เพื่อให้มั่นใจว่าผู้ใช้จะได้เฉพาะกับ Resource ที่ตนเองเป็นเจ้าของเท่านั้น

---

### 2. Post-Mortem / Reflection (การทบทวนข้อผิดพลาดของ AI Agent)

ในการทำงานร่วมกับ AI Agent พบจุดที่ AI ออกแบบหรือเขียนโค้ดพลาดในรอบแรก ซึ่งต้องอาศัยการตรวจสอบและสั่งการแก้ไขดังนี้:

**จุดที่ 1: การจัดการความลับ (Secrets) ในไฟล์ `.env` ที่เสี่ยง**

- **ความผิดพลาด:** ในตอนแรก AI ได้สร้างไฟล์ `.env` เพื่อเก็บค่า Config ต่างๆ และมีการใส่รหัสผ่านจริง (เช่น รหัสผ่านของฐานข้อมูล และ pgadmin) ลงไปตรงๆ แต่ไม่ได้แนะนำแนวทางปฏิบัติที่ปลอดภัยเกี่ยวกับการนำซอร์สโค้ดขึ้น Git ทำให้มีความเสี่ยงสูงที่รหัสผ่านจริงจะถูกอัปโหลดสู่สาธารณะ
- **วิธีตรวจพบ:** ตระหนักได้ก่อนที่จะทำการ Commit โค้ดขึ้น Git ว่าการนำไฟล์ที่มีรหัสผ่านจริงขึ้นระบบ Version Control เป็นเรื่องที่ผิดหลัก Security อย่างร้ายแรง
- **การแก้ไข:** จึงได้สั่งให้ AI หาวิธีการจัดการ Environment Variables ที่ปลอดภัยกว่านี้ AI จึงได้แนะนำแนวทางที่ถูกต้อง โดยให้เพิ่มไฟล์ `.env` ลงใน `.gitignore` ทันที และให้สร้างไฟล์ `.env.example` ซึ่งเป็นเพียงเทมเพลต (ไม่มีรหัสผ่านจริง) เอาไว้ในโปรเจกต์แทน เพื่อให้ปลอดภัยและเป็นมาตรฐานในการทำงานร่วมกับผู้อื่น

**จุดที่ 2: ลืมดักจับกรณีไม่พบข้อมูล (Not Found) ใน Bookmark Service**

- **ความผิดพลาด:** ในตอนแรกที่ AI เขียน `BookmarkService` สำหรับการเรียกดู (GET) หรือแก้ไข (PATCH) ข้อมูล AI ไม่ได้เขียนโค้ดดักจับกรณีที่ Query ข้อมูลไม่เจอ ทำให้ระบบไม่ยอมส่งค่า `404 Not Found` กลับไปให้ Client อย่างที่ควรจะเป็น
- **วิธีตรวจพบ:** ตรวจพบระหว่างการทำยิง API ด้วย Postman แล้วพบว่า Response ไม่ถูกต้องตาม API Contract ที่ออกแบบไว้
- **การแก้ไข:** ได้ส่ง Prompt ย้ำให้ AI เพิ่มลอจิกการตรวจสอบ หากไม่เจอ Bookmark ในฐานข้อมูล (หรือ Bookmark นั้นไม่ใช่ของ User ปัจจุบัน) ให้ Throw `NotFoundException` ออกมาทันที

**จุดที่ 3: การตั้งค่า Prisma Client ไม่ตรงกับเวอร์ชัน (Prisma v.7)**

- **ความผิดพลาด:** ตอนที่ให้ AI สร้าง `PrismaService` สำหรับ NestJS ตัว AI ได้ให้โค้ดการสร้าง Instance แบบเก่า (เช่น การใช้ `new PrismaClient()` ธรรมดาโดยไม่จัดการเรื่อง Lifecycle หรือ Extension) ซึ่งไม่ตรงกับสถาปัตยกรรมของ Prisma v.7
- **วิธีตรวจพบ:** พบปัญหาตอนรันโปรเจกต์ จึงต้องเข้าไปอ่านเอกสารอ้างอิงอย่างเป็นทางการ (อ้างอิง: *NestJS Docs - Recipes/Prisma*) ref : https://docs.nestjs.com/recipes/prisma
- **การแก้ไข:** แม้จะเคยเขียนบริบทโปรเจกต์ไว้ใน `Agent.md` แล้ว แต่ AI น่าจะทำรวน จึงต้องตั้ง Prompt สั่ง AI ใหม่อีกครั้งโดยย้ำชัดเจนว่า "โปรเจกต์นี้ใช้ Prisma v.7" AI จึงเปลี่ยนมาใช้วิธีการตั้งค่า Service ที่ถูกต้องตาม Document

**จุดที่ 4: การจัดการ Redirect หลัง Login ใน Auth0 ขาดความยืดหยุ่น**

- **ความผิดพลาด:** ตอนสร้างระบบ Login ฝั่ง Frontend AI ตั้งค่าการ Redirect กลับมาแบบฮาร์ดโค้ดง่ายๆ เช่น การใช้ `returnTo('/')` ซึ่งไม่ยืดหยุ่นและไม่รองรับกรณีที่ผู้ใช้พยายามเข้าหน้า Protected Route แล้วถูกเด้งไปล็อกอิน
- **วิธีตรวจพบ:** ได้ศึกษาเพิ่มเติมจาก YouTube และตรวจสอบกับ Auth0 Documentation พบว่าการใช้งานร่วมกับ Custom Router (เช่น React Router) ควรใช้ `onRedirectCallback`
- **การแก้ไข:** ได้นำแนวทาง `onRedirectCallback` ไปถาม AI Agent ซึ่ง AI ตรวจสอบแล้วยืนยันว่าเป็น Best Practice จริง จึงให้ AI นำมาตรการนี้มาปรับใช้กับ `Auth0Provider` เพื่อให้สามารถพาย้อนกลับไปยังหน้าที่ผู้ใช้ต้องการก่อนถูกขัดจังหวะ
    
    ![Project Screenshot](API_DESIGN(IMG)/image(1).png)
    
    ![Project Screenshot](API_DESIGN(IMG)/image(2).png)
    
    ![Project Screenshot](API_DESIGN(IMG)/image(3).png)
    
    ![Project Screenshot](API_DESIGN(IMG)/image(4).png)
    
    ![Project Screenshot](API_DESIGN(IMG)/image(5).png)
    
    ![Project Screenshot](API_DESIGN(IMG)/image(6).png)
    
    ![Project Screenshot](API_DESIGN(IMG)/image(7).png)
    
    > **Note** If you are using a custom router, you will need to supply the **`Auth0Provider`** with a custom **`onRedirectCallback`** method to perform the action that returns the user to the protected page. See examples for react-router, Gatsby and Next.js.
    ref : https://auth0.com/docs/libraries/auth0-react
    >