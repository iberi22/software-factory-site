---
title: "🔄 Migrar Lógica API a Backend Real (Supabase/Workers)"
labels:
  - refactor
  - backend
  - phase-5
assignees:
  - iberi22
---

## ⚠️ Contexto Crítico

Actualmente, las rutas de API (`src/pages/api/*.ts`) se crearon en el proyecto Astro. Sin embargo, como el despliegue principal es **GitHub Pages (Estático)**:
1. Las rutas con `prerender = false` **NO funcionarán** en GitHub Pages.
2. Necesitamos mover esta lógica a **Cloudflare Workers** o **Supabase Edge Functions**.

## ✅ Tareas

### 1. Migrar Lógica a Cloudflare Worker (`factory-api`)
- [ ] Mover validación de `POST /api/register` de Astro a `workers/factory-api/src/index.ts`.
- [ ] Implementar `GET /api/template` directamente en el Worker (devolviendo el JSON).
- [ ] Conectar el Worker con Supabase (usando `supabase-js` dentro del Worker) para verificar/guardar registros.

### 2. Configurar Supabase Edge Functions (Alternativa/Complemento)
- [ ] Si la lógica es compleja, crear funciones específicas:
  - `functions/register-repo/index.ts`
- [ ] Actualizar el cliente `src/lib/supabase.ts` para llamar a estas funciones.

### 3. Actualizar Frontend (`src/lib/config.ts`)
- [ ] Asegurarse de que `config.api` apunte a la URL del Cloudflare Worker en producción, no a rutas relativas de Astro (que darían 404).

## 🎯 Arquitectura Final Esperada

```
Cliente (Install Script)
   ⬇️
Cloudflare Worker (factory-api)
   ⬇️ (Auth & Validation)
Supabase (Database)
```

No confiar en rutas `/api/` servidas por GitHub Pages.
