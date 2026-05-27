type BrowserNode = {
  appendChild(node: BrowserScriptElement): unknown;
  removeChild?(node: BrowserScriptElement): unknown;
};

type BrowserScriptElement = {
  async: boolean;
  charset: string;
  onerror: (() => void) | null;
  onload: (() => void) | null;
  parentNode?: BrowserNode | null;
  src: string;
};

type BrowserDocument = {
  body?: BrowserNode;
  createElement(tagName: string): BrowserScriptElement;
  documentElement?: BrowserNode;
  head?: BrowserNode;
};

type BrowserRuntime = typeof globalThis & {
  document?: BrowserDocument;
  [key: string]: unknown;
};

export function isBrowserRuntime(): boolean {
  return Boolean((globalThis as BrowserRuntime).document);
}

export async function loadBrowserScript(options: {
  charset?: string;
  timeout?: number;
  url: string;
}): Promise<void> {
  const runtime = globalThis as BrowserRuntime;
  const document = runtime.document;
  const parent = document?.head || document?.body || document?.documentElement;

  if (!document || !parent) {
    throw new FundRequestError("Browser document is not available");
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = options.timeout || 15000;
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new FundRequestError(`Script request timed out after ${timeout}ms`));
    }, timeout);

    function cleanup(): void {
      clearTimeout(timeoutId);
      script.onload = null;
      script.onerror = null;
      script.parentNode?.removeChild?.(script);
    }

    script.async = true;
    script.charset = options.charset || "utf-8";
    script.onload = () => {
      cleanup();
      resolve();
    };
    script.onerror = () => {
      cleanup();
      reject(new FundRequestError("Script request failed"));
    };
    script.src = options.url;

    parent.appendChild(script);
  });
}

export function getBrowserValue(name: string): string {
  const runtime = globalThis as BrowserRuntime;
  const value = runtime[name];
  delete runtime[name];
  return typeof value === "string" ? value : "";
}

export function getBrowserGlobal<T>(name: string): T | undefined {
  const runtime = globalThis as BrowserRuntime;
  const value = runtime[name] as T | undefined;
  delete runtime[name];
  return value;
}
import { FundRequestError } from "../errors";
