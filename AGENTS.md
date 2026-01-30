# Agent Guide: ask-user-mcp-app

This document helps AI agents understand and navigate the codebase efficiently.

## Quick Overview

This is an MCP App that provides an `ask_user` tool for AI agents to ask users multiple-choice questions with an interactive UI. The UI renders inline in the host client (Claude, ChatGPT, etc.).

## Documentation Requirements

**IMPORTANT**: You MUST update the documentation when making changes to the codebase.

Update **README.md** when:
- Adding or modifying tool parameters/schema
- Changing installation or usage instructions
- Adding new features users need to know about
- Modifying CLI commands or flags
- Changing default behavior

Update **AGENTS.md** when:
- Adding or modifying files in the project structure
- Changing implementation patterns or architecture
- Adding new common tasks or workflows
- Updating build output or dependencies
- Discovering new debugging tips

This ensures both users and future agents have accurate, up-to-date information.

## Project Structure

```
ask-user-mcp-app/
├── server.ts              # MCP server - tool + resource registration
├── main.ts                # Entry point - HTTP and stdio transports
├── mcp-app.html           # UI entry point (Vite input)
├── src/
│   ├── mcp-app.tsx        # Main React component - state management, MCP hooks
│   ├── components/        # UI components (all use TailwindCSS)
│   │   ├── QuestionHeader.tsx   # Header tag + question text
│   │   ├── OptionButton.tsx     # Individual option with radio/checkbox
│   │   ├── OptionList.tsx       # List of OptionButtons
│   │   ├── OtherInput.tsx       # "Other" option with text input
│   │   ├── SubmitButton.tsx     # Submit button
│   │   └── index.ts             # Barrel export
│   ├── types/index.ts     # TypeScript interfaces
│   └── styles/app.css     # Tailwind directives + CSS variables
├── tsconfig.json          # Browser TypeScript (for Vite/React)
├── tsconfig.server.json   # Server TypeScript (for Node.js)
├── vite.config.ts         # Vite config with viteSingleFile plugin
├── tailwind.config.js     # TailwindCSS config with theme colors
└── postcss.config.js      # PostCSS config for Tailwind
```

## Key Files to Understand

### 1. `server.ts` - MCP Server Logic

**CRITICAL**: Must use `registerAppTool` and `registerAppResource` from `@modelcontextprotocol/ext-apps/server` (NOT the base `server.tool()` / `server.resource()` methods). These helpers:
- Properly set `_meta.ui.resourceUri` metadata for UI rendering
- Use correct MIME type `RESOURCE_MIME_TYPE` (`text/html;profile=mcp-app`)
- Normalize metadata for compatibility with all hosts

```typescript
import { registerAppTool, registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';

const resourceUri = 'ui://ask-user-mcp-app/mcp-app.html';

// Register tool with UI metadata
registerAppTool(server, 'ask_user', {
  title: 'Ask User',
  description: '...',
  inputSchema: { /* zod schema */ },
  _meta: { ui: { resourceUri } },  // Links tool to its UI
}, async (args) => {
  return { content: [{ type: 'text', text: '...' }] };
});

// Register resource serving bundled HTML
registerAppResource(server, 'Ask User UI', resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => ({
    contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
  })
);
```

### 2. `main.ts` - Transport Layer

- `--stdio` flag: Uses `StdioServerTransport` for desktop clients
- No flag: Starts Express server with `StreamableHTTPServerTransport` on port 3001

Key implementation details for HTTP transport:
- **Use `createMcpExpressApp()`** from `@modelcontextprotocol/sdk/server/express.js` (handles JSON parsing)
- Pass `req.body` as third argument to `transport.handleRequest(req, res, req.body)`
- Stateless mode: create new server + transport per request, clean up on `res.close`

```typescript
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';

const app = createMcpExpressApp({ host: '0.0.0.0' });
app.use(cors());

app.all('/mcp', async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,  // Stateless mode
  });

  res.on('close', () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);  // req.body required!
});
```

### 3. `src/mcp-app.tsx` - React UI

Key patterns:
- Uses `useApp()` hook from `@modelcontextprotocol/ext-apps/react`
- Registers `ontoolinput` handler in `onAppCreated` callback
- Tool arguments come via `params.arguments`
- User response sent via `app.sendMessage()`

```typescript
const { app, isConnected, error } = useApp({
  appInfo: { name: 'ask-user-mcp-app', version: '1.0.0' },
  capabilities: {},
  onAppCreated: (app) => {
    app.ontoolinput = (params) => {
      // params.arguments contains the tool input
    };
  },
});
```

### 4. `vite.config.ts` - Build Configuration

- Uses `vite-plugin-singlefile` to bundle everything into one HTML file
- `emptyOutDir: false` preserves server build output in dist/

## Common Tasks

### Adding a New Tool Parameter

1. Update Zod schema in `server.ts`
2. Update `QuestionConfig` type in `src/types/index.ts`
3. Handle the parameter in `src/mcp-app.tsx` (ontoolinput handler)
4. Update UI components as needed

### Modifying UI Appearance

- All components use TailwindCSS classes
- Theme colors defined in `tailwind.config.js` using CSS custom properties
- CSS variables in `src/styles/app.css` control light/dark themes
- Host theme applied via `data-theme` attribute on `<html>`

### Adding a New Component

1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Import and use in `src/mcp-app.tsx`

### Testing Changes

```bash
# Build and run
npm start

# Or use dev mode (no rebuild needed)
npm run dev
```

Test with basic-host from ext-apps repo or via Claude Desktop.

## MCP Apps SDK Patterns

### Receiving Tool Input

```typescript
app.ontoolinput = (params) => {
  const args = params.arguments; // Tool call arguments
};
```

### Sending User Response

```typescript
await app.sendMessage({
  role: 'user',
  content: [{ type: 'text', text: 'User response here' }],
});
```

### Handling Theme Changes

```typescript
// Initial theme
const context = app.getHostContext();
if (context?.theme) setTheme(context.theme);

// Theme change notifications
app.onhostcontextchanged = (params) => {
  if (params.theme) setTheme(params.theme);
};
```

## Build Output

After `npm run build`:

```
dist/
├── main.js          # Server entry point
├── main.d.ts        # TypeScript declarations
├── server.js        # MCP server code
├── server.d.ts      # TypeScript declarations
└── mcp-app.html     # Bundled UI (React + CSS inlined)
```

## Debugging Tips

1. **Server not starting**: Check if port 3001 is in use (`lsof -ti:3001`)
2. **Tool not appearing**: Verify server responds to `tools/list` request
3. **UI not rendering in Claude**:
   - Must use `registerAppTool`/`registerAppResource` from `@modelcontextprotocol/ext-apps/server`
   - MIME type must be `RESOURCE_MIME_TYPE` (`text/html;profile=mcp-app`), not just `text/html`
   - Tool response must have `_meta.ui.resourceUri` pointing to the registered resource
4. **Theme not applying**: Ensure `data-theme` attribute is set on document
5. **HTTP "Parse error: Invalid JSON"**: Ensure `req.body` is passed to `handleRequest()`
6. **HTTP "Server not initialized"**: Session ID not being sent - check `mcp-session-id` header
7. **Claude connector auth error**: Use `createMcpExpressApp()` from SDK, ensure CORS is configured

## Dependencies to Know

| Package | Purpose |
|---------|---------|
| `@modelcontextprotocol/ext-apps` | MCP Apps SDK (useApp hook, App class) |
| `@modelcontextprotocol/sdk` | Core MCP (McpServer, transports) |
| `vite-plugin-singlefile` | Bundles UI into single HTML |
| `zod` | Schema validation for tool parameters |

## API Reference

- [MCP Apps SDK Docs](https://modelcontextprotocol.io/docs/extensions/apps)
- [MCP Apps API Reference](https://modelcontextprotocol.github.io/ext-apps/api/)
- [MCP SDK Docs](https://modelcontextprotocol.io/docs)
