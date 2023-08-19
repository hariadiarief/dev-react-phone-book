import { useEffect } from 'react'

export const useDebounce = (effect: any, dependencies: any, delay: number) => {
    useEffect(() => {
        const timeout = setTimeout(effect, delay)
        return () => clearTimeout(timeout)
    }, [effect, delay, ...dependencies])
}
