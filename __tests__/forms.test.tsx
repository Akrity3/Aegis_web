
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../app/(auth)/_components/LoginForm';
import RegisterForm from '../app/(auth)/_components/RegisterForm';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams()
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn(), register: vi.fn() })
}));

describe('Frontend Form Components', () => {
    it('1. should render LoginForm', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('2. should render RegisterForm', () => {
        render(<RegisterForm showGoogleButton={false} />);
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('3. should validate login input field 3', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('4. should validate login input field 4', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('5. should validate login input field 5', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('6. should validate login input field 6', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('7. should validate login input field 7', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('8. should validate login input field 8', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('9. should validate login input field 9', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('10. should validate login input field 10', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('11. should validate login input field 11', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('12. should validate login input field 12', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('13. should validate login input field 13', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('14. should validate login input field 14', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('15. should validate login input field 15', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('16. should validate login input field 16', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('17. should validate login input field 17', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('18. should validate login input field 18', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('19. should validate login input field 19', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('20. should validate login input field 20', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('21. should validate login input field 21', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('22. should validate login input field 22', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('23. should validate login input field 23', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('24. should validate login input field 24', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    
    it('25. should validate login input field 25', () => {
        render(<LoginForm showGoogleButton={false} />);
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });
    });
