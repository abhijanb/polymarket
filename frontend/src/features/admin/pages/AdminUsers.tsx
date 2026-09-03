import { Link } from "react-router-dom";
import { useGetUsersQuery } from "@/features/admin/api/userApi";
import type { User } from "@/shared/types/user";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-primary/20 text-primary border-primary/30",
  USER: "bg-secondary/20 text-secondary border-secondary/30",
};

export function AdminUsers() {
  const { data: users = [], isLoading } = useGetUsersQuery();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
          Users
        </h1>
        <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
          {users.length} TOTAL
        </span>
      </div>

      <div className="terminal-bento grid">
        <div className="bento-card flex flex-col">
          <div className="flex justify-between items-end border-b border-outline-variant pb-2 mb-4">
            <h2 className="text-[20px] leading-[1.4] font-semibold text-on-surface" style={{ fontFamily: "Inter" }}>
              All Users
            </h2>
            <span className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant" style={{ fontFamily: "JetBrains Mono" }}>
              USER DIRECTORY
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal w-1/3" style={{ fontFamily: "JetBrains Mono" }}>
                    USER ID / WALLET
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal" style={{ fontFamily: "JetBrains Mono" }}>
                    NAME
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal" style={{ fontFamily: "JetBrains Mono" }}>
                    ROLE
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal text-right" style={{ fontFamily: "JetBrains Mono" }}>
                    CREATED
                  </th>
                  <th className="text-[10px] tracking-[0.05em] font-bold text-on-surface-variant py-2 font-normal text-right" style={{ fontFamily: "JetBrains Mono" }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="text-[12px]" style={{ fontFamily: "JetBrains Mono" }}>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: User) => (
                    <tr key={user.id} className="data-table-row hover:bg-surface-container-high transition-colors">
                      <td className="py-3 text-on-surface pr-4">
                        <div className="flex flex-col">
                          <span className="text-on-surface font-medium" style={{ fontFamily: "JetBrains Mono" }}>{user.id}</span>
                          <span className="text-on-surface-variant text-[11px]" style={{ fontFamily: "JetBrains Mono" }}>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 text-on-surface-variant">
                        {user.name || <span className="text-on-surface-variant/50">—</span>}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold border ${ROLE_COLORS[user.role] || "bg-surface-container-high text-on-surface-variant border-outline-variant"}`} style={{ fontFamily: "JetBrains Mono" }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-on-surface-variant text-right">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1 text-primary text-[11px] font-bold hover:underline"
                          style={{ fontFamily: "JetBrains Mono" }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
