"use client";

import { useState, useMemo } from "react";
import { Terminal } from "lucide-react";
import { ToolHeader } from "@/components/layout/tool-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import { CodeBlock } from "@/components/shared/code-block";
import { Badge } from "@/components/ui/badge";

type CommandType = "find" | "grep" | "git" | "docker" | "tar" | "chmod" | "ssh" | "curl";

interface CommandBuilder {
  type: CommandType;
  params: Record<string, string>;
}

export default function ShellCommandBuilderPage() {
  const [commandType, setCommandType] = useState<CommandType>("find");
  const [params, setParams] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");

  const commandConfig = useMemo(() => {
    const configs: Record<CommandType, { fields: Array<{ key: string; label: string; type: "text" | "number" | "select"; options?: string[] }>; template: (p: Record<string, string>) => string }> = {
      find: {
        fields: [
          { key: "directory", label: "Directory", type: "text" },
          { key: "name", label: "File name pattern", type: "text" },
          { key: "type", label: "Type", type: "select", options: ["f", "d", "l"] },
          { key: "mtime", label: "Modified days ago", type: "number" },
          { key: "size", label: "Size (e.g., +100M)", type: "text" },
          { key: "action", label: "Action", type: "select", options: ["", "-delete", "-exec rm {} \\;", "-print"] },
        ],
        template: (p) => {
          let cmd = "find";
          if (p.directory) cmd += ` ${p.directory}`;
          else cmd += " .";
          if (p.name) cmd += ` -name '${p.name}'`;
          if (p.type) cmd += ` -type ${p.type}`;
          if (p.mtime) cmd += ` -mtime ${p.mtime}`;
          if (p.size) cmd += ` -size ${p.size}`;
          if (p.action) cmd += ` ${p.action}`;
          return cmd;
        },
      },
      grep: {
        fields: [
          { key: "pattern", label: "Pattern", type: "text" },
          { key: "file", label: "File/Directory", type: "text" },
          { key: "recursive", label: "Recursive", type: "select", options: ["", "-r", "-R"] },
          { key: "ignoreCase", label: "Ignore case", type: "select", options: ["", "-i"] },
          { key: "extended", label: "Extended regex", type: "select", options: ["", "-E"] },
        ],
        template: (p) => {
          let cmd = "grep";
          if (p.recursive) cmd += ` ${p.recursive}`;
          if (p.ignoreCase) cmd += ` ${p.ignoreCase}`;
          if (p.extended) cmd += ` ${p.extended}`;
          cmd += ` '${p.pattern || "pattern"}'`;
          if (p.file) cmd += ` ${p.file}`;
          else cmd += " .";
          return cmd;
        },
      },
      git: {
        fields: [
          { key: "action", label: "Action", type: "select", options: ["reset", "stash", "cherry-pick", "rebase"] },
          { key: "target", label: "Target (commit/branch)", type: "text" },
          { key: "hard", label: "Hard reset", type: "select", options: ["", "--hard", "--soft", "--mixed"] },
        ],
        template: (p) => {
          if (p.action === "reset") {
            return `git reset ${p.hard || ""} ${p.target || "HEAD~1"}`.trim();
          }
          if (p.action === "stash") {
            return "git stash";
          }
          if (p.action === "cherry-pick") {
            return `git cherry-pick ${p.target || "commit"}`;
          }
          if (p.action === "rebase") {
            return `git rebase -i ${p.target || "HEAD~3"}`;
          }
          return "git";
        },
      },
      docker: {
        fields: [
          { key: "action", label: "Action", type: "select", options: ["run", "build", "exec", "logs"] },
          { key: "image", label: "Image/Container", type: "text" },
          { key: "ports", label: "Port mapping (host:container)", type: "text" },
          { key: "detached", label: "Detached mode", type: "select", options: ["", "-d"] },
          { key: "volume", label: "Volume (host:container)", type: "text" },
        ],
        template: (p) => {
          let cmd = "docker";
          if (p.action === "run") {
            cmd += " run";
            if (p.detached) cmd += ` ${p.detached}`;
            if (p.ports) cmd += ` -p ${p.ports}`;
            if (p.volume) cmd += ` -v ${p.volume}`;
            cmd += ` ${p.image || "image"}`;
          } else if (p.action) {
            cmd += ` ${p.action} ${p.image || "container"}`;
          }
          return cmd;
        },
      },
      tar: {
        fields: [
          { key: "operation", label: "Operation", type: "select", options: ["create", "extract"] },
          { key: "archive", label: "Archive name", type: "text" },
          { key: "directory", label: "Directory/File", type: "text" },
          { key: "compress", label: "Compression", type: "select", options: ["", "gzip", "bzip2"] },
        ],
        template: (p) => {
          if (p.operation === "create") {
            let cmd = "tar";
            if (p.compress === "gzip") cmd += " -czf";
            else if (p.compress === "bzip2") cmd += " -cjf";
            else cmd += " -cf";
            cmd += ` ${p.archive || "archive.tar"} ${p.directory || "."}`;
            return cmd;
          } else {
            let cmd = "tar";
            if (p.compress === "gzip") cmd += " -xzf";
            else if (p.compress === "bzip2") cmd += " -xjf";
            else cmd += " -xf";
            cmd += ` ${p.archive || "archive.tar"}`;
            return cmd;
          }
        },
      },
      chmod: {
        fields: [
          { key: "permissions", label: "Permissions (e.g., 755, +x)", type: "text" },
          { key: "target", label: "File/Directory", type: "text" },
          { key: "recursive", label: "Recursive", type: "select", options: ["", "-R"] },
        ],
        template: (p) => {
          let cmd = "chmod";
          if (p.recursive) cmd += ` ${p.recursive}`;
          cmd += ` ${p.permissions || "755"} ${p.target || "file"}`;
          return cmd;
        },
      },
      ssh: {
        fields: [
          { key: "user", label: "User", type: "text" },
          { key: "host", label: "Host", type: "text" },
          { key: "port", label: "Port", type: "number" },
          { key: "key", label: "Key file", type: "text" },
        ],
        template: (p) => {
          let cmd = "ssh";
          if (p.port) cmd += ` -p ${p.port}`;
          if (p.key) cmd += ` -i ${p.key}`;
          if (p.user && p.host) cmd += ` ${p.user}@${p.host}`;
          else cmd += " user@host";
          return cmd;
        },
      },
      curl: {
        fields: [
          { key: "method", label: "Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"] },
          { key: "url", label: "URL", type: "text" },
          { key: "headers", label: "Headers (JSON)", type: "text" },
          { key: "data", label: "Data (JSON)", type: "text" },
        ],
        template: (p) => {
          let cmd = "curl";
          if (p.method && p.method !== "GET") cmd += ` -X ${p.method}`;
          if (p.headers) {
            try {
              const headers = JSON.parse(p.headers);
              Object.entries(headers).forEach(([k, v]) => {
                cmd += ` -H '${k}: ${v}'`;
              });
            } catch {}
          }
          if (p.data) cmd += ` -d '${p.data}'`;
          cmd += ` ${p.url || "https://example.com"}`;
          return cmd;
        },
      },
    };
    return configs[commandType];
  }, [commandType]);

  const generatedCommand = useMemo(() => {
    return commandConfig.template(params);
  }, [commandType, params, commandConfig]);

  const handleFieldChange = (key: string, value: string) => {
    // Convert "none" back to empty string for storage
    const actualValue = value === "none" ? "" : value;
    setParams((prev) => ({ ...prev, [key]: actualValue }));
  };

  const handleGenerate = () => {
    setOutput(generatedCommand);
  };

  const handleClear = () => {
    setParams({});
    setOutput("");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Shell Command Builder"
        description="Visual builder for complex shell commands"
        icon={Terminal}
      />

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Command Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={commandType} onValueChange={(v) => {
              setCommandType(v as CommandType);
              setParams({});
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="find">Find</SelectItem>
                <SelectItem value="grep">Grep</SelectItem>
                <SelectItem value="git">Git</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="tar">Tar/Archive</SelectItem>
                <SelectItem value="chmod">Chmod</SelectItem>
                <SelectItem value="ssh">SSH</SelectItem>
                <SelectItem value="curl">Curl</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {commandConfig.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <Select
                      value={params[field.key] || "none"}
                      onValueChange={(v) => handleFieldChange(field.key, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => {
                          const value = opt || "none";
                          return (
                            <SelectItem key={value} value={value}>
                              {opt || "(none)"}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      value={params[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Generated Command</CardTitle>
              {generatedCommand && <CopyButton text={generatedCommand} />}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent border border-border">
                  <pre className="text-sm font-mono">{generatedCommand}</pre>
                </div>
                {output && (
                  <div>
                    <Badge variant="secondary" className="mb-2">Final Command</Badge>
                    <CodeBlock code={output} language="bash" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button onClick={handleGenerate} size="lg">
          Generate Command
        </Button>
        <Button variant="outline" onClick={handleClear} size="lg">
          Clear
        </Button>
      </div>
    </div>
  );
}

