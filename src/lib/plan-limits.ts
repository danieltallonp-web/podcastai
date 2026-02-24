import { type Plan } from "@prisma/client"
import { PLAN_LIMITS } from "@/lib/constants"

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan]
}

export function canCreatePodcast(plan: Plan, currentCount: number): boolean {
  const limits = getPlanLimits(plan)
  return currentCount < limits.podcastsPerMonth
}

export function canCreatePreset(plan: Plan, currentPresetCount: number): boolean {
  const limits = getPlanLimits(plan)
  return currentPresetCount < limits.customPresets
}

export function isWithinDurationLimit(plan: Plan, duration: number): boolean {
  const limits = getPlanLimits(plan)
  return duration <= limits.maxDuration
}

export function isWithinVoiceLimit(plan: Plan, voiceCount: number): boolean {
  const limits = getPlanLimits(plan)
  return voiceCount <= limits.maxVoices
}

export function canUseAdvancedMode(plan: Plan): boolean {
  const limits = getPlanLimits(plan)
  return limits.advancedMode
}

export function canDownload(plan: Plan): boolean {
  const limits = getPlanLimits(plan)
  return limits.offlineDownload
}

export function canCloneVoice(plan: Plan): boolean {
  const limits = getPlanLimits(plan)
  return limits.voiceCloning
}
