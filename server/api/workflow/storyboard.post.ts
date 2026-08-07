import { proxyOpenRouter } from '../../utils/openrouter'

export default defineEventHandler(event => proxyOpenRouter(event))
