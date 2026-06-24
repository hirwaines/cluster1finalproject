# Fix: Create researchiq_dev Database

## Issue
The dev profile uses `researchiq_dev` database, but we created `researchiq`.

## Solution: Create researchiq_dev Database

### Option 1: Using Command Line (Easiest)

1. Open **Command Prompt** or **PowerShell**

2. Run this command:
```bash
psql -U postgres
```

3. Enter your PostgreSQL password (default: `password`)

4. Paste these SQL commands one by one:

```sql
CREATE DATABASE researchiq_dev;
CREATE USER researchiq_user WITH PASSWORD 'researchiq_password';
GRANT ALL PRIVILEGES ON DATABASE researchiq_dev TO researchiq_user;
\q
```

### Option 2: Using pgAdmin (GUI)

1. Open **pgAdmin 4**
2. Right-click on **Databases** → Create → Database
3. Name: `researchiq_dev`
4. Owner: `postgres`
5. Click **Save**

---

## Then Try Backend Again

Once database is created:

```powershell
cd c:\Users\user\Documents\Auca\Inoovation\ResearchIQ\research-iq-backend
.\gradlew.bat bootRun
```

---

## Expected Output

```
2026-06-18T22:33:03.813Z  INFO ... Flyway [postgresql]
2026-06-18T22:33:04.550Z  INFO ... Successfully running migrations...
2026-06-18T22:33:10.000Z  INFO ... Started ResearchiqApplication in 45 seconds
```

✅ When you see **"Started ResearchiqApplication in X seconds"** - it's working!

---

## Quick psql Cheat Sheet

```bash
# Connect to PostgreSQL
psql -U postgres

# Show all databases
\l

# Show all users
\du

# Create database
CREATE DATABASE researchiq_dev;

# Create user
CREATE USER researchiq_user WITH PASSWORD 'researchiq_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE researchiq_dev TO researchiq_user;

# Exit
\q
```
