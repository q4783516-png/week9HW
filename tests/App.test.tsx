import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../src/App';
import { storage } from '../src/services/storage';

describe('App View Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.resetToFixtures();
  });

  it('應能正常渲染 Navbar 品牌與首頁儀表板', () => {
    render(<App />);
    expect(screen.getByText(/Synapse/i)).toBeInTheDocument();
    expect(screen.getByText('知識探索儀表板')).toBeInTheDocument();
    expect(screen.getByText('待處理收件匣')).toBeInTheDocument();
  });

  it('應呈現快速新增按鈕', () => {
    render(<App />);
    const quickAddButtons = screen.getAllByText('快速新增');
    expect(quickAddButtons.length).toBeGreaterThan(0);
  });
});
