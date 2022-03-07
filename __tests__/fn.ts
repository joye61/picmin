import { UID } from "@/utils/uid";

test("Unique uid", () => {
  const u1 = UID.value;
  const u2 = UID.value;
  expect(u1 !== u2).toBe(true);

  UID.reset();
  expect(UID.value).toBe(1);
});