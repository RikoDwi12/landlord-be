import {defineConfig} from "tsup"
export default defineConfig({
  entry: ["src/main.ts", "src/script/*.ts"],
  clean:true,
  target: "esnext",
  format: "esm",
  external: ["@nestjs/core", "@nestjs/microservices", "@faker-js/faker"],
  onSuccess: process.argv[2] == "--watch" && "node dist/main.js"
})
