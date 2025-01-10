import React, { useState } from 'react';
import { z } from 'zod';
import { submitWaitlist } from '../../lib/firebase';

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.string().optional(),
  interest: z.enum(['Potential User', 'Partner', 'Investor']).optional(),
  contactMethod: z.enum(['Email', 'Phone', 'Both']).optional(),
  phone: z.string().optional(),
});

export function WaitlistSection() {
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    interest: 'Potential User',
    contactMethod: 'Email',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showPhoneField = formData.contactMethod === 'Phone' || formData.contactMethod === 'Both';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const validatedData = waitlistSchema.parse(formData);
      await submitWaitlist({
        ...validatedData,
        timestamp: new Date().toISOString(),
      });
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-gray-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Join the Revolution in AI Mining</h2>
        <p className="text-xl text-gray-400 mb-12">
          Be among the first to access our platform and receive exclusive benefits.
          Join over 5,000+ early adopters already on the waitlist.
        </p>

        {isSuccess ? (
          <div className="bg-primary/10 text-primary p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">🎉 You're In!</h3>
            <p>Thank you for joining our waitlist. We'll be in touch soon!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Your Role/Industry (Optional)"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value as any })}
                className="bg-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Potential User">Potential User</option>
                <option value="Partner">Partner</option>
                <option value="Investor">Investor</option>
              </select>

              <select
                value={formData.contactMethod}
                onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as any })}
                className="bg-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Both">Both</option>
              </select>
            </div>

            {showPhoneField && (
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-background py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-8 text-gray-400">
          <div>
            <div className="text-2xl font-bold text-white">5,000+</div>
            <div className="text-sm">Early Adopters</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24h</div>
            <div className="text-sm">Avg. Response Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}