import { defineNitroConfig } from 'nitro/config'
export default defineNitroConfig({
  vercel: {
    functions: {
      runtime: "bun1.x"
    }
  }
})