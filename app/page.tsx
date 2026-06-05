'use client'

import { useState } from 'react'
import { StoreProvider } from '@/lib/store-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductList } from '@/components/product-list'
import { MovementForm } from '@/components/movement-form'
import { MovementHistory } from '@/components/movement-history'
import { DailyStatsPanel } from '@/components/daily-stats'
import { StatsOverview } from '@/components/stats-overview'
import { ProductManagement } from '@/components/product-management'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { 
  Warehouse, 
  ShieldCheck, 
  Lock, 
  LogOut,
  Package,
  ArrowRightLeft,
  BarChart3,
  Settings,
  AlertTriangle
} from 'lucide-react'

function AlmoxarifadoView() {
  return (
    <div className="space-y-6">
      <StatsOverview />
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductList />
          <MovementHistory />
        </div>
        <div className="space-y-6">
          <MovementForm />
          <DailyStatsPanel />
        </div>
      </div>
    </div>
  )
}

function GerenteView({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Painel do Gerente</h2>
            <p className="text-sm text-muted-foreground">Acesso total ao sistema</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout} className="border-border">
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted border-border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="movements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Movimentações
          </TabsTrigger>
          <TabsTrigger value="management" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsOverview />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductList />
            </div>
            <DailyStatsPanel />
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ProductList />
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MovementHistory />
            </div>
            <DailyStatsPanel />
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <ProductManagement />
          <div className="grid lg:grid-cols-2 gap-6">
            <MovementForm />
            <DailyStatsPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LoginGerente({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === '404580') {
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-2">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-card-foreground">Acesso Restrito</CardTitle>
          <p className="text-sm text-muted-foreground">
            Digite a senha para acessar o painel do gerente
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="bg-input border-border text-foreground text-center text-lg tracking-widest"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Senha incorreta. Tente novamente.</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Acessar Painel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'almoxarifado' | 'gerente'>('almoxarifado')
  const [isGerenteLoggedIn, setIsGerenteLoggedIn] = useState(false)

  return (
    <StoreProvider>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Clube Curitibano"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Clube Curitibano</h1>
                  <p className="text-sm text-muted-foreground">Sistema de Controle de Estoque</p>
                </div>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant={activeTab === 'almoxarifado' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('almoxarifado')}
                  className={activeTab === 'almoxarifado' ? 'bg-primary text-primary-foreground' : 'border-border'}
                >
                  <Warehouse className="h-4 w-4 mr-2" />
                  Almoxarifado
                </Button>
                <Button
                  variant={activeTab === 'gerente' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('gerente')}
                  className={activeTab === 'gerente' ? 'bg-primary text-primary-foreground' : 'border-border'}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Gerente
                  {!isGerenteLoggedIn && <Lock className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {activeTab === 'almoxarifado' ? (
            <AlmoxarifadoView />
          ) : isGerenteLoggedIn ? (
            <GerenteView onLogout={() => setIsGerenteLoggedIn(false)} />
          ) : (
            <LoginGerente onLogin={() => setIsGerenteLoggedIn(true)} />
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-auto">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
            © 2026 Clube Curitibano - Sistema de Controle de Estoque
          </div>
        </footer>
      </main>
    </StoreProvider>
  )
}
