import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders header', () => {
  render(<App />);
  const header = screen.getByText(/Bill Tracker/i);
  expect(header).toBeInTheDocument();
});

test('renders login page', () => {
  render(<App />);
  const h1 = screen.getByText(/Please Log In/i);
  expect(h1).toBeInTheDocument();
});
