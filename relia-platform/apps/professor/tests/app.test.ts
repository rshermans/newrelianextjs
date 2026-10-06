import { describe, it, expect } from 'vitest';
import ProfessorHomePage from '../src/app/page';

describe('Professor app', () => {
  it('renders professor home component without throwing', () => {
    expect(ProfessorHomePage).toBeDefined();
    const result = ProfessorHomePage();
    expect(result).toBeDefined();
  });
});
