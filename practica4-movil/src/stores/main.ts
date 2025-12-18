import { defineStore } from 'pinia'
import { 
    listarRecetas, eliminarReceta as eliminarRecetaService,
    createReceta as createRecetaService,
    actualizarReceta as actualizarRecetaService,
    obtenerReceta, obtenerRecetasInicio, toggleLike as toggleLikeService,
} from '../services/recetasService'

import {
    loginUser,
    registerUser,
    updateUser,
    deleteUser,
    getCurrentUser,
    logoutUser,
} from '../services/usuarioService'

import {
    listarComentariosUsuario,
    listarComentariosPorReceta,
    crearComentario as crearComentarioService,
    actualizarComentario as actualizarComentarioService,
    eliminarComentario as eliminarComentarioService,
} from '../services/comentariosService'

export const useMainStore = defineStore('main', {
    state: () => ({
        // === USUARIO ====
        user: getCurrentUser() as any, 
        authLoading: false,
        authError: null as string | null,

        // ==== RECETAS ====
        recipes: [] as any[],
        recipesLoading: false,
        recipesError: null as string | null,

        // ==== HOME ====
        homeRecipes: [] as any[],
        homeLoading: false,
        homeError: null as string | null,

        // ==== COMENTARIOS DEL USUARIO ====
        myComments: [] as any[],
        myCommentsLoading: false,
        myCommentsError: null as string | null,

        // ==== COMENTARIOS DE UNA RECETA ====
        recipeComments: [] as any[],
        recipeCommentsLoading: false,
        recipeCommentsError: null as string | null,
    }),

    getters: {
        isLogged: (state) => !!state.user,
        isAdmin: (state) =>
            !!state.user && state.user.email === 'fmpp3@alu.ua.es',
    },

    actions: {
        // ==== USUARIO ====
        async login(email: any, password: any) {
            this.authLoading = true
            this.authError = null
            try {
                await loginUser(email, password)
                this.user = getCurrentUser()
            } catch (error: any) {
                this.user = null
                this.authError = error?.message || 'Error al hacer login'
                throw error
            } finally {
                this.authLoading = false
            }
        },

        async register({ name, email, password }: any) {
            this.authLoading = true
            this.authError = null
            try {
                await registerUser({ name, email, password })
                await loginUser(email, password)
                this.user = getCurrentUser()
            } catch (error: any) {
                this.user = null
                this.authError = error?.message || 'Error registrando usuario'
                throw error
            } finally {
                this.authLoading = false
            }
        },

        logout() {
            logoutUser()
            this.user = null
        },

        async updateProfile({ name, email, password, passwordConfirm, oldPassword }: any) {
            if (!this.user) throw new Error('No hay usuario autenticado')

            const data: any = { name, email }
            const changingPassword = !!password

            if (changingPassword) {
                data.oldPassword = oldPassword
                data.password = password
                data.passwordConfirm = passwordConfirm ?? password
            }

            const updated = await updateUser(this.user.id, data)

            if (changingPassword) {
                await loginUser(email, password)
                this.user = getCurrentUser()
            } else {
                this.user = updated
            }

            return updated
        },

        async deleteAccount() {
            if (!this.user) throw new Error('No hay usuario autenticado')
            await deleteUser(this.user.id)
            this.logout()
        },

        // ==== RECETAS ====
        async loadRecipes(filtroCategoria = '') {
            this.recipesLoading = true
            this.recipesError = null
            try {
                const data = await listarRecetas(filtroCategoria)
                this.recipes = data.map((r: any) => ({
                    id: r.id,
                    title: r.titulo,
                    description: r.descripcion,
                    category: r.categoria || [],
                    image: r.imagenUrl,
                }))
            } catch (error: any) {
                console.error('Error cargando recetas:', error)
                this.recipesError = error?.message || 'Error cargando recetas'
                throw error
            } finally {
                this.recipesLoading = false
            }
        },

        async fetchRecipeById(id: any) {
            return await obtenerReceta(id)
        },

        async deleteRecipe(id: any) {
            await eliminarRecetaService(id)
            this.recipes = this.recipes.filter((r: any) => r.id !== id)
        },

        async createRecipe(data: any) {
            const created = await createRecetaService(data)
            await this.loadRecipes()
            return created
        },

        async updateRecipe(id: any, data: any) {
            const updated = await actualizarRecetaService(id, data)
            this.recipes = this.recipes.map((r: any) =>
                r.id === id ? { ...r, ...data } : r
            )
            return updated
        },

        // ==== HOME ====
        async loadHomeRecipes() {
            this.homeLoading = true
            this.homeError = null
            try {
                const data = await obtenerRecetasInicio()
                this.homeRecipes = data
            } catch (error: any) {
                console.error('Error cargando recetas de inicio:', error)
                this.homeError = error?.message || 'Error cargando recetas de inicio'
                throw error
            } finally {
                this.homeLoading = false
            }
        },

        async toggleLikeReceta(recetaId: any) {
            const receta = this.homeRecipes.find((r: any) => r.id === recetaId)
            if (!receta) return

            const originalLiked = receta.liked
            const originalLikeId = receta.likeId

            receta.liked = !receta.liked

            try {
                const resultado = await toggleLikeService({
                    id: receta.id,
                    liked: receta.liked,
                    likeId: receta.likeId,
                })

                if (resultado) {
                    receta.liked = resultado.liked
                    receta.likeId = resultado.likeId
                } else {
                    receta.liked = originalLiked
                    receta.likeId = originalLikeId
                }
            } catch (error) {
                receta.liked = originalLiked
                receta.likeId = originalLikeId
                throw error
            }
        },

        // ==== COMENTARIOS ====
        async loadMyComments() {
            if (!this.user) {
                this.myComments = []
                return
            }

            this.myCommentsLoading = true
            this.myCommentsError = null
            try {
                const data = await listarComentariosUsuario(this.user.id)
                this.myComments = data
            } catch (err: any) {
                this.myCommentsError = err?.message || 'Error cargando tus comentarios'
                throw err
            } finally {
                this.myCommentsLoading = false
            }
        },

        async updateMyComment(id: any, { texto, rating }: any) {
            if (!id) throw new Error('Falta id de comentario')
            const updated = await actualizarComentarioService(id, texto, rating)

            this.myComments = this.myComments.map((c: any) =>
                c.id === id
                ? {
                    ...c,
                    texto,
                    rating: rating ?? c.rating,
                    updated: updated.updated ?? c.updated,
                  }
                : c,
            )
            return updated
        },

        async deleteMyComment(id: any) {
            if (!id) throw new Error('Falta id de comentario')
            await eliminarComentarioService(id)
            this.myComments = this.myComments.filter((c: any) => c.id !== id)
        },

        async loadCommentsForRecipe(recetaId: any) {
            this.recipeCommentsLoading = true
            this.recipeCommentsError = null
            try {
                const data = await listarComentariosPorReceta(recetaId)
                this.recipeComments = data
            } catch (err: any) {
                this.recipeCommentsError = err?.message || 'Error cargando comentarios'
                throw err
            } finally {
                this.recipeCommentsLoading = false
            }
        },

        async createCommentForRecipe({ recetaId, texto, rating }: any) {
            if (!this.user) throw new Error('Debes iniciar sesión para comentar')

            const created = await crearComentarioService({
                recetaId,
                userId: this.user.id,
                texto,
                rating,
            })

            this.recipeComments.unshift({
                id: created.id,
                texto: created.comentario ?? texto,
                rating: created.valoracion ?? rating ?? null,
                created: created.created,
                usuario: {
                    id: this.user.id,
                    nombre: this.user.name || this.user.username || this.user.email,
                    email: this.user.email,
                },
            })

            return created
        },
    },
})