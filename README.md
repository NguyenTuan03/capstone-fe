# Capstone FE — Next.js App

> Frontend app built with **Next.js** + **React** + **Ant Design** + **TanStack Query**.  
> CI/CD to **Vercel** via GitHub Actions.

<p align="left">
  <img alt="node" src="https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white">
  <img alt="next" src="https://img.shields.io/badge/Next.js-15-black?logo=next.js">
  <img alt="react" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=222">
  <img alt="antd" src="https://img.shields.io/badge/Ant%20Design-5-1677FF?logo=antdesign&logoColor=white">
  <img alt="tanstack" src="https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=react-query&logoColor=white">
  <img alt="vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel">
</p>

## 🔥 Features
- **App Router** (`app/`), streaming SSR
- **SEO** with Next `metadata` / `generateMetadata` (helper-friendly)
- **Context providers**: `AppAuthProvider`, `AppContextProvider`
- **UI**: Ant Design 5 + Geist font
- **Data**: TanStack Query 5
- **Code quality**: ESLint + Prettier + Husky + lint-staged + Commitlint
- **CI/CD**: GitHub Actions → Vercel (cloud build, no prebuilt)

## 🧱 Tech Stack
- **Node**: 20.x (pinned)
- **Framework**: Next.js 15 (React 19)
- **UI**: Ant Design
- **Data**: TanStack Query
- **Tools**: ESLint 9, Prettier 3, Husky 9, lint-staged 16, Commitlint 19

## 🗂 Project Structure
.
├─ public/
│  └─ favicon.ico
│
├─ src/
│  ├─ @crema/
│  │  ├─ axios/
│  │  ├─ components/
│  │  ├─ constants/
│  │  ├─ context/
│  │  ├─ core/
│  │  ├─ helper/
│  │  ├─ hooks/
│  │  ├─ middleware/
│  │  ├─ services/
│  │  ├─ types/
│  │  └─ utils/
│  │
│  ├─ app/
│  │  ├─ (auth)/
│  │  ├─ (dashboard)/
│  │  ├─ error.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  ├─ loading.tsx
│  │  ├─ not-found.tsx
│  │  ├─ page.tsx
│  │  ├─ provider.tsx
│  │  └─ template.tsx
│  │
│  └─ modules/
│
├─ .env
├─ .eslintrc.json
└─ .gitattributes

