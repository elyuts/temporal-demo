import { z } from 'zod'

const environmentSchema = z
  .enum(['development', 'production', 'staging'])
  .default('development')

const commonEnvs = {
  NODE_ENV: z
    .enum(['production', 'development', 'integration', 'test'])
    .default('production'),
  STAGE: z.enum(['prod', 'stage', 'dev', 'tests']).default('prod'),
}

const temporalEnvs = {
  TEMPORAL_HOST: z.string(),
  TEMPORAL_PORT: z.string(),
  TEMPORAL_NAMESPACE: z.string().optional(),
  TEMPORAL_PEM: z.string().optional(),
  TEMPORAL_CRT: z.string().optional(),
}

const envsSchema = z.object({
  ...commonEnvs,
  ...temporalEnvs,
})

const parsed = envsSchema.safeParse(process.env)
if (!parsed.success) {
  throw parsed.error
}

export type IEnvironment = z.infer<typeof environmentSchema>
export type IEnvs = Required<z.infer<typeof envsSchema>>
export const envs = parsed.data
