# This project is to test and reproduce the build error of tsc(typescript)

```bash
pnpm i

// you can check the index.ts is fine
pnpm test

pnpm build
```

### tsconfig.json

if these two option is set. bulid will failed

```json
{
  "compilerOptions": {
    "lib": [],
    "skipLibCheck": true
  }
}
```
