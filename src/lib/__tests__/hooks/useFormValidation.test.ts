import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { z } from 'zod';

describe('useFormValidation', () => {
  const testSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    age: z.number().min(18, 'Must be at least 18 years old')
  });

  test('validates valid data correctly', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    const validData = {
      name: 'John',
      email: 'john@example.com',
      age: 25
    };

    let isValid;
    act(() => {
      isValid = result.current.validate(validData);
    });

    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  test('handles invalid data correctly', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    const invalidData = {
      name: 'J',
      email: 'invalid-email',
      age: 16
    };

    let isValid;
    act(() => {
      isValid = result.current.validate(invalidData);
    });

    expect(isValid).toBe(false);
    expect(result.current.errors).toHaveProperty('name');
    expect(result.current.errors).toHaveProperty('email');
    expect(result.current.errors).toHaveProperty('age');
  });

  test('allows manual error setting', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    const customError = { submit: 'Failed to submit form' };
    
    act(() => {
      result.current.setErrors(customError);
    });

    expect(result.current.errors).toEqual(customError);
  });

  test('clears errors on successful validation', () => {
    const { result } = renderHook(() => useFormValidation(testSchema));
    
    // First set some errors
    act(() => {
      result.current.setErrors({ name: 'Invalid name' });
    });

    // Then validate valid data
    const validData = {
      name: 'John',
      email: 'john@example.com',
      age: 25
    };

    act(() => {
      result.current.validate(validData);
    });

    expect(result.current.errors).toEqual({});
  });
});