import { EventEmitter } from 'expo-modules-core';
// Note: If expo-modules-core isn't available, use a simple custom emitter or 'eventemitter3'
// For standard RN without extra deps, here is a lightweight native implementation:

type Listener = () => void;

class AuthEventEmitter {
    private listeners: Set<Listener> = new Set();

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        // Return unsubscribe function
        return () => this.listeners.delete(listener);
    }

    emit(): void {
        this.listeners.forEach((listener) => listener());
    }
}

export const authEvents = new AuthEventEmitter();
export const AUTH_EVENTS = {
    UNAUTHORIZED: 'UNAUTHORIZED',
} as const;