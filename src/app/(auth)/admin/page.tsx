"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

type ListedUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};

type ListUsersResponse = {
  users: ListedUser[];
  total: number;
  limit?: number;
  offset?: number;
};

export default function AdminPage() {
  // Basic query state
  const [searchValue, setSearchValue] = useState("");
  const [pageSize] = useState(10);
  const [offset, setOffset] = useState(0);

  // Data state
  const [users, setUsers] = useState<ListedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [stopping, setStopping] = useState(false);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((total || 0) / pageSize));
  }, [total, pageSize]);

  const currentPage = useMemo(() => {
    return Math.floor(offset / pageSize) + 1;
  }, [offset, pageSize]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await authClient.admin.listUsers({
        query: {
          searchValue: searchValue || undefined,
          searchField: "name",
          searchOperator: "contains",
          limit: pageSize,
          offset,
          sortBy: "name",
          sortDirection: "asc",
        },
      } as any);

      const payload: ListUsersResponse = (response?.data ?? response) as ListUsersResponse;
      setUsers(payload?.users || []);
      setTotal(payload?.total || 0);
    } catch (error) {
      console.error("Failed to list users", error);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchValue, pageSize, offset]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSearch = useCallback(() => {
    setOffset(0);
    fetchUsers();
  }, [fetchUsers]);

  const goPrev = useCallback(() => {
    setOffset((prev) => Math.max(0, prev - pageSize));
  }, [pageSize]);

  const goNext = useCallback(() => {
    const next = Math.min(offset + pageSize, Math.max(0, total - 1));
    setOffset(next);
  }, [offset, pageSize, total]);

  const impersonate = useCallback(async (userId: string) => {
    setImpersonatingId(userId);
    try {
      const res: any = await authClient.admin.impersonateUser({
        userId,
      } as any);
      const ok = !!(res?.data ?? res);
      if (ok) {
        // Refresh to load the impersonated session in app shell
        window.location.replace("/dashboard");
      }
    } catch (error) {
      console.error("Failed to impersonate", error);
    } finally {
      setImpersonatingId(null);
    }
  }, []);

  const stopImpersonating = useCallback(async () => {
    setStopping(true);
    try {
      await authClient.admin.stopImpersonating({} as any);
      window.location.replace("/dashboard");
    } catch (error) {
      console.error("Failed to stop impersonating", error);
    } finally {
      setStopping(false);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Manage users and impersonate for debugging/support.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled={stopping} onClick={stopImpersonating} variant="outline">
            {stopping ? "Stopping..." : "Stop impersonating"}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          placeholder="Search by name"
          value={searchValue}
        />
        <Button disabled={loading} onClick={onSearch}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[40%]">Email</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell className="text-center text-muted-foreground" colSpan={3}>
                  {loading ? "Loading users..." : "No users found"}
                </TableCell>
              </TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name || "—"}</TableCell>
                <TableCell>{u.email || "—"}</TableCell>
                <TableCell>
                  <Button
                    disabled={impersonatingId === u.id}
                    onClick={() => impersonate(u.id)}
                    size="sm"
                    variant="outline"
                  >
                    {impersonatingId === u.id ? "Impersonating..." : "Impersonate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            disabled={loading || currentPage <= 1}
            onClick={goPrev}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            disabled={loading || currentPage >= totalPages}
            onClick={goNext}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
