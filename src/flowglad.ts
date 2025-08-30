// flowglad.ts
import { FlowgladServer } from '@flowglad/nextjs/server'
import { createClient } from '@/lib/supabase/server'

export const flowgladServer = new FlowgladServer({
  supabaseAuth: {
    client: createClient,
  },
})