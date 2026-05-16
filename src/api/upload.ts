import { http } from './request'

export async function uploadImage(file: File, type: 'avatar' | 'activity' | 'org'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  const response: any = await http.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  if (response.code !== 200) {
    throw new Error(response.msg || '上传失败')
  }
  return response.data.url
}
