---
title: "Setting Up OpenClaw"
description: "A complete walkthrough on installing and configuring your first autonomous terminal agent on local silicon."
date: 2026-03-24
difficulty: "Beginner"
readTime: "15 Min Read"
---

# Initializing the Agentic Core

Welcome to the Lyceum. In this protocol, we will establish your first local, autonomous terminal agent using the **OpenClaw** framework.

## Prerequisites

Before we begin, ensure your neural-link interface (terminal) has the following dependencies installed:

1. **Node.js v22+**
2. **Local LLM Runner** (e.g., Ollama or LM Studio)
3. **A clean API key** for your choice of fallback inference engine (optional, but recommended).

## Step 1: Clone the Core

Begin by pulling the raw architecture into your local lattice:

```bash
git clone https://github.com/agentic-future/openclaw.git
cd openclaw
npm install
```

## Step 2: Configuration

You must define the behavioral bounds of your agent. Open `.env.example` and rename it to `.env`. 

Set your `SYSTEM_PROMPT_OVERRIDE` to something strict. Remember, an unconstrained agent is a chaotic script.

```env
MODEL_PROVIDER=ollama
LOCAL_MODEL_NAME=llama3:8b
SYSTEM_PROMPT_OVERRIDE="You are an expert systems engineer. Do not execute destructive commands without user confirmation."
```

## Step 3: Ignition

Once the bounds are set, ignite the agentic loop:

```bash
npm run ignite
```

If successful, you will see the terminal glow with the OpenClaw operational dashboard. Welcome to the future. Use it wisely.
