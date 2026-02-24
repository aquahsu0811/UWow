import fs from "fs";

const files = [
  "src/components/table/UserDataTable.vue",
  "src/components/table/PinnedSection.vue",
  "src/components/table/MobileCard.vue",
  "src/components/table/SortHeader.vue",
  "src/components/table/UserFormModal.vue",
];

files.forEach((file) => {
  if (!fs.existsSync(file)) return;
  console.log("Processing", file);
  let content = fs.readFileSync(file, "utf8");

  // Strip all light theme utility classes where a dark variant is provided.
  // Instead of complex logic, let's just use regex to find and replace everything.

  // 1. Remove light version if it's right before dark:.
  // e.g. "bg-white dark:bg-gray-800" -> "bg-gray-800"
  // "text-gray-900 dark:text-gray-100" -> "text-gray-100"

  content = content.replace(
    /(?:\b)([a-z0-9-:]+)\s+dark:([a-z0-9-:\/\[\]]+)/g,
    (match, light, dark) => {
      // basic check to see if they are the same prefix, e.g text-
      let lPrefix = light.split("-")[0];
      if (light.includes(":")) lPrefix = light.split(":")[1].split("-")[0];

      let dPrefix = dark.split("-")[0];
      if (dark.includes(":")) dPrefix = dark.split(":")[1].split("-")[0];

      if (lPrefix === dPrefix) {
        return dark;
      }
      return match;
    },
  );

  // some might have multiple spaces
  content = content.replace(
    /(?:\b)([a-z0-9-:]+)\s+dark:([a-z0-9-:\/\[\]]+)/g,
    (match, light, dark) => {
      let lPrefix = light.split("-")[0];
      if (light.includes(":")) lPrefix = light.split(":")[1].split("-")[0];

      let dPrefix = dark.split("-")[0];
      if (dark.includes(":")) dPrefix = dark.split(":")[1].split("-")[0];

      if (lPrefix === dPrefix) {
        return dark;
      }
      return match;
    },
  );

  // 2. Remove 'dark:' prefix from any remaining dark utilities
  content = content.replace(/dark:([a-z0-9-:\/\[\]]+)/g, "$1");

  fs.writeFileSync(file, content);
});

console.log("Done.");
