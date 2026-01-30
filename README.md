src/
├── app/
│   └── api/                  # ROUTES (Entry points only)
│       └── auth/
│           ├── register/
│           │   └── route.ts
│           ├── login/
│           │   └── route.ts
│           └── 2fa/
│               └── route.ts
├── controllers/              # CONTROLLERS (Request/Response handling)
│   └── authController.ts
├── services/                 # SERVICES (Business Logic, Hashing, DB calls)
│   └── authService.ts
├── models/                   # DATABASE SCHEMAS
│   └── User.ts
├── middleware/               # MIDDLEWARE (Security checks)
│   └── authMiddleware.ts
├── lib/                      # UTILS (DB Connect, Helpers)
│   └── dbConnect.ts
└── util/                     # UTILS (Shared helper functions)
    └── security.ts           # Hashing & Token logic


📦 4. Is this "Full-Fledged" yet?
To reach your goal, we are missing a few critical pieces of the "Phase 1" roadmap:


Vapi Assistant Config: You have the webhook code, but you need a script or UI to actually create the assistant on Vapi's servers so it knows to call your /api/vapi/webhook.

RAG Limitation: In your dezrez.ts, I've added a .take(3) limit. This is crucial because over-stuffing the assistant with listing data can degrade voice performance.

DezRez API Keys: You'll need to set DEZREZ_API_KEY and VAPI_WEBHOOK_SECRET in your .env.local to actually see data flow.