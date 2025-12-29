export interface Command {
  category: string;
  command: string;
  description: string;
  examples?: string[];
  tags: string[];
  explanation?: string;
}

export const commands: Command[] = [
  // Git
  {
    category: "git",
    command: "git reset --hard HEAD~1",
    description: "Undo last commit and discard changes",
    examples: ["git reset --hard HEAD~3", "git reset --hard origin/main"],
    tags: ["undo", "reset", "commit", "discard"],
    explanation: "Resets the current branch to the previous commit, discarding all changes",
  },
  {
    category: "git",
    command: "git stash",
    description: "Temporarily save uncommitted changes",
    examples: ["git stash pop", "git stash list", "git stash drop"],
    tags: ["stash", "save", "temporary"],
  },
  {
    category: "git",
    command: "git cherry-pick <commit>",
    description: "Apply a specific commit to current branch",
    examples: ["git cherry-pick abc123", "git cherry-pick HEAD~2"],
    tags: ["cherry-pick", "commit", "apply"],
  },
  {
    category: "git",
    command: "git rebase -i HEAD~3",
    description: "Interactive rebase of last 3 commits",
    examples: ["git rebase -i HEAD~5", "git rebase -i origin/main"],
    tags: ["rebase", "interactive", "edit"],
  },
  // Find
  {
    category: "find",
    command: "find . -name '*.txt'",
    description: "Find files by name pattern",
    examples: ["find /home -name '*.log'", "find . -iname 'readme*'"],
    tags: ["find", "search", "files"],
  },
  {
    category: "find",
    command: "find . -type f -mtime -7",
    description: "Find files modified in last 7 days",
    examples: ["find . -mtime -1", "find . -mtime +30"],
    tags: ["find", "modified", "time"],
  },
  {
    category: "find",
    command: "find . -size +100M",
    description: "Find files larger than 100MB",
    examples: ["find . -size +1G", "find . -size -10k"],
    tags: ["find", "size", "large"],
  },
  // Grep
  {
    category: "grep",
    command: "grep -r 'pattern' .",
    description: "Search for pattern recursively",
    examples: ["grep -r 'error' src/", "grep -ri 'TODO' ."],
    tags: ["grep", "search", "pattern"],
  },
  {
    category: "grep",
    command: "grep -E 'pattern1|pattern2' file.txt",
    description: "Search with multiple patterns",
    examples: ["grep -E 'error|warning' log.txt"],
    tags: ["grep", "multiple", "regex"],
  },
  // Docker
  {
    category: "docker",
    command: "docker run -d -p 8080:80 nginx",
    description: "Run container in detached mode with port mapping",
    examples: ["docker run -d -p 3000:3000 node:18"],
    tags: ["docker", "run", "port"],
  },
  {
    category: "docker",
    command: "docker-compose up -d",
    description: "Start services in detached mode",
    examples: ["docker-compose down", "docker-compose logs"],
    tags: ["docker", "compose", "services"],
  },
  // Tar/Zip
  {
    category: "archive",
    command: "tar -czf archive.tar.gz directory/",
    description: "Create compressed tar archive",
    examples: ["tar -xzf archive.tar.gz", "tar -czf backup.tar.gz /home"],
    tags: ["tar", "compress", "archive"],
  },
  {
    category: "archive",
    command: "zip -r archive.zip directory/",
    description: "Create zip archive",
    examples: ["unzip archive.zip", "zip -r backup.zip /home"],
    tags: ["zip", "compress", "archive"],
  },
  // SSH
  {
    category: "ssh",
    command: "ssh user@hostname",
    description: "Connect to remote server",
    examples: ["ssh -p 2222 user@host", "ssh -i key.pem user@host"],
    tags: ["ssh", "remote", "connect"],
  },
  {
    category: "ssh",
    command: "scp file.txt user@host:/path/",
    description: "Copy file to remote server",
    examples: ["scp -r folder/ user@host:/path/"],
    tags: ["ssh", "copy", "file"],
  },
  // Curl
  {
    category: "curl",
    command: "curl -X POST -H 'Content-Type: application/json' -d '{}' url",
    description: "Send POST request with JSON",
    examples: ["curl -X GET url", "curl -O url"],
    tags: ["curl", "http", "request"],
  },
  // Chmod
  {
    category: "permissions",
    command: "chmod +x script.sh",
    description: "Make file executable",
    examples: ["chmod 755 file", "chmod -R 644 directory/"],
    tags: ["chmod", "permissions", "executable"],
  },
];

export function searchCommands(query: string): Command[] {
  const lowerQuery = query.toLowerCase();
  return commands.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      cmd.category.toLowerCase().includes(lowerQuery)
  );
}

export function getCommandsByCategory(category: string): Command[] {
  return commands.filter((cmd) => cmd.category === category);
}

export const commandCategories = [
  "git",
  "find",
  "grep",
  "docker",
  "archive",
  "ssh",
  "curl",
  "permissions",
];



