import { pb } from './pb'

// LOGIN
export async function loginUser(email: any, password: any) {
    return pb.collection('users').authWithPassword(email, password)
}

// REGISTRO
export async function registerUser({ name, email, password }: any) {
    return pb.collection('users').create({
        name,
        email,
        password,
        passwordConfirm: password,
        emailVisibility: true,
    })
}

// ACTUALIZAR USUARIO
export async function updateUser(id: any, data: any) {
    if (!id) throw new Error('ID de usuario no proporcionado')
    return pb.collection('users').update(id, data)
}

// BORRAR USUARIO
export async function deleteUser(id: any) {
    if (!id) throw new Error('ID de usuario no proporcionado')
    return pb.collection('users').delete(id)
}

// USUARIO ACTUAL desde el authStore
export function getCurrentUser() {
    return pb.authStore.isValid ? pb.authStore.record : null
}

// LOGOUT
export function logoutUser() {
    pb.authStore.clear()
}
