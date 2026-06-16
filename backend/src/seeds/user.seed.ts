import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

// 1. 배열 안의 배열 구조를 명확히 정의하기 위해 튜플 타입을 선언합니다.
// [clerkId, fullName, email, profilePic] 순서를 강제합니다.
type SeedUserData = [string, string, string, string];

const seedUsers: SeedUserData[] = [
  [
    "seed_alex_chen",
    "Alex Chen",
    "alex.chen@example.com",
    "https://i.pravatar.cc/150?img=1",
  ],
  [
    "seed_sam_taylor",
    "Sam Taylor",
    "sam.taylor@example.com",
    "https://i.pravatar.cc/150?img=2",
  ],
  [
    "seed_jordan_lee",
    "Jordan Lee",
    "jordan.lee@example.com",
    "https://i.pravatar.cc/150?img=3",
  ],
  [
    "seed_maya_patel",
    "Maya Patel",
    "maya.patel@example.com",
    "https://i.pravatar.cc/150?img=4",
  ],
  [
    "seed_casey_morgan",
    "Casey Morgan",
    "casey.morgan@example.com",
    "https://i.pravatar.cc/150?img=5",
  ],
  [
    "seed_riley_kim",
    "Riley Kim",
    "riley.kim@example.com",
    "https://i.pravatar.cc/150?img=6",
  ],
  [
    "seed_taylor_brooks",
    "Taylor Brooks",
    "taylor.brooks@example.com",
    "https://i.pravatar.cc/150?img=7",
  ],
  [
    "seed_jamie_wilson",
    "Jamie Wilson",
    "jamie.wilson@example.com",
    "https://i.pravatar.cc/150?img=8",
  ],
  [
    "seed_morgan_reed",
    "Morgan Reed",
    "morgan.reed@example.com",
    "https://i.pravatar.cc/150?img=9",
  ],
  [
    "seed_avery_scott",
    "Avery Scott",
    "avery.scott@example.com",
    "https://i.pravatar.cc/150?img=10",
  ],
  [
    "seed_quinn_parker",
    "Quinn Parker",
    "quinn.parker@example.com",
    "https://i.pravatar.cc/150?img=11",
  ],
  [
    "seed_drew_hayes",
    "Drew Hayes",
    "drew.hayes@example.com",
    "https://i.pravatar.cc/150?img=12",
  ],
  [
    "seed_skyler_evans",
    "Skyler Evans",
    "skyler.evans@example.com",
    "https://i.pravatar.cc/150?img=13",
  ],
  [
    "seed_harper_lane",
    "Harper Lane",
    "harper.lane@example.com",
    "https://i.pravatar.cc/150?img=14",
  ],
  [
    "seed_charlie_bennett",
    "Charlie Bennett",
    "charlie.bennett@example.com",
    "https://i.pravatar.cc/150?img=15",
  ],
  [
    "seed_emerson_gray",
    "Emerson Gray",
    "emerson.gray@example.com",
    "https://i.pravatar.cc/150?img=16",
  ],
  [
    "seed_finley_price",
    "Finley Price",
    "finley.price@example.com",
    "https://i.pravatar.cc/150?img=17",
  ],
  [
    "seed_rowan_blake",
    "Rowan Blake",
    "rowan.blake@example.com",
    "https://i.pravatar.cc/150?img=18",
  ],
  [
    "seed_sage_cooper",
    "Sage Cooper",
    "sage.cooper@example.com",
    "https://i.pravatar.cc/150?img=19",
  ],
  [
    "seed_reese_carter",
    "Reese Carter",
    "reese.carter@example.com",
    "https://i.pravatar.cc/150?img=20",
  ],
];

// 2. 비동기 함수의 반환 타입을 Promise<void>로 명시합니다.
async function seedDatabase(): Promise<void> {
  await connectDB();

  const result = await User.bulkWrite(
    // map에서 구조 분해 할당을 할 때, 튜플 타입 덕분에 각 변수가 string으로 자동 추론됩니다.
    seedUsers.map(([clerkId, fullName, email, profilePic]) => ({
      updateOne: {
        filter: { clerkId },
        update: {
          $set: { clerkId, fullName, email, profilePic },
        },
        upsert: true,
      },
    })),
  );

  console.log(
    `Seeded users. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}`,
  );
}

seedDatabase()
  // 3. catch 블록의 error 객체는 기본적으로 unknown 또는 any 타입이므로 명시해줍니다.
  .catch((error: unknown) => {
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
