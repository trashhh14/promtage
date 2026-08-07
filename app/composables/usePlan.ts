import { plans, type PlanId } from '~/assets/tokens'

export function usePlan () {
  const { getPlan, setPlan } = useProjects()
  const planId = useState<PlanId>('vss-plan', () => 'plus')

  function hydrate () {
    if (!import.meta.client) return
    planId.value = getPlan()
  }

  function select (id: PlanId) {
    planId.value = id
    setPlan(id)
  }

  const current = computed(() => plans[planId.value])

  return {
    planId,
    current,
    plans,
    hydrate,
    select
  }
}
