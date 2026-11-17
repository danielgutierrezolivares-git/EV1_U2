const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://backend-react-fcsl.onrender.com/api-backend'

// GET /users → devuelve la lista de usuarios registrados
export async function obtenerUsuarios() {
  const respuesta = await fetch(`${API_URL}/users`)
  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener los usuarios')
  }

  return datos.users
}

// POST /auth/register → crea un usuario y devuelve { user, token }
export async function registrarUsuario(usuario) {
  const respuesta = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  })
  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.error || 'No se pudo registrar el usuario')
  }

  return datos
}

// Token guardado en localStorage
export function obtenerToken() {
  return localStorage.getItem('token')
}

export function getToken() {
  return obtenerToken()
}

// Usuario autenticado actual
export function obtenerUsuarioActualId() {
  try {
    const usuario = JSON.parse(localStorage.getItem('user') || '{}')
    return usuario?.id || null
  } catch (error) {
    return null
  }
}

export function getCurrentUserId() {
  return obtenerUsuarioActualId()
}

// GET /posts
export async function obtenerPublicaciones() {
  const respuesta = await fetch(`${API_URL}/posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error('No se pudieron obtener las publicaciones')
  }

  return datos
}

export async function getPosts() {
  return obtenerPublicaciones()
}

// POST /posts
export async function crearPublicacion({ title, content }) {
  const token = obtenerToken()

  const respuesta = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
    }),
  })

  return respuesta
}

export async function createPost({ title, content }) {
  return crearPublicacion({ title, content })
}

// POST /posts/:postId/reactions
export async function agregarReaccion(postId, type, userId = null) {
  const payload = { type }

  if (userId !== null && userId !== undefined) {
    payload.userId = userId
  }

  const token = obtenerToken()

  const respuesta = await fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  return respuesta
}

export async function addReaction(postId, type, userId = null) {
  return agregarReaccion(postId, type, userId)
}
