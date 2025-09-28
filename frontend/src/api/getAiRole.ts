import axios from './config'
import type { AiRoleItem } from '../types'

export const getAiRole = async (page: string): Promise<AiRoleItem> => {
  const res = await axios.get(`/ai-role?page=${page}`)
  return res.data.data // mock返回格式: {code: 0, data: [...]}
}