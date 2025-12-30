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
      return `docker exec -it ${name || "container"} /bin/bash`;
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

      <div className="flex-1 p-6 space-y-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Command Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={command} onValueChange={(v) => setCommand(v as DockerCommand)}>
              <SelectTrigger>
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

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {command === "run" && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Image
                    </label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="nginx:latest"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Ports (host:container, comma-separated)
                    </label>
                    <Input
                      value={ports}
                      onChange={(e) => setPorts(e.target.value)}
                      placeholder="8080:80, 3000:3000"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Volumes (host:container, comma-separated)
                    </label>
                    <Input
                      value={volumes}
                      onChange={(e) => setVolumes(e.target.value)}
                      placeholder="/host:/container"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Environment Variables (one per line)
                    </label>
                    <Textarea
                      value={envVars}
                      onChange={(e) => setEnvVars(e.target.value)}
                      placeholder="KEY=value"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Container Name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="my-container"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="detached"
                      checked={detached}
                      onChange={(e) => setDetached(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="detached" className="text-sm">
                      Detached mode (-d)
                    </label>
                  </div>
                </>
              )}
              {command === "build" && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Image Name:Tag
                    </label>
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="myapp:1.0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Dockerfile Path
                    </label>
                    <Input
                      value={dockerfile}
                      onChange={(e) => setDockerfile(e.target.value)}
                      placeholder="Dockerfile"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Build Context
                    </label>
                    <Input
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="."
                    />
                  </div>
                </>
              )}
              {(command === "exec" || command === "logs") && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Container Name/ID
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="container-name"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>Generated Command</CardTitle>
              <CopyButton text={generatedCommand} />
            </CardHeader>
            <CardContent>
              <CodeBlock code={generatedCommand} language="bash" />
              <div className="mt-4 space-y-2">
                <Badge variant="secondary">Explanation</Badge>
                <p className="text-xs text-muted-foreground">
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

      <div className="border-t border-border p-4 flex justify-center gap-3">
        <Button variant="outline" onClick={handleClear} size="lg">
          Clear
        </Button>
      </div>
    </div>
  );
}






