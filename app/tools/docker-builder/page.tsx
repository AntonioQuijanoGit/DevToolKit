"use client";

import { useState, useMemo } from "react";
import { Container } from "lucide-react";
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
import { examples } from "@/lib/constants/examples";

type DockerCommand = "run" | "build" | "exec" | "logs" | "compose";

export default function DockerBuilderPage() {
  const [command, setCommand] = useState<DockerCommand>("run");
  const [image, setImage] = useState("");
  const [ports, setPorts] = useState("");
  const [volumes, setVolumes] = useState("");
  const [envVars, setEnvVars] = useState("");
  const [detached, setDetached] = useState(false);
  const [name, setName] = useState("");
  const [dockerfile, setDockerfile] = useState("Dockerfile");
  const [context, setContext] = useState(".");

  const handleExample = () => {
    const example = examples["docker-builder"];
    if (example && typeof example === "object") {
      setImage(example.image || "");
      if (example.ports && Array.isArray(example.ports)) {
        setPorts(example.ports.join(","));
      }
      if (example.command) {
        // Set command if it's a valid DockerCommand
        if (["run", "build", "exec", "logs", "compose"].includes(example.command)) {
          setCommand(example.command as DockerCommand);
        }
      }
    }
  };

  const generatedCommand = useMemo(() => {
    if (command === "run") {
      let cmd = "docker run";
      if (detached) cmd += " -d";
      if (name) cmd += ` --name ${name}`;
      if (ports) {
        ports.split(",").forEach((port) => {
          cmd += ` -p ${port.trim()}`;
        });
      }
      if (volumes) {
        volumes.split(",").forEach((vol) => {
          cmd += ` -v ${vol.trim()}`;
        });
      }
      if (envVars) {
        envVars.split("\n").forEach((env) => {
          if (env.trim()) cmd += ` -e ${env.trim()}`;
        });
      }
      cmd += ` ${image || "image:tag"}`;
      return cmd;
    } else if (command === "build") {
      let cmd = `docker build -t ${image || "image:tag"}`;
      if (dockerfile !== "Dockerfile") cmd += ` -f ${dockerfile}`;
      cmd += ` ${context}`;
      return cmd;
    } else if (command === "exec") {
      return "docker exec -it " + (name || "container") + " /bin/bash";
    } else if (command === "logs") {
      let cmd = `docker logs`;
      if (name) cmd += ` ${name}`;
      else cmd += " container";
      return cmd;
    } else if (command === "compose") {
      return `docker-compose up -d`;
    }
    return "docker";
  }, [command, image, ports, volumes, envVars, detached, name, dockerfile, context]);

  const handleClear = () => {
    setImage("");
    setPorts("");
    setVolumes("");
    setEnvVars("");
    setDetached(false);
    setName("");
    setDockerfile("Dockerfile");
    setContext(".");
  };

  return (
    <div className="h-screen flex flex-col">
      <ToolHeader
        title="Docker Command Builder"
        description="Build Docker commands visually"
        icon={Container}
      />

      <div className="flex-1 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 overflow-auto pb-20 sm:pb-24">
        <Card>
          <CardHeader className="p-4 sm:p-6 border-b">
            <CardTitle className="text-base sm:text-lg font-semibold">Command Type</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Select value={command} onValueChange={(v) => setCommand(v as DockerCommand)}>
              <SelectTrigger className="min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="run">docker run</SelectItem>
                <SelectItem value="build">docker build</SelectItem>
                <SelectItem value="exec">docker exec</SelectItem>
                <SelectItem value="logs">docker logs</SelectItem>
                <SelectItem value="compose">docker-compose</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Parameters</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExample} className="text-xs sm:text-sm min-h-[36px]">
                Example
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              {command === "run" && (
                <>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Image
                    </label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="nginx:latest"
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Ports (host:container, comma-separated)
                    </label>
                    <Input
                      value={ports}
                      onChange={(e) => setPorts(e.target.value)}
                      placeholder="8080:80, 3000:3000"
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Volumes (host:container, comma-separated)
                    </label>
                    <Input
                      value={volumes}
                      onChange={(e) => setVolumes(e.target.value)}
                      placeholder="/host:/container"
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Environment Variables (one per line)
                    </label>
                    <Textarea
                      value={envVars}
                      onChange={(e) => setEnvVars(e.target.value)}
                      placeholder="KEY=value"
                      className="min-h-[100px] text-xs sm:text-sm resize-y"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Container Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="my-container"
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="detached"
                      checked={detached}
                      onChange={(e) => setDetached(e.target.checked)}
                      className="rounded w-4 h-4"
                    />
                    <label htmlFor="detached" className="text-xs sm:text-sm">
                      Detached mode (-d)
                    </label>
                  </div>
                </>
              )}
              {command === "build" && (
                <>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Image Name:Tag
                    </label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="myapp:1.0"
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Dockerfile Path
                    </label>
                    <Input
                      value={dockerfile}
                      onChange={(e) => setDockerfile(e.target.value)}
                      placeholder="Dockerfile"
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                      Build Context
                    </label>
                    <Input
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="."
                      className="min-h-[44px] text-sm sm:text-base"
                    />
                  </div>
                </>
              )}
              {(command === "exec" || command === "logs") && (
                <div>
                  <label className="text-xs sm:text-sm text-muted-foreground mb-2 block">
                    Container Name/ID
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="container-name"
                    className="min-h-[44px] text-sm sm:text-base"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-3 p-4 sm:p-6 border-b">
              <CardTitle className="text-base sm:text-lg font-semibold">Generated Command</CardTitle>
              <CopyButton text={generatedCommand} />
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <CodeBlock code={generatedCommand} language="bash" />
              <div className="mt-4 space-y-2">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">Explanation</Badge>
                <p className="text-[10px] sm:text-xs text-muted-foreground break-words">
                  {command === "run" && "Runs a container with specified options"}
                  {command === "build" && "Builds an image from Dockerfile"}
                  {command === "exec" && "Executes a command in running container"}
                  {command === "logs" && "Shows logs from container"}
                  {command === "compose" && "Starts services defined in docker-compose.yml"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-3 sm:p-4 md:p-5 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Button variant="outline" onClick={handleClear} size="lg" className="w-full sm:w-auto min-h-[44px] text-sm sm:text-base">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}






