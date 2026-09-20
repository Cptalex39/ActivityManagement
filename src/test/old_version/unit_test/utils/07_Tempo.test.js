import { formatoDate } from '../../../utils/Tempo';

describe('Test per la funzione formatoDate', () => {
  it('dovrebbe restituire la data nel formato GG-MM-AAAA', () => {
    expect(formatoDate('2024-04-30', 'GG-MM-AAAA')).toBe('30-04-2024');
  });

  it('dovrebbe restituire la data nel formato AAAA-MM-GG', () => {
    expect(formatoDate('2024-04-30', 'AAAA-MM-GG')).toBe('2024-04-30');
  });

  it('dovrebbe restituire una stringa vuota se il dateStr è vuoto', () => {
    expect(formatoDate('', 'GG-MM-AAAA')).toBe('');
  });

  it('dovrebbe gestire un formato non riconosciuto restituendo undefined', () => {
    expect(formatoDate('2024-04-30', 'MM-GG-AAAA')).toBeUndefined();
  });

  it('dovrebbe restituire valori coerenti per date non valide', () => {
    expect(formatoDate('data-non-valida', 'GG-MM-AAAA')).toBe('NaN-NaN-NaN');
  });
});









