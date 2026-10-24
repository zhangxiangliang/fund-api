export declare function isBrowserRuntime(): boolean;
export declare function loadBrowserScript(options: {
    charset?: string;
    timeout?: number;
    url: string;
}): Promise<void>;
export declare function getBrowserValue(name: string): string;
export declare function getBrowserGlobal<T>(name: string): T | undefined;
