import type { User } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeux17I8HPLUN2gKdPM1U6wsWZ3GnWEmVDY966GIT5ZPyIZ7cDV1qu6zFh2lZ7BmRqMNMh4UcGK39w/pub?gid=0&single=true&output=csv';
const SESSION_KEY = 'calorie-vision-session';

const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
};

export const login = async (usuario: string, codigo: string): Promise<User> => {
    try {
        // Añadido un parámetro para evitar problemas de caché y asegurar datos actualizados
        const response = await fetch(`${CSV_URL}&t=${Date.now()}`);
        if (!response.ok) {
            throw new Error('No se pudo conectar con la base de datos de usuarios.');
        }
        const csvText = await response.text();
        const rows = csvText.trim().split('\n').slice(1); // Remove header

        const userRow = rows.find(row => {
            const columns = row.split(',');
            return columns[1] && columns[1].trim().toLowerCase() === usuario.trim().toLowerCase();
        });

        if (!userRow) {
            throw new Error('Usuario o código incorrecto.');
        }
        
        const columns = userRow.split(',');
        const correctCodigo = columns[2] ? columns[2].trim() : '';
        
        // CSV headers: Marca temporal,usuario,codigo,vendedor,suma,fechadevencimiento,DIAS
        // 'suma' (fecha de vencimiento) está en el índice 4
        const vencimientoStr = columns[4] ? columns[4].trim() : '';
        // 'DIAS' (días restantes) está en el índice 6
        const diasRestantesStr = columns[6] ? columns[6].trim() : '0';

        if (codigo.trim() !== correctCodigo) {
            throw new Error('Usuario o código incorrecto.');
        }

        const vencimientoDate = parseDate(vencimientoStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (vencimientoDate < today) {
            throw new Error('Tu suscripción ha expirado. Por favor, contacta a tu entrenador.');
        }

        const user: User = {
            usuario: columns[1].trim(),
            vendedor: columns[3].trim(),
            vencimiento: vencimientoStr,
            diasRestantes: diasRestantesStr,
        };

        saveUserSession(user);
        return user;

    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Ocurrió un error inesperado durante el inicio de sesión.');
    }
};

export const saveUserSession = (user: User): void => {
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
        console.error("No se pudo guardar la sesión del usuario", e);
    }
};

export const getUserSession = (): User | null => {
    try {
        const sessionJson = localStorage.getItem(SESSION_KEY);
        if (!sessionJson) return null;

        const session = JSON.parse(sessionJson) as User;
        
        // Re-validate expiration on session load
        const vencimientoDate = parseDate(session.vencimiento);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (vencimientoDate < today) {
            logout();
            return null;
        }
        
        return session;
    } catch (e) {
        console.error("No se pudo obtener la sesión del usuario", e);
        return null;
    }
};

export const logout = (): void => {
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch (e) {
        console.error("No se pudo cerrar la sesión del usuario", e);
    }
};