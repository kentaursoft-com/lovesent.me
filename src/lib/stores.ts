import { writable } from 'svelte/store';

// ===== Wizard Store for Create Confession Flow =====
export interface WizardData {
	questionText: string;
	crushName: string;
	title: string;
	noOptions: string[];
	customNoOptions: string[];
	photoFile: File | null;
	photoPreview: string;
	extraMessage: string;
	themeColor: string;
}

const defaultWizardData: WizardData = {
	questionText: '',
	crushName: '',
	title: '',
	noOptions: [],
	customNoOptions: [],
	photoFile: null,
	photoPreview: '',
	extraMessage: '',
	themeColor: '#fce4ec'
};

export const wizardData = writable<WizardData>({ ...defaultWizardData });
export const wizardStep = writable(1);
export const totalSteps = 6;

export function resetWizard() {
	wizardData.set({ ...defaultWizardData });
	wizardStep.set(1);
}

// ===== Toast Notifications =====
export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (message: string, type: Toast['type'] = 'info', duration = 4000) => {
			const id = crypto.randomUUID();
			update((toasts) => [...toasts, { id, message, type, duration }]);
			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}
			return id;
		},
		remove: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		},
		success: (message: string) => {
			const id = crypto.randomUUID();
			update((toasts) => [...toasts, { id, message, type: 'success', duration: 4000 }]);
			setTimeout(() => {
				update((toasts) => toasts.filter((t) => t.id !== id));
			}, 4000);
		},
		error: (message: string) => {
			const id = crypto.randomUUID();
			update((toasts) => [...toasts, { id, message, type: 'error', duration: 5000 }]);
			setTimeout(() => {
				update((toasts) => toasts.filter((t) => t.id !== id));
			}, 5000);
		}
	};
}

export const toasts = createToastStore();

// ===== Theme Store =====
export const theme = writable<'valentine' | 'cupcake' | 'clear'>('valentine');
