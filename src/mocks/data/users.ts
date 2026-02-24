import { faker } from "@faker-js/faker";
import type { User } from "@/types/user";

const POSITIONS = [
  "Engineer",
  "Senior Engineer",
  "Manager",
  "Designer",
  "Analyst",
  "Director",
  "VP",
  "Intern",
];
const LOCATIONS = [
  "Taipei",
  "Tokyo",
  "New York",
  "London",
  "Singapore",
  "Seoul",
  "Berlin",
  "Sydney",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function generateUser(id: number): User {
  const birthdate = faker.date.birthdate({ min: 22, max: 65, mode: "age" });
  const age = new Date().getFullYear() - birthdate.getFullYear();
  return {
    id,
    username: faker.person.fullName(),
    position: pickRandom(POSITIONS),
    location: pickRandom(LOCATIONS),
    age,
    birthdate: birthdate.toISOString().split("T")[0] as string,
    is_pinned: false,
    pin_order: null,
    created_at: faker.date.past().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// 固定 seed 確保每次 refresh 資料相同
faker.seed(42);
export const mockDb: User[] = Array.from({ length: 700 }, (_, i) =>
  generateUser(i + 1),
);

// Load pinned state from localStorage
try {
  const savedPins = localStorage.getItem("mock_pinned_users");
  if (savedPins) {
    const pinMap = JSON.parse(savedPins) as Record<string, number>;
    mockDb.forEach((user) => {
      const pinOrder = pinMap[String(user.id)];
      if (typeof pinOrder === "number") {
        user.is_pinned = true;
        user.pin_order = pinOrder;
      }
    });
  }
} catch (e) {
  // Ignore localStorage errors
}

export function savePinState() {
  try {
    const pinMap: Record<string, number> = {};
    mockDb.forEach((user) => {
      if (user.is_pinned && user.pin_order !== null) {
        pinMap[String(user.id)] = user.pin_order;
      }
    });
    localStorage.setItem("mock_pinned_users", JSON.stringify(pinMap));
  } catch (e) {
    // Ignore localStorage errors
  }
}
