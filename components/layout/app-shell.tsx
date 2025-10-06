"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, FileText, LogOut, Menu, Home, User, Settings, BookOpen, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Protect routes
  useEffect(() => {
    if (isMounted && !user) {
      router.push("/login")
    }
  }, [isMounted, user, router])

  if (!isMounted || !user) {
    return null
  }

  const handleLogout = () => {
    logout()
    toast.success("Logout realizado com sucesso")
    router.push("/login")
  }

  const isPsicologo = user.tipo === "psicologo"
  const isPai = user.tipo === "pai"

  const navItems = [
    ...(isPsicologo
      ? [
          { href: "/dashboard", label: "Dashboard", icon: Home },
          { href: "/criancas", label: "Crianças", icon: Users },
          { href: "/sessoes", label: "Sessões", icon: Calendar },
          { href: "/relatorios", label: "Relatórios", icon: FileText },
          { href: "/atividades", label: "Atividades", icon: BookOpen },
        ]
      : []),
    ...(isPai
      ? [
          { href: "/meus-filhos", label: "Meus Filhos", icon: Users },
          { href: "/progresso", label: "Progresso", icon: BarChart3 },
        ]
      : []),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 sm:max-w-xs">
            <nav className="grid gap-2 text-lg font-medium">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <h1 className="text-xl font-bold">ASPCT Software</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.nome} />
                <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/perfil")}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-semibold">ASPCT Software</h2>
          </div>
          <nav className="grid gap-1 p-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => router.push(item.href)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="mt-auto p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={user.nome} />
                    <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.nome}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
