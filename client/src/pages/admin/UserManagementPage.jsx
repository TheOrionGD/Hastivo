import { UserAccountAvatar, CountBadge, FloatingNavbar } from "@/components/ui/smoothui";
import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  Ban,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { GlassInput, GlassButton } from "@/components/glass/GlassControls";
import { GlassModal } from "@/components/glass/GlassModal";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [restrictModalOpen, setRestrictModalOpen] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState("");

  const fetchUsers = () => {
    fetch("/api/v1/admin/users")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.users) {
          setUsers(data.users);
        } else {
          setUsers([
            { id: "usr_admin_root", displayName: "System Administrator", email: "admin@hastivo.org", role: "admin", status: "active", createdAt: "2026-10-01" },
            { id: "usr_citizen_1", displayName: "Aarav Sharma", email: "aarav@example.com", role: "citizen", status: "active", createdAt: "2026-11-04" },
            { id: "usr_citizen_2", displayName: "Priya Patel", email: "priya@example.com", role: "citizen", status: "active", createdAt: "2026-11-08" },
          ]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApplyRestriction = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`/api/v1/admin/users/${selectedUser.id}/restriction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restrictionType: "community_suspend",
          reason: restrictionReason || "Administrative policy enforcement",
        }),
      });
      setRestrictModalOpen(false);
      setRestrictionReason("");
      fetchUsers();
    } catch {}
  };

  const filteredUsers = users.filter((u) =>
    (u.displayName || u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout
      title="User Management"
      subtitle="Account Records, Security Roles & Restrictions"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <GlassInput
          placeholder="Search users by name or email..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <span className="text-xs text-text-3 font-mono">
          Showing {filteredUsers.length} total registered accounts
        </span>
      </div>

      <GlassPanel elevation="z2" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-surface/60 border-b border-border/80 text-text-3 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-foreground block text-sm">
                      {user.displayName || "Anonymous User"}
                    </span>
                    <span className="text-text-3 text-xs">{user.email}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        user.role === "admin"
                          ? "bg-coral/15 text-coral border-coral/30"
                          : "bg-blue/15 text-blue border-blue/30"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td className="p-4 text-text-3">
                    {user.createdAt || "Recent"}
                  </td>
                  <td className="p-4 text-right">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setRestrictModalOpen(true);
                        }}
                        className="p-1.5 px-3 rounded-lg text-xs font-semibold text-coral border border-coral/30 bg-coral/10 hover:bg-coral/20"
                      >
                        Restrict
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Restriction Modal */}
      <GlassModal
        isOpen={restrictModalOpen}
        onClose={() => setRestrictModalOpen(false)}
        title="Enforce Account Restriction"
        description={`Set moderation limits or temporary suspension for ${selectedUser?.displayName}.`}
      >
        <div className="space-y-4 my-4 font-sans text-xs">
          <div>
            <label className="text-text-2 font-bold block mb-1.5">
              Enforcement Reason
            </label>
            <textarea
              rows={3}
              value={restrictionReason}
              onChange={(e) => setRestrictionReason(e.target.value)}
              placeholder="Specify policy violation reason..."
              className="w-full rounded-xl bg-surface/50 border border-border p-3 text-foreground outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <GlassButton variant="glass" onClick={() => setRestrictModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton variant="danger" onClick={handleApplyRestriction}>
              Confirm Restriction
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </AdminLayout>
  );
}

