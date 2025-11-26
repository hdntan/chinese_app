# Trum Chinese Clone --- Ultimate Edition

**End-to-End System: Mobile App + React Admin CMS + Backend API**

---

## 1. Executive Summary

This project aims to build a complete, feature-rich clone of the **Trùm
Chinese** learning platform using a modern monorepo setup.\
It includes three applications:

1.  **Backend API (NestJS + PostgreSQL + Prisma)**\
2.  **Admin Portal (React + Vite + Shadcn/UI)**\
3.  **Mobile App (Flutter + Bloc + Isar)**

The system supports advanced learning features such as Hanzi writing,
spaced repetition (SRS), voice roleplay, and gamification.

---

## 2. Project Objectives

### 🎯 Goal

Recreate the full functionality of Trùm Chinese with enhancements.

### 🧩 Key Features

- Hanzi writing practice\
- Conversation roleplay\
- Gamification & leaderboard\
- Spaced repetition (SM-2 algorithm)\
- Offline learning (mobile)\
- Freemium content model

---

## 3. Monorepo Structure

    /trum-chinese-ecosystem
    ├── /apps
    │   ├── backend-api        # NestJS backend
    │   ├── admin-portal       # React CMS
    │   └── mobile-client      # Flutter app
    ├── /packages
    │   └── shared-types       # DTOs and shared interfaces
    └── README.md

---

## 4. Technology Stack

### Backend API (NestJS)

- NestJS (Node.js)
- PostgreSQL + Prisma ORM
- Redis (cache / leaderboard)
- JWT Auth (access + refresh token)

### Admin Portal (React + Vite)

- React, TypeScript, Vite\
- React Router v6\
- Shadcn/UI + Tailwind\
- TanStack Query\
- React Hook Form + Zod

### Mobile App (Flutter)

- Flutter (Dart)
- Bloc State Management\
- Isar Local Database\
- Dio Networking

---

## 5. Database Schema (Prisma)

_(Trimmed formatting --- fully preserved model definitions)_

```prisma
// ENUMS
enum Role { USER ADMIN }
enum LessonType { VOCABULARY GRAMMAR CONVERSATION }
enum ContentStatus { DRAFT PUBLISHED ARCHIVED }

// USERS
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  role          Role     @default(USER)
  fullName      String?
  avatarUrl     String?
  currentHsk    Int      @default(1)
  gems          Int      @default(0)
  totalXp       Int      @default(0)
  streak        Int      @default(0)
  isPremium     Boolean  @default(false)
  createdAt     DateTime @default(now())
  progress      UserProgress[]
  comments      Comment[]
}

// HSK LEVELS
model HskLevel {
  id          Int      @id @default(autoincrement())
  level       Int      @unique
  name        String
  description String?
  lessons     Lesson[]
}

// LESSONS
model Lesson {
  id           Int           @id @default(autoincrement())
  levelId      Int
  level        HskLevel      @relation(fields: [levelId], references: [id])
  title        String
  description  String?
  type         LessonType    @default(VOCABULARY)
  status       ContentStatus @default(DRAFT)
  isFree       Boolean       @default(false)
  orderIndex   Int
  mediaUrl     String?
  vocabularies Vocabulary[]
  dialogues    DialogueLine[]
  comments     Comment[]
}

// VOCABULARY
model Vocabulary {
  id              Int     @id @default(autoincrement())
  lessonId        Int
  lesson          Lesson  @relation(fields: [lessonId], references: [id])
  hanzi           String
  pinyin          String
  meaningVn       String
  audioUrl        String?
  strokeOrderSvg  String?
  exampleHanzi    String?
  exampleMeaning  String?
  userProgress    UserProgress[]
}

// DIALOGUE LINES
model DialogueLine {
  id            Int @id @default(autoincrement())
  lessonId      Int
  lesson        Lesson @relation(fields: [lessonId], references: [id])
  roleName      String
  avatarUrl     String?
  contentHanzi  String
  contentPinyin String
  meaningVn     String
  audioUrl      String?
  orderIndex    Int
}

// SRS SYSTEM
model UserProgress {
  id           String      @id @default(uuid())
  userId       String
  vocabId      Int
  user         User        @relation(fields: [userId], references: [id])
  vocab        Vocabulary  @relation(fields: [vocabId], references: [id])
  status       String
  easiness     Float       @default(2.5)
  interval     Int         @default(0)
  nextReviewAt DateTime    @default(now())
  @@unique([userId, vocabId])
}

// COMMENTS
model Comment {
  id        Int      @id @default(autoincrement())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  lessonId  Int
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  content   String
  createdAt DateTime @default(now())
}
```

---

## 6. Feature Specifications

### Admin Portal

- Course manager (HSK levels, lessons)
- Vocabulary builder (Hanzi, Pinyin, audio)
- Conversation editor
- SVG writing-stroke input panel
- Login + role-based access

### Mobile App

- Writing practice using `CustomPainter`
- Speaking roleplay (play audio → record → compare)
- Flashcard with SRS algorithm
- Offline mode (Isar)
- Premium access logic

### Backend Logic

- RBAC guards
- SRS calculation service
- Media upload (audio, images)
- Swagger documentation

---

## 7. Execution Roadmap

### Phase 1 --- Backend

- Bootstrap monorepo
- Initialize NestJS
- Setup Prisma schema + migrations
- Seed HSK Level 1

### Phase 2 --- Admin

- Init Vite (React + TS)
- Setup routing + auth
- CRUD for Vocabulary, Lessons, Levels

### Phase 3 --- Mobile

- Init Flutter
- Integrate Flashcards and SRS
- Implement Writing Mode
- Implement Conversation Mode

---

## Starting Instructions

**Begin with generating the monorepo folder structure and Prisma
schema.**
