import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import StatCard from '../app/dashboard/_components/StatCard';
import { SkeletonWelcome, SkeletonStatGrid } from '../app/dashboard/_components/SkeletonLoader';
import ConfirmModal from '../app/dashboard/_components/ConfirmModal';
import { ToastProvider, useToast } from '../app/dashboard/_components/ToastContext';
import { buildAvatarUrl } from '../context/AuthContext';
import { API } from '../lib/api/endpoints';

describe('StatCard', () => {
    it('renders title, value, and badge correctly', () => {
        render(
            <StatCard
                title="Total Alerts"
                value="12"
                badge="Protected"
                badgeVariant="success"
                icon={<span data-testid="test-icon">Icon</span>}
            />
        );

        expect(screen.getByText('Total Alerts')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText('Protected')).toBeInTheDocument();
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('handles click events when onClick is provided', () => {
        const handleClick = vi.fn();
        render(
            <StatCard
                title="Incidents"
                value={5}
                icon={<span>Icon</span>}
                onClick={handleClick}
            />
        );

        fireEvent.click(screen.getByText('Incidents'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

describe('SkeletonLoader', () => {
    it('renders SkeletonWelcome without crashing', () => {
        const { container } = render(<SkeletonWelcome />);
        expect(container).toBeInTheDocument();
    });

    it('renders SkeletonStatGrid without crashing', () => {
        const { container } = render(<SkeletonStatGrid />);
        expect(container).toBeInTheDocument();
    });
});

describe('ConfirmModal', () => {
    it('does not render when open is false', () => {
        render(
            <ConfirmModal
                open={false}
                title="Delete Account"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        );

        expect(screen.queryByText('Delete Account')).not.toBeInTheDocument();
    });

    it('renders title and triggers onConfirm and onCancel', () => {
        const handleConfirm = vi.fn();
        const handleCancel = vi.fn();

        render(
            <ConfirmModal
                open={true}
                title="Confirm Action"
                message="Are you sure?"
                confirmLabel="Yes, Do it"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        );

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Yes, Do it'));
        expect(handleConfirm).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Cancel'));
        expect(handleCancel).toHaveBeenCalledTimes(1);
    });
});

describe('ToastContext & useToast', () => {
    function TestComponent() {
        const { showToast } = useToast();
        return (
            <div>
                <button onClick={() => showToast('Test success toast', 'success')}>
                    Show Success Toast
                </button>
            </div>
        );
    }

    it('shows toast notification when showToast is invoked', () => {
        render(
            <ToastProvider>
                <TestComponent />
            </ToastProvider>
        );

        fireEvent.click(screen.getByText('Show Success Toast'));
        expect(screen.getByText('Test success toast')).toBeInTheDocument();
    });
});

describe('buildAvatarUrl & API', () => {
    it('buildAvatarUrl handles valid and default values', () => {
        expect(buildAvatarUrl(undefined, 1)).toBeNull();
        expect(buildAvatarUrl(null, 1)).toBeNull();
        expect(buildAvatarUrl('default-profile.png', 1)).toBeNull();
        expect(buildAvatarUrl('my-avatar.jpg', 2)).toBe('/uploads/my-avatar.jpg?v=2');
    });

    it('API object contains required route definitions', () => {
        expect(API.AUTH.LOGIN).toBe('/api/v1/auth/login');
        expect(API.ADMIN.USERS).toBe('/api/v1/admin/users');
        expect(API.DEVICES.LIST).toBe('/api/v1/devices');
    });
});
