const dogs = [
  ["01jq2m3k4n5p6q7r8s9t0u1v2", "Shadow", "German Shepherd", "male", "large", "Black & Tan", 32.5, "available", 1200, 1, '["Rabies","DHPP"]', 2, 1, 1683744000000],
  ["01jq2m3k4n5p6q7r8s9t0u1v4", "Copper", "Golden Retriever", "male", "large", "Golden", 28.0, "available", 1500, 1, '["Rabies","DHPP","Leptospirosis"]', 2, 1, 1692508800000],
];

const values = dogs.map((d) => `('${d[0]}', '${d[1]}', '${d[2]}', '${d[3]}', '${d[4]}', '${d[5]}', ${d[6]}, '${d[7]}', ${d[8]}, ${d[9]}, '${d[10]}', ${d[11]}, ${d[12]}, NULL, ${d[13]})`).join(", ");

const sql = `INSERT OR REPLACE INTO dog (id, name, breed, gender, size, color, weight, status, price, microchipped, vaccinations, dewormings, vet_checked, published_at, date_of_birth) VALUES ${values}`;

const env = process.argv[2] || "local";

if (env === "local") {
  const dbPath = "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/cfac2df05a7d90dcd1286aa4feace15b238010c90980b580b603cabad260149f.sqlite";
  require("child_process").execSync(`sqlite3 "${dbPath}" "${sql.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  console.log("Seed successful: 2 dogs added as drafts (local)");
} else if (env === "dev") {
  require("child_process").execSync(`wrangler d1 execute sekhon-dog-kennel-dev-db --env dev --remote --command "${sql.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  console.log("Seed successful: 2 dogs added as drafts (dev)");
} else if (env === "prod") {
  require("child_process").execSync(`wrangler d1 execute sekhon-dog-kennel-db --remote --command "${sql.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  console.log("Seed successful: 2 dogs added as drafts (prod)");
} else {
  console.log("Usage: bun run scripts/seed.ts [local|dev|prod]");
}
