import React, { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { profiles } from '../../lib/api/profiles';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Bell, Mail, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import { z } from 'zod';

const notificationSchema = z.object({
  email: z.object({
    orderUpdates: z.boolean(),
    marketingEmails: z.boolean(),
    securityAlerts: z.boolean(),
    priceAlerts: z.boolean(),
  }),
  push: z.object({
    orderUpdates: z.boolean(),
    securityAlerts: z.boolean(),
    priceAlerts: z.boolean(),
  }),
});

export function NotificationPreferences({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: {
      orderUpdates: true,
      marketingEmails: false,
      securityAlerts: true,
      priceAlerts: true,
    },
    push: {
      orderUpdates: true,
      securityAlerts: true,
      priceAlerts: false,
    },
  });

  const { errors, validate, setErrors } = useFormValidation(notificationSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    setLoading(true);
    try {
      await profiles.updateUserProfile(profile.id, {
        notification_preferences: formData
      });
      onUpdate();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to update preferences' });
    } finally {
      setLoading(false);
    }
  };

  const NotificationToggle = ({ 
    label, 
    checked, 
    onChange, 
    icon: Icon 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    icon: typeof Bell;
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="text-white">{label}</span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg">
          {errors.submit}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Notifications
        </h3>
        <div className="space-y-2">
          <NotificationToggle
            label="Order Updates"
            checked={formData.email.orderUpdates}
            onChange={(checked) => setFormData({
              ...formData,
              email: { ...formData.email, orderUpdates: checked }
            })}
            icon={MessageSquare}
          />
          <NotificationToggle
            label="Marketing Emails"
            checked={formData.email.marketingEmails}
            onChange={(checked) => setFormData({
              ...formData,
              email: { ...formData.email, marketingEmails: checked }
            })}
            icon={Bell}
          />
          <NotificationToggle
            label="Security Alerts"
            checked={formData.email.securityAlerts}
            onChange={(checked) => setFormData({
              ...formData,
              email: { ...formData.email, securityAlerts: checked }
            })}
            icon={AlertTriangle}
          />
          <NotificationToggle
            label="Price Alerts"
            checked={formData.email.priceAlerts}
            onChange={(checked) => setFormData({
              ...formData,
              email: { ...formData.email, priceAlerts: checked }
            })}
            icon={Zap}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Push Notifications
        </h3>
        <div className="space-y-2">
          <NotificationToggle
            label="Order Updates"
            checked={formData.push.orderUpdates}
            onChange={(checked) => setFormData({
              ...formData,
              push: { ...formData.push, orderUpdates: checked }
            })}
            icon={MessageSquare}
          />
          <NotificationToggle
            label="Security Alerts"
            checked={formData.push.securityAlerts}
            onChange={(checked) => setFormData({
              ...formData,
              push: { ...formData.push, securityAlerts: checked }
            })}
            icon={AlertTriangle}
          />
          <NotificationToggle
            label="Price Alerts"
            checked={formData.push.priceAlerts}
            onChange={(checked) => setFormData({
              ...formData,
              push: { ...formData.push, priceAlerts: checked }
            })}
            icon={Zap}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-primary text-background py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" />
            Saving...
          </>
        ) : (
          'Save Preferences'
        )}
      </button>
    </form>
  );
}