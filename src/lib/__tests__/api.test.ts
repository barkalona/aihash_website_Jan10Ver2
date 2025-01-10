import { marketplace } from '../api/marketplace';
import { profiles } from '../api/profiles';
import { kyc } from '../api/kyc';

describe('Marketplace API Tests', () => {
  test('fetches listings with filters', async () => {
    const { data, error } = await marketplace.getListings({
      algorithm: 'SHA256',
      minHashPower: 100,
      maxPrice: 1000
    });

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('User Profile Tests', () => {
  test('creates and fetches user profile', async () => {
    const testUserId = 'test-user-id';
    
    const { data: profile } = await profiles.getUserProfile(testUserId);
    expect(profile).toBeDefined();
  });
});

describe('KYC Verification Tests', () => {
  test('submits verification request', async () => {
    const { data, error } = await kyc.submitVerification('test-user-id', {
      verificationType: 'basic',
      documents: {
        idCard: 'test-document-url'
      }
    });

    expect(error).toBeNull();
    expect(data?.status).toBe('pending');
  });
});