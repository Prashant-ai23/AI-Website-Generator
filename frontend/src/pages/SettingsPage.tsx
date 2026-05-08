import { MainLayout } from '@/components/layout';
import { Save, Lock, Bell, Palette } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function SettingsPage() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Account Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Account Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="input-base opacity-50 cursor-not-allowed"
                />
              </div>

              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-gray-700">
                  Email me about website updates
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-gray-700">
                  Email me about new features
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-gray-700">
                  Email me weekly digests
                </span>
              </label>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Palette size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Appearance
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select className="input-base">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold text-red-900 mb-4">
              Danger Zone
            </h2>

            <div className="space-y-4">
              <button className="btn-base bg-red-600 text-white hover:bg-red-700">
                Delete Account
              </button>
              <p className="text-sm text-red-700">
                Deleting your account is permanent and cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
