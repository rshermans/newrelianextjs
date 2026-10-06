import { describe, it, expect } from 'vitest';
import AlunoHomePage from '../src/app/page';

describe('Aluno app', () => {
  it('renders student home component without throwing', () => {
    expect(AlunoHomePage).toBeDefined();
    const result = AlunoHomePage();
    expect(result).toBeDefined();
  });
});
