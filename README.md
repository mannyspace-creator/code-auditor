#  Code-Auditor

> **Automated AI Static Code Auditor for Students & Entry-Level Engineers**  
> *Built for the NextGen AI Hackathon (Work & Grow Tracks)*

[![Live Deployment](https://img.shields.io/badge/Live%20Demo-ai--code--auditor.up.railway.app-purple?style=for-the-badge&logo=railway)](https://ai-code-auditor.up.railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Groq Engine](https://img.shields.io/badge/Inference-Groq_API-orange?style=for-the-badge)](https://groq.com)

---

## Problem Statement

Students and entry-level developers often lack access to senior engineering mentorship to review their code for security vulnerabilities, memory leaks, and performance anti-patterns. 

When turning to general conversational AI tools (like raw ChatGPT), they encounter major operational barriers:
1. **Unstructured & Chatty Output:** Conversational models output walls of text that obscure actionable fixes and require repeated prompting.
2. **Severe Model Hallucinations:** Unconstrained completion models frequently invent fake line numbers, non-existent syntax rules, or false security flaws.
3. **Cost & Infrastructure Barriers:** Traditional static analysis tools or premium API subscriptions are often locked behind paywalls, complex setup scripts, or heavy local hardware requirements.

---

##  Solution

**Code-Auditor** is a lightweight, completely free, web-based static code auditing tool. It transforms open-weights AI models into a deterministic engineering utility—delivering instantaneous, line-by-line code reviews without chatty fluff or subscription costs.

###  Key Features
*  **Instant Analysis:** Low-latency parsing powered by Groq's high-speed inference engine.
*  **Anti-Hallucination Pipeline:** Enforces strict JSON schemas and low-temperature parameters to eliminate hallucinated line numbers and syntax rules.
*  **Security & Bug Scanning:** Detects OWASP Top 10 risks, runtime exceptions, memory leaks, and code smells.
*  **Developer-First UX:** Clean UI delivering categorized severities, exact line locations, and copyable refactor snippets.
*  **Zero-Cost Access:** 100% free web app designed for students operating under device, data, and budget constraints.

---

## ⚙️ Architecture & Anti-Hallucination Pipeline

General LLMs hallucinate because they run open-ended text completion. Code-Auditor prevents drift using a 3-tier deterministic pipeline:
1. **Structured Schema Enforcement:** Uses Groq's `response_format: { type: "json_object" }` to bind model output to typed fields (`line_number`, `vulnerability_type`, `severity`, `suggested_fix`).
2. **Deterministic Parameters:** Runs low-temperature inference ($\text{temp} = 0.1$) to stop creative drift and ensure repeatable analysis.
3. **Line-Numbered Parsing:** Formats incoming code blocks with explicit line indexing before passing context to the inference engine.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js (App Router), TypeScript, React |
| **Styling & UI** | Tailwind CSS, shadcn/ui |
| **AI Inference** | Groq API (`llama-3.3-70b` / open-weights) |
| **Containerization** | Docker |
| **Deployment** | Railway (Live on Port 8080) |

---

## 🎯 NextGen AI Hackathon Alignment

* **Work Track:** Helps students and entry-level developers write production-ready code, proving real-world engineering capabilities to employers and clients.

* **Grow Track:** Acts as an automated senior reviewer, providing continuous feedback loops and immediate evidence-based learning without subscription barriers.