import { StrictMode, useState, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';
import { QuestionHeader, OptionList, OtherInput, SubmitButton } from './components';
import type { QuestionConfig, SelectionState } from './types';
import './styles/app.css';

function AskUserApp() {
  const [config, setConfig] = useState<QuestionConfig | null>(null);
  const [selection, setSelection] = useState<SelectionState>({
    selected: new Set(),
    otherText: '',
    isOtherSelected: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const { app, isConnected, error } = useApp({
    appInfo: { name: 'ask-user-mcp-app', version: '1.0.0' },
    capabilities: {},
    onAppCreated: (app) => {
      // Register notification handler for tool input
      app.ontoolinput = (params) => {
        const args = params.arguments as {
          question: string;
          header?: string;
          options: Array<{ label: string; value: string; description?: string }>;
          multiSelect?: boolean;
          allowOther?: boolean;
        };

        setConfig({
          question: args.question,
          header: args.header,
          options: args.options,
          multiSelect: args.multiSelect ?? false,
          allowOther: args.allowOther ?? true,
        });
      };

      // Handle theme changes from host
      app.onhostcontextchanged = (params) => {
        if (params.theme) {
          setTheme(params.theme);
        }
      };
    },
  });

  // Apply theme from host context on initial connection
  useEffect(() => {
    if (app && isConnected) {
      const context = app.getHostContext();
      if (context?.theme) {
        setTheme(context.theme);
      }
    }
  }, [app, isConnected]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle option selection
  const handleSelect = useCallback((value: string) => {
    setSelection((prev) => {
      const newSelected = new Set(prev.selected);

      if (config?.multiSelect) {
        // Multi-select: toggle selection
        if (newSelected.has(value)) {
          newSelected.delete(value);
        } else {
          newSelected.add(value);
        }
      } else {
        // Single-select: replace selection
        newSelected.clear();
        newSelected.add(value);
      }

      return {
        ...prev,
        selected: newSelected,
        // Deselect "Other" when selecting a regular option in single-select mode
        isOtherSelected: config?.multiSelect ? prev.isOtherSelected : false,
      };
    });
  }, [config?.multiSelect]);

  // Handle "Other" toggle
  const handleOtherToggle = useCallback(() => {
    setSelection((prev) => {
      const newIsOtherSelected = !prev.isOtherSelected;

      if (config?.multiSelect) {
        // Multi-select: just toggle "Other"
        return { ...prev, isOtherSelected: newIsOtherSelected };
      } else {
        // Single-select: deselect other options when selecting "Other"
        return {
          selected: newIsOtherSelected ? new Set() : prev.selected,
          otherText: prev.otherText,
          isOtherSelected: newIsOtherSelected,
        };
      }
    });
  }, [config?.multiSelect]);

  // Handle "Other" text change
  const handleOtherChange = useCallback((value: string) => {
    setSelection((prev) => ({ ...prev, otherText: value }));
  }, []);

  // Build response text
  const buildResponse = useCallback(() => {
    const parts: string[] = [];

    // Add selected options
    selection.selected.forEach((value) => {
      const option = config?.options.find((o) => o.value === value);
      if (option) {
        parts.push(option.label);
      }
    });

    // Add "Other" response
    if (selection.isOtherSelected && selection.otherText.trim()) {
      parts.push(`Other: ${selection.otherText.trim()}`);
    }

    return parts.join(', ');
  }, [config?.options, selection]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!app || !config) return;

    const response = buildResponse();

    try {
      // Send message to continue conversation with user's response
      await app.sendMessage({
        role: 'user',
        content: [{ type: 'text', text: `User selected: ${response}` }],
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Failed to send response:', err);
    }
  }, [app, config, buildResponse]);

  // Check if submit is enabled
  const canSubmit = selection.selected.size > 0 ||
    (selection.isOtherSelected && selection.otherText.trim().length > 0);

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  // Loading state
  if (!isConnected || !config) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Submitted state
  if (submitted) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Response submitted</span>
        </div>
        <div className="mt-2 text-sm text-text-secondary">
          {buildResponse()}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <QuestionHeader header={config.header} question={config.question} />

      <OptionList
        options={config.options}
        selected={selection.selected}
        multiSelect={config.multiSelect}
        onSelect={handleSelect}
      />

      {config.allowOther && (
        <OtherInput
          isSelected={selection.isOtherSelected}
          value={selection.otherText}
          multiSelect={config.multiSelect}
          onToggle={handleOtherToggle}
          onChange={handleOtherChange}
        />
      )}

      <SubmitButton disabled={!canSubmit} onClick={handleSubmit} />
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <AskUserApp />
    </StrictMode>
  );
}
