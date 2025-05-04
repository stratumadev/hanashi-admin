export interface Toast {
    id: string
    title?: string
    description?: string
    color?: string
}

export interface ToastOptions {
    timeout?: number
    title?: string
    description?: string
    color?: string
}

const toasts = ref<Toast[]>([])

const addToast = (options: ToastOptions): Toast => {
    const newToast: Toast = {
        id: String(Math.random()),
        title: options.title || '',
        description: options.description || '',
        color: options.color || ''
    }

    toasts.value.push(newToast)

    setTimeout(() => {
        removeToast(newToast.id)
    }, options.timeout || 5000)

    return newToast
}

const removeToast = (id: string): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index !== -1) {
        toasts.value.splice(index, 1)
    }
}

export const useToast = () => {
    return { addToast, removeToast, toasts }
}

export const provideToast = () => {
    provide('toasts', toasts)
}

export const useInjectedToast = () => {
    const toasts = inject<Ref<Toast[]>>('toasts')

    if (!toasts) {
        throw new Error('useInjectedToast must be used within a component that provides the toast context')
    }

    return { toasts }
}

export default defineNuxtPlugin(() => {})
