// /api/flowglad/[...path]/route.ts
'use server'
import { createAppRouterRouteHandler } from '@flowglad/nextjs/server'
import { flowgladServer } from '@/src/flowglad'

const routeHandler = createAppRouterRouteHandler(flowgladServer)

export { routeHandler as GET, routeHandler as POST }