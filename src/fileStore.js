import localforage from 'localforage'

const db = localforage.createInstance({ name: 'jamotion-files' })

export async function saveFile(file) {
  const key = `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  await db.setItem(key, file)
  return key
}

export async function loadFile(key) {
  if (!key) return null
  const blob = await db.getItem(key)
  if (!blob) return null
  return URL.createObjectURL(blob)
}

export async function deleteFile(key) {
  if (key) await db.removeItem(key)
}
