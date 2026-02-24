import { http, HttpResponse } from "msw";
import { mockDb, savePinState } from "../data/users";
import type { User, SortField, SortDir } from "@/types/user";

const PER_PAGE = 500;

function applySearch(rows: User[], search: string): User[] {
  const q = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.username.toLowerCase().includes(q) ||
      r.position.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q),
  );
}

function applySort(rows: User[], sortBy: SortField, sortDir: SortDir): User[] {
  return [...rows].sort((a, b) => {
    const va = a[sortBy] ?? "";
    const vb = b[sortBy] ?? "";
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });
}

export const userHandlers = [
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const sortBy = (url.searchParams.get("sort_by") || "id") as SortField;
    const sortDir = (url.searchParams.get("sort_dir") || "asc") as SortDir;
    const pageNum = parseInt(url.searchParams.get("page") || "1");
    const perPage = parseInt(
      url.searchParams.get("per_page") || String(PER_PAGE),
    );

    const pinned = mockDb
      .filter((r) => r.is_pinned)
      .sort((a, b) => (a.pin_order ?? 0) - (b.pin_order ?? 0));

    let regular = mockDb.filter((r) => !r.is_pinned);
    if (search) regular = applySearch(regular, search);
    regular = applySort(regular, sortBy, sortDir);

    const startIdx = (pageNum - 1) * perPage;
    const page = regular.slice(startIdx, startIdx + perPage);
    const totalPages = Math.ceil(regular.length / perPage);

    const response = {
      pinned,
      data: page,
      page: pageNum,
      total_pages: totalPages,
      total: regular.length,
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  http.post("/api/users", async ({ request }) => {
    const body = (await request.json()) as Partial<User>;
    const newUser: User = {
      id: Math.max(0, ...mockDb.map((u) => u.id)) + 1,
      username: body.username ?? "",
      position: body.position ?? "",
      location: body.location ?? "",
      age: body.age ?? 0,
      birthdate: body.birthdate ?? "",
      is_pinned: false,
      pin_order: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDb.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.put("/api/users/:id", async ({ params, request }) => {
    const id = Number(params.id);
    const idx = mockDb.findIndex((u) => u.id === id);
    if (idx === -1)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const body = (await request.json()) as Partial<User>;
    const existing = mockDb[idx] as User;
    const updated: User = {
      ...existing,
      username: body.username ?? existing.username,
      position: body.position ?? existing.position,
      location: body.location ?? existing.location,
      age: body.age ?? existing.age,
      birthdate: body.birthdate ?? existing.birthdate,
      is_pinned: body.is_pinned ?? existing.is_pinned,
      pin_order:
        body.pin_order !== undefined ? body.pin_order : existing.pin_order,
      id,
      updated_at: new Date().toISOString(),
    };
    mockDb[idx] = updated;
    return HttpResponse.json(mockDb[idx]);
  }),

  http.delete("/api/users/:id", ({ params }) => {
    const id = Number(params.id);
    const idx = mockDb.findIndex((u) => u.id === id);
    if (idx === -1)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    mockDb.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // IMPORTANT: reorder-pins must be BEFORE /:id/pin to avoid route conflict
  http.post("/api/users/reorder-pins", async ({ request }) => {
    const { ids } = (await request.json()) as { ids: number[] };
    ids.forEach((id, i) => {
      const user = mockDb.find((u) => u.id === id);
      if (user) user.pin_order = i + 1;
    });
    savePinState();
    return HttpResponse.json({ ok: true });
  }),

  http.post("/api/users/:id/pin", ({ params }) => {
    const id = Number(params.id);
    const user = mockDb.find((u) => u.id === id);
    if (!user)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const maxOrder = Math.max(
      0,
      ...mockDb.filter((u) => u.is_pinned).map((u) => u.pin_order ?? 0),
    );
    user.is_pinned = true;
    user.pin_order = maxOrder + 1;
    savePinState();
    return HttpResponse.json(user);
  }),

  http.delete("/api/users/:id/pin", ({ params }) => {
    const id = Number(params.id);
    const user = mockDb.find((u) => u.id === id);
    if (!user)
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    user.is_pinned = false;
    user.pin_order = null;
    mockDb
      .filter((u) => u.is_pinned)
      .sort((a, b) => (a.pin_order ?? 0) - (b.pin_order ?? 0))
      .forEach((u, i) => {
        u.pin_order = i + 1;
      });
    savePinState();
    return HttpResponse.json(user);
  }),
];
