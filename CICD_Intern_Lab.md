# 🚀 CI/CD Basics with GitHub Actions — Intern Hands-On Lab

**A Two-Part Hands-On Lab for Learning Continuous Integration & Continuous Deployment**

---

## 📋 Lab Overview

| Attribute        | Details                                      |
|------------------|----------------------------------------------|
| **Audience**     | College interns with basic Git/GitHub skills |
| **Duration**     | 2 hours total (Part 1: 60 min, Part 2: 60 min) |
| **Stack**        | Node.js · Express · Jest · GitHub Actions · Render.com |
| **Difficulty**   | Beginner–Intermediate                        |
| **Outcome**      | A live, auto-deploying web API on the internet |

### What You Will Build

By the end of this lab you will have:

- A **Node.js Express API** with automated tests
- A **GitHub Actions CI pipeline** that runs every time you push code
- A **live deployment on Render.com** that updates automatically after every successful test run

---

## ✅ Prerequisites

Complete all of the following **before** the lab begins.

### 🛠️ Tools to Install

#### 1. Node.js v20 LTS
Node.js is the runtime that executes JavaScript on your machine. **npm** (Node Package Manager) is bundled with it and is used to install libraries.

- Download from: **https://nodejs.org** → click "LTS" (Long-Term Support)
- Run the installer and accept all defaults

#### 2. Git
Git is the version control system that powers GitHub.

- Download from: **https://git-scm.com/downloads**
- Accept all defaults during installation

#### 3. Visual Studio Code (VS Code)
A free, powerful code editor.

- Download from: **https://code.visualstudio.com**

#### 4. Recommended VS Code Extensions
After installing VS Code, open it and install these extensions (click the Extensions icon on the left sidebar or press `Ctrl+Shift+X`):

| Extension Name   | Publisher | Why                              |
|------------------|-----------|----------------------------------|
| **ESLint**       | Microsoft | Highlights code style issues     |
| **GitHub Actions** | GitHub  | Syntax highlighting for YAML workflows |

---

### 🔑 Accounts to Create

#### 1. GitHub Account
You likely already have one! If not, sign up at **https://github.com**.

#### 2. Render.com Account
Render.com is a free cloud platform where we will deploy our app.

1. Go to **https://render.com**
2. Click **Get Started for Free**
3. Sign up using your **GitHub account** (this links the two accounts — important for later!)
4. Verify your email address

---

### ✔️ Verify Your Installation

Open a terminal (Command Prompt, PowerShell, or Terminal on Mac) and run the following commands. Make sure the outputs match:

```bash
node --version
```
> **Expected:** `v20.x.x` (any v20 version is fine)

```bash
npm --version
```
> **Expected:** `10.x.x`

```bash
git --version
```
> **Expected:** `git version 2.x.x`

> 💡 **Tip:** If any command is not found, restart your terminal after installation and try again.

---

---

# PART 1 — CI: Build & Test ⚙️

**Estimated time: 60 minutes**

---

## 1.1 — Key Concepts (5 min)

### What is CI/CD?

**Continuous Integration (CI)** is the practice of automatically building and testing your code every time you push a change. The goal: catch bugs *early*, before they reach your teammates or your users.

**Continuous Deployment (CD)** takes it one step further — if the tests pass, the code is automatically deployed to a live environment. No manual steps, no forgotten procedures.

### GitHub Actions Key Terms

| Term         | What It Means                                                           |
|--------------|-------------------------------------------------------------------------|
| **Workflow** | The full automation script, written in a YAML file                      |
| **Trigger**  | The event that starts the workflow (e.g., a `git push`)                 |
| **Job**      | A group of steps that run on the same machine                           |
| **Step**     | A single task inside a job (e.g., "run tests")                          |
| **Runner**   | The virtual machine (provided by GitHub, for free) that runs your jobs  |
| **Action**   | A reusable building block you can plug into your steps                  |

### The CI Pipeline at a Glance

```
Developer pushes code
        │
        ▼
  GitHub detects push
        │
        ▼
  GitHub spins up a Runner (Ubuntu VM)
        │
        ▼
  ┌─────────────────────────────┐
  │  Step 1: Checkout code      │
  │  Step 2: Install Node.js    │
  │  Step 3: npm ci             │
  │  Step 4: npm test           │
  └─────────────────────────────┘
        │
   ┌────┴────┐
   ▼         ▼
  ✅ PASS   ❌ FAIL
 (green)   (red — team is notified)
```

---

## 1.2 — Create Your GitHub Repository (5 min)

**Step 1:** Go to **https://github.com** and log in.

**Step 2:** Click the **+** icon (top right) → **New repository**.

**Step 3:** Fill in the form:
- **Repository name:** `cicd-intern-lab`
- **Visibility:** Public
- ✅ Check **Add a README file**
- Click **Create repository**

**Step 4:** Clone the repository to your laptop. Copy the HTTPS URL from the green **Code** button on your repo page, then run:

```bash
git clone https://github.com/YOUR-USERNAME/cicd-intern-lab.git
```

**Step 5:** Navigate into the project folder:

```bash
cd cicd-intern-lab
```

**Step 6:** Open the project in VS Code:

```bash
code .
```

> 💡 **Tip:** If `code .` does not work on Mac, open VS Code, press `Cmd+Shift+P`, type "shell command", and select **Install 'code' command in PATH**.

---

## 1.3 — Build the Node.js Application (15 min)

You will build a simple web API with three endpoints. Do not worry about the app being complex — the point is the pipeline around it!

### Step 1: Initialize the Node.js project

In your terminal (make sure you are inside the `cicd-intern-lab` folder):

```bash
npm init -y
```

> **Expected output:** A new `package.json` file is created in your folder.

### Step 2: Install Dependencies

```bash
npm install express
npm install --save-dev jest supertest
```

- **express** — the web framework for building the API
- **jest** — the test framework
- **supertest** — lets us make fake HTTP requests in tests without starting a real server

> **Expected output:** A `node_modules` folder and `package-lock.json` appear.

### Step 3: Update `package.json`

Open `package.json` and find the `"scripts"` section. Replace it so it looks like this:

```json
"scripts": {
  "start": "node index.js",
  "test": "jest"
}
```

Your full `package.json` should look similar to this:

```json
{
  "name": "cicd-intern-lab",
  "version": "1.0.0",
  "description": "CI/CD Intern Lab - Node.js Express App",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.0.0"
  }
}
```

### Step 4: Create `index.js`

Create a new file called `index.js` in the root of your project and paste the following code:

```javascript
// index.js — Our simple Express API

const express = require('express');
const app = express();

// Route 1: Home route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from CI/CD Lab!', status: 'ok' });
});

// Route 2: Health check route (useful for monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Route 3: Add two numbers
app.get('/add/:a/:b', (req, res) => {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);
  res.json({ result: a + b });
});

// Start the server only if this file is run directly (not during tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app so tests can use it
module.exports = app;
```

> 💡 **Notice** the `if (require.main === module)` check. This means the server only starts when you run `node index.js` directly. During tests, only the app logic is loaded — no port conflicts!

### Step 5: Create `index.test.js`

Create a new file called `index.test.js` in the root of your project:

```javascript
// index.test.js — Automated tests for our API

const request = require('supertest');
const app = require('./index');

// Test 1: Home route
test('GET / returns a welcome message', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Hello from CI/CD Lab!');
});

// Test 2: Health check route
test('GET /health returns healthy status', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('healthy');
});

// Test 3: Add route
test('GET /add/3/4 returns 7', async () => {
  const response = await request(app).get('/add/3/4');
  expect(response.status).toBe(200);
  expect(response.body.result).toBe(7);
});
```

### Step 6: Run Tests Locally First

Before pushing to GitHub, always make sure the tests pass on your own machine:

```bash
npm test
```

**Expected output:**

```
PASS  ./index.test.js
  ✓ GET / returns a welcome message (xx ms)
  ✓ GET /health returns healthy status (xx ms)
  ✓ GET /add/3/4 returns 7 (xx ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

> 🎉 **3 tests passing locally!** Now let's automate this with GitHub Actions.

---

## 1.4 — Create the GitHub Actions CI Workflow (20 min)

### Step 1: Create the Workflows Folder

GitHub Actions looks for workflow files in a specific folder. Create it:

```bash
mkdir -p .github/workflows
```

### Step 2: Create the CI Workflow File

Create a file at `.github/workflows/ci.yml` and paste the following:

```yaml
# .github/workflows/ci.yml
# This is our Continuous Integration (CI) pipeline.
# It runs every time code is pushed to main or a Pull Request is opened.

name: CI Pipeline   # The name shown in the GitHub Actions tab

on:                 # 'on' defines WHEN this workflow runs (the trigger)
  push:
    branches: [main]           # Run on every push to the main branch
  pull_request:
    branches: [main]           # Run on every PR targeting main

jobs:               # A workflow can have one or more jobs
  build-and-test:   # This is the job name (you can name it anything)
    runs-on: ubuntu-latest     # Use a fresh Ubuntu Linux virtual machine

    steps:          # Steps run in order, top to bottom

      # Step 1: Download (checkout) your code onto the runner
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 2: Install Node.js version 20 on the runner
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'         # Cache node_modules to speed up future runs

      # Step 3: Install dependencies (npm ci is faster and stricter than npm install)
      - name: Install dependencies
        run: npm ci

      # Step 4: Run the tests!
      - name: Run tests
        run: npm test
```

> 💡 **`npm ci` vs `npm install`:** `npm ci` (clean install) uses `package-lock.json` for exact, reproducible installs. It is the correct choice for CI pipelines because it ensures the same versions every time.

### Step 3: Create a `.gitignore` File

We do not want to push `node_modules` to GitHub (it is huge!). Create a `.gitignore` file:

```
node_modules/
.env
coverage/
```

---

## 1.5 — Push and Watch the Pipeline (10 min)

### Step 1: Stage and commit all your files

```bash
git add .
git commit -m "feat: add express app with tests and CI workflow"
```

### Step 2: Push to GitHub

```bash
git push origin main
```

### Step 3: Watch the pipeline run!

1. Go to your repository on **GitHub.com**
2. Click the **Actions** tab (near the top of the page)
3. You will see your workflow **"CI Pipeline"** listed — click it
4. Click the run to see the live log

**What you should see:**

```
✅  Checkout code          — 2s
✅  Set up Node.js         — 8s
✅  Install dependencies   — 15s
✅  Run tests              — 5s

All steps passed! 🟢
```

> 🎉 **You just ran your first CI pipeline!** Every future push to `main` will automatically trigger this.

---

## 1.6 — Break It On Purpose! (5 min)

This is one of the most important exercises. You need to feel what a broken pipeline looks like.

### Step 1: Introduce a bug in the test

Open `index.test.js` and change the expected result in Test 3:

```javascript
// Change this line:
expect(response.body.result).toBe(7);

// To this (wrong answer!):
expect(response.body.result).toBe(99);
```

### Step 2: Commit and push

```bash
git add .
git commit -m "test: intentionally break a test"
git push origin main
```

### Step 3: Go to the Actions tab and watch it fail

You will see a **red ❌** on the run. Click into it — the logs will show exactly which test failed and why.

### Step 4: Fix it and push again

Change the expected value back to `7`, then:

```bash
git add .
git commit -m "fix: restore correct test assertion"
git push origin main
```

Watch the pipeline go **green ✅** again.

> **🔑 Key Lesson:**
>
> *"This is exactly how CI protects your team. A broken test means a broken pipeline. The pipeline acts as a safety net — bad code never silently slips through. Your entire team is notified immediately when something breaks, and nothing gets deployed until it is fixed."*

---

---

# PART 2 — CD: Deploy to Render.com 🌐

**Estimated time: 60 minutes**

---

## 2.1 — Key Concepts (5 min)

### What is CD?

There are two related terms:

| Term                          | Meaning                                                                |
|-------------------------------|------------------------------------------------------------------------|
| **Continuous Delivery**       | Code is always *ready* to deploy — but a human presses the button      |
| **Continuous Deployment**     | Code is deployed *automatically* after every passing CI run            |

In this lab, we will practice **Continuous Deployment** — fully automated, zero manual steps.

### How Render.com Deploy Hooks Work

Render.com gives each web service a **Deploy Hook URL** — a secret web address. When anything calls that URL (even with a simple `curl` command), Render immediately starts a new deployment of your app.

Our GitHub Actions CD job will call this URL after the tests pass.

### The Full CI/CD Pipeline

```
Developer pushes to main
        │
        ▼
  GitHub Actions triggers
        │
        ▼
  ┌──────────────────────┐
  │  Job 1: CI           │
  │  - Checkout          │
  │  - Install           │
  │  - Run Tests ✅      │
  └──────────────────────┘
        │ (only if Job 1 passes)
        ▼
  ┌──────────────────────┐
  │  Job 2: CD           │
  │  - Call Deploy Hook  │
  └──────────────────────┘
        │
        ▼
  Render.com starts deploy
        │
        ▼
  🌐 Live URL is updated!
```

---

## 2.2 — Sign Up for Render.com (5 min)

> ⚠️ **Skip this step if you already signed up during Prerequisites.**

1. Go to **https://render.com**
2. Click **Get Started for Free**
3. Choose **Sign up with GitHub** — this is important! It links Render to your repos.
4. Authorise the GitHub connection when prompted
5. Verify your email if required

---

## 2.3 — Deploy the App to Render for the First Time (15 min)

We will first do a manual deployment via the Render dashboard. After this section, you will automate it with GitHub Actions.

### Step 1: Make sure your code is up to date on GitHub main

```bash
git status
git push origin main
```

### Step 2: Create a New Web Service on Render

1. Log into **render.com** → click **New +** → select **Web Service**
2. Under "Source Code", choose **Connect a repository**
3. Find and select your **cicd-intern-lab** repository
4. Click **Connect**

### Step 3: Configure the Web Service

Fill in the configuration form:

| Field              | Value                  |
|--------------------|------------------------|
| **Name**           | `cicd-intern-lab`      |
| **Region**         | US East (Oregon) or closest to you |
| **Branch**         | `main`                 |
| **Runtime**        | `Node`                 |
| **Build Command**  | `npm install`          |
| **Start Command**  | `node index.js`        |
| **Instance Type**  | **Free**               |

> ⚠️ **Important:** Make sure Instance Type is set to **Free** — no credit card required!

### Step 4: Deploy!

Click **Create Web Service**. Render will:
1. Pull your code from GitHub
2. Run `npm install`
3. Run `node index.js`

This takes **2–3 minutes** for the first deploy. Watch the log scroll by — it is the same kind of output you see in GitHub Actions!

### Step 5: Visit your live app!

When the status shows **"Live"**, click the URL at the top of the page (it looks like `https://cicd-intern-lab-xxxx.onrender.com`).

Visit these URLs in your browser:
- `https://your-app.onrender.com/` → should show `{"message":"Hello from CI/CD Lab!","status":"ok"}`
- `https://your-app.onrender.com/health` → should show `{"status":"healthy"}`
- `https://your-app.onrender.com/add/3/4` → should show `{"result":7}`

> 🎉 **Your app is live on the internet!** Anyone in the world can visit that URL.

> 💡 **Note on Free Tier:** Render free tier services "spin down" after 15 minutes of inactivity. The first request after inactivity may take ~30 seconds to respond. This is normal for the free tier.

---

## 2.4 — Get the Deploy Hook & Disable Auto-Deploy (10 min)

Right now, Render auto-deploys any time you push to `main`. We want **GitHub Actions** to be in control of deployments (only deploy if tests pass!). So we will:  
1. Get the deploy hook URL
2. Turn off Render's auto-deploy
3. Store the deploy hook URL safely as a GitHub Secret

### Step 1: Find the Deploy Hook

1. In your Render dashboard, click on your **cicd-intern-lab** service
2. Click **Settings** in the left menu
3. Scroll down to find the **Deploy Hook** section
4. Copy the full URL — it looks like:
   `https://api.render.com/deploy/srv-abc123...`

> ⚠️ **This URL is a secret!** Anyone with this URL can trigger a deployment of your app. Treat it like a password.

### Step 2: Disable Auto-Deploy on Render

Still in **Settings**:
1. Find the **Auto-Deploy** section
2. Click **Edit** → set to **No**
3. Click **Save**

From now on, Render will **only** deploy when your GitHub Actions workflow calls the deploy hook. If your tests fail, no deployment happens. ✅

### Step 3: Store the Deploy Hook as a GitHub Secret

GitHub Secrets let you store sensitive values (like passwords or URLs) securely. Workflows can use them without the value ever appearing in the YAML file or logs.

1. Go to your **GitHub repository**
2. Click **Settings** (tab at the top of the repo page)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Fill in:
   - **Name:** `RENDER_DEPLOY_HOOK_URL`
   - **Secret:** paste the deploy hook URL you copied from Render
6. Click **Add secret**

> 💡 **How secrets work in GitHub Actions:** In your workflow YAML, you reference the secret as `${{ secrets.RENDER_DEPLOY_HOOK_URL }}`. GitHub replaces this at runtime with the actual value, but **never shows it in logs** — it appears as `***`.

---

## 2.5 — Update the Workflow to Add the CD Job (15 min)

Now we update `.github/workflows/ci.yml` to add a second job for deployment. Replace the entire file with this:

```yaml
# .github/workflows/ci.yml
# Full CI/CD Pipeline: Build, Test, and Deploy

name: CI/CD Pipeline

on:
  push:
    branches: [main]     # Triggers on push to main
  pull_request:
    branches: [main]     # Also triggers on PRs (CI only — deploy job is skipped on PRs)

jobs:
  # ─────────────────────────────────────────
  # JOB 1: Continuous Integration
  # ─────────────────────────────────────────
  build-and-test:
    name: Build & Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

  # ─────────────────────────────────────────
  # JOB 2: Continuous Deployment
  # ─────────────────────────────────────────
  deploy:
    name: Deploy to Render
    runs-on: ubuntu-latest
    needs: build-and-test          # ONLY runs if build-and-test succeeds ✅
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    #   ↑ Only deploy on pushes to main — NOT on pull requests

    steps:
      - name: Trigger Deploy to Render
        run: curl "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
        #         ↑ Calls the secret Render deploy hook URL
        #           This tells Render: "deploy the latest code now!"
```

### Key things to notice in this YAML:

| Feature | Line | What it does |
|---------|------|-------------|
| `needs: build-and-test` | deploy job | Makes deploy wait for CI to pass |
| `if: github.ref == 'refs/heads/main' && github.event_name == 'push'` | deploy job | Skips deploy on Pull Requests |
| `${{ secrets.RENDER_DEPLOY_HOOK_URL }}` | curl step | Uses the secret you stored — never hardcoded |

---

## 2.6 — Push and Watch the Full Pipeline! (10 min)

### Step 1: Make a visible change to the app

Open `index.js` and update the home route message:

```javascript
// Change this line:
res.json({ message: 'Hello from CI/CD Lab!', status: 'ok' });

// To this:
res.json({ message: 'Hello from CI/CD Lab - v2!', status: 'ok' });
```

Also update `index.test.js` to match:

```javascript
// Change this line:
expect(response.body.message).toBe('Hello from CI/CD Lab!');

// To this:
expect(response.body.message).toBe('Hello from CI/CD Lab - v2!');
```

### Step 2: Commit and push

```bash
git add .
git commit -m "feat: update welcome message to v2"
git push origin main
```

### Step 3: Watch GitHub Actions

Go to your repo → **Actions** tab. You will now see **two jobs** running:

```
✅  Build & Test     — completes first
        │
        ▼ (only because tests passed)
✅  Deploy to Render — calls the deploy hook
```

### Step 4: Watch Render deploy

Switch to your **Render dashboard** → you will see a new deployment starting in the Logs section.

### Step 5: Visit your live URL

Once Render shows **"Live"**, visit your app URL again:

```
https://your-app.onrender.com/
```

You should now see:
```json
{"message":"Hello from CI/CD Lab - v2!","status":"ok"}
```

> 🎉 **Congratulations! You just completed a full CI/CD cycle!**
> 
> Push code → Tests run automatically → If they pass → App deploys automatically → Live URL updates.
> 
> This is what professional DevOps teams do, every single day.

---

## 2.7 — The PR Gate: Protecting Main (5 min)

This section demonstrates one of the most important practices in professional development: **code cannot be deployed without passing tests AND a code review**.

### Step 1: Create a new branch

```bash
git checkout -b feature/add-goodbye-route
```

### Step 2: Add a new route in `index.js`

```javascript
// Add this new route in index.js
app.get('/goodbye', (req, res) => {
  res.json({ message: 'Goodbye! See you next time.' });
});
```

### Step 3: Add a test in `index.test.js`

```javascript
// Add this new test in index.test.js
test('GET /goodbye returns goodbye message', async () => {
  const response = await request(app).get('/goodbye');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Goodbye! See you next time.');
});
```

### Step 4: Commit and push the branch

```bash
git add .
git commit -m "feat: add goodbye route"
git push origin feature/add-goodbye-route
```

### Step 5: Open a Pull Request

1. Go to your GitHub repository
2. You will see a yellow banner: **"Compare & pull request"** — click it
3. Add a description and click **Create pull request**

### Step 6: Observe the pipeline behaviour

- The **CI job (Build & Test) RUNS** on the PR — protecting `main` from broken code
- The **Deploy job does NOT run** — no deployment happens from a PR branch

### Step 7: Merge the PR

Once CI is green:
1. Click **Merge pull request** → **Confirm merge**
2. The merge to `main` triggers the **full pipeline** — CI → Deploy
3. Your new `/goodbye` route goes live automatically!

> **🔑 Key Lesson:**
>
> *"PRs are protected by CI. Developers can't accidentally break production because:*
> *(1) Tests must pass before merging, and*
> *(2) Only code merged to main gets deployed.*
> *This workflow is used at virtually every professional software company."*

---

---

# 🏆 Challenge Extensions

**For faster learners — try these after completing both parts!**

---

## Challenge 1 — Add a Lint Step 🧹

**What is linting?** A linter checks your code for style issues and potential bugs *without running it*. It is like a spell-checker for code.

**Steps:**

1. Install ESLint:
```bash
npm install --save-dev eslint
```

2. Create `.eslintrc.json` in your project root:
```json
{
  "env": {
    "node": true,
    "es2021": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2021
  }
}
```

3. Add a lint script to `package.json`:
```json
"scripts": {
  "start": "node index.js",
  "test": "jest",
  "lint": "eslint ."
}
```

4. Add a lint step to your CI workflow **before** the test step:
```yaml
- name: Run linter
  run: npm run lint
```

5. **Test the challenge:** Introduce a lint error (e.g., use `var` instead of `const`). Push and watch the pipeline fail at the lint step. Fix it and watch it pass!

---

## Challenge 2 — Matrix Testing: Run on Multiple Node Versions 🔢

Real applications need to work across multiple Node.js versions. A matrix strategy runs the same job in parallel on multiple versions.

Update the `build-and-test` job in `ci.yml`:

```yaml
build-and-test:
  name: Build & Test (Node ${{ matrix.node-version }})
  runs-on: ubuntu-latest
  strategy:
    matrix:
      node-version: [18, 20, 22]   # Runs three parallel jobs!

  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}   # Uses the matrix value
        cache: 'npm'
    - run: npm ci
    - run: npm test
```

Push and go to the Actions tab — you will see **3 parallel jobs** running simultaneously!

---

## Challenge 3 — Add a Multiply Endpoint 🧮

Practice the full feature branch workflow end to end:

1. Create a new branch: `feature/add-multiply-route`
2. Add `GET /multiply/:a/:b` to `index.js` that returns `{ result: a * b }`
3. Write a test for it
4. Push the branch, open a PR
5. Watch CI run on the PR
6. Merge to main
7. Watch the full CI/CD pipeline run and deploy

---

## Challenge 4 — Add a Workflow Status Badge to README 🏅

A status badge shows the current pipeline status right on your README — green for passing, red for failing. Every professional open-source project has these!

**Steps:**

1. Go to your repository on GitHub → **Actions** tab
2. Click on your **CI/CD Pipeline** workflow in the left sidebar
3. Click the **...** (three dots) menu → **Create status badge**
4. Copy the Markdown snippet
5. Paste it at the top of your `README.md`
6. Commit and push

Your README will now display a live badge like: `![CI/CD Pipeline](passing)`

---

---

# 📖 Appendix — Quick Reference Cheat Sheet

---

## Git Commands Used in This Lab

| Command | What It Does |
|---------|-------------|
| `git clone <url>` | Download a repository to your local machine |
| `git status` | Show which files have changed |
| `git add .` | Stage all changed files for commit |
| `git commit -m "message"` | Save staged changes with a description |
| `git push origin main` | Upload commits to GitHub |
| `git checkout -b feature/name` | Create a new branch and switch to it |
| `git push origin feature/name` | Push a feature branch to GitHub |

---

## GitHub Actions YAML Key Terms

| Term | Example | Meaning |
|------|---------|---------|
| `name:` | `name: CI/CD Pipeline` | Display name in the Actions tab |
| `on:` | `on: push:` | When to trigger the workflow |
| `jobs:` | `jobs: build-and-test:` | Defines jobs in the workflow |
| `runs-on:` | `runs-on: ubuntu-latest` | Which OS/VM to use |
| `steps:` | `steps: - name: ...` | List of tasks in the job |
| `uses:` | `uses: actions/checkout@v4` | Use a pre-built Action |
| `run:` | `run: npm test` | Run a shell command |
| `needs:` | `needs: build-and-test` | Wait for another job first |
| `if:` | `if: github.ref == 'refs/heads/main'` | Conditional execution |
| `secrets.*` | `${{ secrets.MY_SECRET }}` | Reference a stored secret |

---

## Render.com Key Concepts

| Term | Meaning |
|------|---------|
| **Web Service** | A running application hosted on Render |
| **Build Command** | Command run once to install/build (e.g., `npm install`) |
| **Start Command** | Command run to start the app (e.g., `node index.js`) |
| **Deploy Hook** | A secret URL that triggers a deployment when called |
| **Auto-Deploy** | Render's built-in feature to deploy on every push (we disabled this) |
| **Free Tier** | No cost, but spins down after 15 min of inactivity |

---

## Common Errors & Fixes

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `npm ci` fails in pipeline | `package-lock.json` is missing | Run `npm install` locally, commit `package-lock.json` |
| Tests pass locally but fail in CI | Node version mismatch | Make sure `node-version: 20` in YAML matches your local version |
| Deploy hook returns `400 Bad Request` | Secret name does not match | Check the secret name is exactly `RENDER_DEPLOY_HOOK_URL` |
| `Error: listen EADDRINUSE: address already in use` | Port 3000 is already taken | Kill the existing process or change the PORT in `index.js` |
| `Cannot find module 'express'` | `npm install` was not run | Run `npm install` in your project folder |
| Render shows "Build Failed" | Start command is wrong | Check Start Command is `node index.js` in Render settings |

---

*Lab prepared for intern onboarding — CI/CD Basics with GitHub Actions*
*Stack: Node.js · Express · Jest · GitHub Actions · Render.com*
