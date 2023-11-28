import {defineConfig} from "tsup"
export default defineConfig({
  entry: ["src/main.ts", "src/script/*.ts"],
  clean:true,
  target: "esnext",
  format: "esm",
  external: ["@nestjs/core", "@nestjs/microservices", "@faker-js/faker"]
})
