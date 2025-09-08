import type { Recipe } from '../types';

const RECIPES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeux17I8HPLUN2gKdPM1U6wsWZ3GnWEmVDY966GIT5ZPyIZ7cDV1qu6zFh2lZ7BmRqMNMh4UcGK39w/pub?gid=509278465&single=true&output=csv';

/**
 * Parses a CSV string into a 2D array of strings.
 * Handles quoted fields, multiline fields, and escaped quotes ("").
 * @param text The CSV string to parse.
 * @returns A 2D array representing the CSV data.
 */
const parseCSV = (text: string): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;

    // Normalize line endings and add a newline at the end to ensure the last field/row is processed
    const normalizedText = text.trim().replace(/\r\n/g, '\n') + '\n';

    for (let i = 0; i < normalizedText.length; i++) {
        const char = normalizedText[i];

        if (inQuotes) {
            if (char === '"') {
                // Check for an escaped quote ("")
                if (i + 1 < normalizedText.length && normalizedText[i + 1] === '"') {
                    currentField += '"';
                    i++; // Skip the second quote of the pair
                } else {
                    inQuotes = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentRow.push(currentField);
                currentField = '';
            } else if (char === '\n') {
                // End of row
                currentRow.push(currentField);
                // Only add the row if it's not completely empty
                if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
                    rows.push(currentRow);
                }
                currentRow = [];
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    return rows;
}

export const getRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await fetch(`${RECIPES_CSV_URL}&t=${Date.now()}`);
        if (!response.ok) {
            throw new Error('Could not fetch recipes data.');
        }
        const csvText = await response.text();
        const data = parseCSV(csvText);

        const headers = data.shift(); // Remove header row
        if (!headers || headers[0]?.trim() !== 'nombre') {
             console.error("Invalid CSV format or missing headers. Expected 'nombre' in first column.", headers);
             return [];
        }

        const recipes: Recipe[] = data.map(columns => {
            // Basic validation: ensure we have enough columns to avoid errors
            if (columns.length < 9) return null;

            return {
                nombre: columns[0]?.trim() || '',
                ingredientes: columns[1]?.trim() || '',
                preparacion: columns[2]?.trim() || '',
                calorias: parseFloat(columns[3]?.trim()) || 0,
                proteinas: parseFloat(columns[4]?.trim()) || 0,
                carbohidratos: parseFloat(columns[5]?.trim()) || 0,
                grasas: parseFloat(columns[6]?.trim()) || 0,
                foto: columns[7]?.trim() || '',
                video: columns[8]?.trim() || '',
            };
        }).filter((recipe): recipe is Recipe => recipe !== null && !!recipe.nombre); // Filter out nulls and recipes without a name

        return recipes;
    } catch (error) {
        console.error("Error fetching or parsing recipes:", error);
        throw new Error('Failed to load recipes.');
    }
};
