"use client";

import { useState } from "react";
import { HelpCircle, X, Command, Search, Moon, Sun, History, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export function HelpTutorial() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="Help & Tutorial"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 overflow-y-auto"
            >
              <Card className="border-0 rounded-none h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border">
                  <CardTitle className="text-2xl">Help & Tutorial</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pt-6">
                  <div className="space-y-6">
                    {/* Quick Start */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        DevToolkit es una plataforma completa de herramientas para desarrolladores.
                        Todas las herramientas funcionan del lado del cliente, sin necesidad de conexión a internet.
                      </p>
                    </section>

                    {/* Navigation */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Navegación
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Atajo</Badge>
                            <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                              Cmd/Ctrl + K
                            </code>
                          </div>
                          <p className="text-sm">
                            Presiona <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Cmd+K</kbd> o <kbd className="px-1.5 py-0.5 bg-background rounded text-xs">Ctrl+K</kbd> para abrir el Command Palette y buscar herramientas rápidamente.
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <p className="text-sm">
                            Usa el <strong>sidebar izquierdo</strong> para navegar entre las diferentes categorías de herramientas.
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <p className="text-sm">
                            En <strong>móvil</strong>, el sidebar se convierte en un drawer que puedes abrir con el botón de menú.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Features */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3">Características Principales</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Copy className="h-4 w-4" />
                            <strong className="text-sm">Botones de Copiar</strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Cada herramienta tiene botones de copiar en los resultados. Haz clic para copiar al portapapeles.
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <History className="h-4 w-4" />
                            <strong className="text-sm">Historial</strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Algunas herramientas guardan tu historial. Busca el icono de historial para ver tus acciones recientes.
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <Moon className="h-4 w-4" />
                            <strong className="text-sm">Modo Claro/Oscuro</strong>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Cambia entre modo claro y oscuro usando el botón en el sidebar. Tu preferencia se guarda automáticamente.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Tool Categories */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3">Categorías de Herramientas</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <strong className="text-sm block mb-1">Formatters</strong>
                          <p className="text-xs text-muted-foreground">
                            JSON, SQL, YAML, XML
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <strong className="text-sm block mb-1">Encoders</strong>
                          <p className="text-xs text-muted-foreground">
                            Base64, URL, HTML
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <strong className="text-sm block mb-1">Security</strong>
                          <p className="text-xs text-muted-foreground">
                            Hash, Password, JWT
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <strong className="text-sm block mb-1">Generators</strong>
                          <p className="text-xs text-muted-foreground">
                            UUID, QR, Color, Lorem
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <strong className="text-sm block mb-1">Shell Tools</strong>
                          <p className="text-xs text-muted-foreground">
                            Command Builder, Cheatsheet, Cron
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-accent border border-border">
                          <strong className="text-sm block mb-1">Converters</strong>
                          <p className="text-xs text-muted-foreground">
                            CSV, Timestamp, Image
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Tips */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3">Tips Útiles</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Usa los botones "Example" para ver ejemplos de uso</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Todas las herramientas funcionan offline</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Los resultados se pueden copiar con un solo clic</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>El historial se guarda localmente en tu navegador</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Presiona ESC para cerrar modales y dropdowns</span>
                        </li>
                      </ul>
                    </section>

                    {/* Keyboard Shortcuts */}
                    <section>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Command className="h-5 w-5" />
                        Atajos de Teclado
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-accent">
                          <span className="text-sm">Abrir Command Palette</span>
                          <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">
                            Cmd/Ctrl + K
                          </kbd>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-accent">
                          <span className="text-sm">Cerrar modales</span>
                          <kbd className="px-2 py-1 bg-background rounded text-xs font-mono">
                            ESC
                          </kbd>
                        </div>
                      </div>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}






