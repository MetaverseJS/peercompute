/**
 * Starter database schemas designed to work across SQLite WASM,
 * PostgreSQL (PGlite WASM), and the IndexedDB SQL engine.
 */

export const STARTER_SCHEMAS = Object.freeze({
  startup_prod: {
    id: 'startup_prod',
    label: 'Prod SaaS DB ("DO NOT DROP")',
    description: 'Orgs, users, subscriptions, invoices, feature flags, and audit logs begging for chaos.',
    defaultQuery: 'SELECT u.username, u.role, o.name AS org, s.plan, s.mrr_cents\nFROM users u\nJOIN orgs o ON u.org_id = o.id\nLEFT JOIN subscriptions s ON s.org_id = o.id\nORDER BY s.mrr_cents DESC;',
    sql: `
CREATE TABLE orgs (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  founded_year INTEGER
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  org_id INTEGER NOT NULL REFERENCES orgs(id),
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  active INTEGER DEFAULT 1
);

CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY,
  org_id INTEGER NOT NULL REFERENCES orgs(id),
  plan TEXT NOT NULL,
  mrr_cents INTEGER NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE invoices (
  id INTEGER PRIMARY KEY,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  amount_cents INTEGER NOT NULL,
  paid INTEGER DEFAULT 0,
  memo TEXT
);

CREATE TABLE feature_flags (
  id INTEGER PRIMARY KEY,
  org_id INTEGER REFERENCES orgs(id),
  flag_key TEXT NOT NULL,
  enabled INTEGER DEFAULT 0
);

CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  severity TEXT NOT NULL
);

INSERT INTO orgs (id, name, tier, founded_year) VALUES
  (1, 'SlopCorp AI', 'enterprise', 2024),
  (2, 'VaporCloud LLC', 'pro', 2023),
  (3, 'ZeroTests Inc', 'free', 2025);

INSERT INTO users (id, org_id, username, email, role, active) VALUES
  (1, 1, 'ceo_chad', 'chad@slopcorp.ai', 'admin', 1),
  (2, 1, 'intern_kyle', 'kyle@slopcorp.ai', 'intern', 1),
  (3, 2, 'devops_dana', 'dana@vaporcloud.io', 'sre', 1),
  (4, 3, 'ghost_dev', 'nobody@zerotests.dev', 'viewer', 0);

INSERT INTO subscriptions (id, org_id, plan, mrr_cents, status) VALUES
  (1, 1, 'mega_whale', 499900, 'active'),
  (2, 2, 'growth', 99900, 'past_due'),
  (3, 3, 'hobby', 0, 'trial');

INSERT INTO invoices (id, subscription_id, amount_cents, paid, memo) VALUES
  (1, 1, 499900, 1, 'Q4 Enterprise GPU Slop'),
  (2, 2, 99900, 0, 'Overdue cloud bill'),
  (3, 1, 125000, 1, 'Emergency DBA rescue');

INSERT INTO feature_flags (id, org_id, flag_key, enabled) VALUES
  (1, 1, 'yolo_prod_migrations', 1),
  (2, 2, 'disable_backups', 1),
  (3, 3, 'dark_pattern_checkout', 0);

INSERT INTO audit_logs (id, user_id, action, severity) VALUES
  (1, 2, 'ran_update_without_where', 'critical'),
  (2, 1, 'promoted_intern_to_dba', 'warn'),
  (3, 3, 'enabled_read_only_panic', 'info');
`
  },
  space_station: {
    id: 'space_station',
    label: 'Orbital Habitat Telemetry',
    description: 'Station modules, crew roster, life-support readings, and airlock logs.',
    defaultQuery: 'SELECT c.callsign, c.role, m.code AS module, l.o2_pct\nFROM crew c\nJOIN modules m ON c.module_id = m.id\nLEFT JOIN life_support l ON l.module_id = m.id\nORDER BY l.o2_pct ASC;',
    sql: `
CREATE TABLE modules (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  deck INTEGER NOT NULL,
  pressurized INTEGER DEFAULT 1
);

CREATE TABLE crew (
  id INTEGER PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id),
  callsign TEXT NOT NULL,
  role TEXT NOT NULL,
  morale INTEGER DEFAULT 80
);

CREATE TABLE life_support (
  id INTEGER PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  o2_pct REAL NOT NULL,
  co2_ppm INTEGER NOT NULL,
  temp_c REAL NOT NULL
);

CREATE TABLE airlock_events (
  id INTEGER PRIMARY KEY,
  module_id INTEGER NOT NULL REFERENCES modules(id),
  crew_id INTEGER REFERENCES crew(id),
  event_type TEXT NOT NULL
);

INSERT INTO modules (id, code, deck, pressurized) VALUES
  (1, 'HAB-A', 1, 1),
  (2, 'REACTOR-9', 3, 1),
  (3, 'AIRLOCK-WEST', 2, 0);

INSERT INTO crew (id, module_id, callsign, role, morale) VALUES
  (1, 1, 'CDR-NOVA', 'commander', 92),
  (2, 2, 'ENG-BOLT', 'reactor_tech', 61),
  (3, 1, 'BOT-HAL9K', 'ai_steward', 100);

INSERT INTO life_support (id, module_id, o2_pct, co2_ppm, temp_c) VALUES
  (1, 1, 20.9, 410, 21.4),
  (2, 2, 19.4, 880, 34.2),
  (3, 3, 0.0, 0, -140.0);

INSERT INTO airlock_events (id, module_id, crew_id, event_type) VALUES
  (1, 3, 3, 'unscheduled_vent_test'),
  (2, 1, 1, 'seal_verified');
`
  },
  medieval_tavern: {
    id: 'medieval_tavern',
    label: 'Goblin Tavern ERP',
    description: 'Patrons, quests, bar tabs, and dubious alchemy inventory.',
    defaultQuery: 'SELECT p.name, p.species, q.title AS quest, q.reward_gold\nFROM patrons p\nLEFT JOIN quests q ON q.patron_id = p.id\nORDER BY q.reward_gold DESC;',
    sql: `
CREATE TABLE patrons (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  tab_gold INTEGER DEFAULT 0
);

CREATE TABLE potions (
  id INTEGER PRIMARY KEY,
  brew_name TEXT NOT NULL,
  potency INTEGER NOT NULL,
  stock INTEGER DEFAULT 1
);

CREATE TABLE quests (
  id INTEGER PRIMARY KEY,
  patron_id INTEGER REFERENCES patrons(id),
  title TEXT NOT NULL,
  reward_gold INTEGER NOT NULL,
  danger_rank TEXT NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  patron_id INTEGER NOT NULL REFERENCES patrons(id),
  potion_id INTEGER NOT NULL REFERENCES potions(id),
  qty INTEGER DEFAULT 1
);

INSERT INTO patrons (id, name, species, tab_gold) VALUES
  (1, 'Grog the Bold', 'orc', 42),
  (2, 'Vex Whisper', 'goblin', 310),
  (3, 'Sir Reginald', 'human', 5);

INSERT INTO potions (id, brew_name, potency, stock) VALUES
  (1, 'Suspicious Ale', 3, 40),
  (2, 'Dragonfire Espresso', 9, 4),
  (3, 'Invisibility Tonic', 7, 2);

INSERT INTO quests (id, patron_id, title, reward_gold, danger_rank) VALUES
  (1, 1, 'Clear Basement Rats', 25, 'D'),
  (2, 2, 'Audit Dragon Hoard', 5000, 'S'),
  (3, 3, 'Find Missing Index', 400, 'B');

INSERT INTO orders (id, patron_id, potion_id, qty) VALUES
  (1, 1, 1, 3),
  (2, 2, 2, 2);
`
  },
  blank: {
    id: 'blank',
    label: 'Empty Void (From Scratch)',
    description: 'Zero tables. Tell the LLM to hallucinate a whole schema from nothing.',
    defaultQuery: '-- Database is empty! Ask the LLM or write CREATE TABLE SQL here.',
    sql: ''
  }
});

export function listStarterSchemas() {
  return Object.values(STARTER_SCHEMAS);
}
