'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Save, BarChart3, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { useProntuarioStore } from '@/store/prontuario-store'
import {
  RegistroComportamento,
  TipoRegistro,
  INTERVALOS_PADRAO,
  criarIntervalosVazios,
  calcularEstatisticas
} from '@/types/prontuario'

export default function ProntuarioPage() {
  const params = useParams()
  const router = useRouter()
  const sessaoId = params.id as string

  const { getProntuarioBySessao, saveProntuario, isUsingMockData } = useProntuarioStore()

  const [registros, setRegistros] = useState<RegistroComportamento[]>([])
  const [mostrarGraficos, setMostrarGraficos] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Carregar prontuário existente
  useEffect(() => {
    const prontuarioExistente = getProntuarioBySessao(sessaoId)
    if (prontuarioExistente && prontuarioExistente.registros.length > 0) {
      setRegistros(prontuarioExistente.registros)
    }
    setLoading(false)
  }, [sessaoId, getProntuarioBySessao])

  // Adicionar novo registro
  const adicionarRegistro = (tipo: TipoRegistro) => {
    const ordemAtual = registros.filter(r => r.tipo === tipo).length + 1
    const prefixo = tipo === 'comportamento' ? 'Comportamento problema' : tipo === 'demanda' ? 'Demanda' : 'Evento'

    const novoRegistro: RegistroComportamento = {
      id: `${tipo}-${Date.now()}`,
      tipo,
      nome: `${prefixo} ${ordemAtual}°`,
      ordem: ordemAtual,
      intervalos: criarIntervalosVazios(),
      totalAcertos: 0,
      totalErros: 0,
      totalTentativas: 0,
      porcentagemAcerto: 0
    }

    setRegistros([...registros, novoRegistro])
  }

  // Remover registro
  const removerRegistro = (id: string) => {
    setRegistros(registros.filter(r => r.id !== id))
  }

  // Atualizar valor de acerto/erro em um intervalo
  const atualizarIntervalo = (
    registroId: string,
    minutos: number,
    campo: 'acerto' | 'erro',
    valor: string
  ) => {
    setRegistros(registros.map(registro => {
      if (registro.id === registroId) {
        const novoIntervalo = registro.intervalos.map(i => {
          if (i.minutos === minutos) {
            return { ...i, [campo]: parseInt(valor) || 0 }
          }
          return i
        })

        const atualizado = { ...registro, intervalos: novoIntervalo }
        calcularEstatisticas(atualizado)
        return atualizado
      }
      return registro
    }))
  }

  // Salvar prontuário
  const salvarProntuario = async () => {
    setSaving(true)
    try {
      await saveProntuario(sessaoId, registros)
      toast.success('Prontuário salvo com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar prontuário')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  // Calcular totais gerais
  const totaisGerais = {
    acertos: registros.reduce((sum, r) => sum + r.totalAcertos, 0),
    erros: registros.reduce((sum, r) => sum + r.totalErros, 0)
  }
  totaisGerais['tentativas'] = totaisGerais.acertos + totaisGerais.erros
  totaisGerais['porcentagem'] = totaisGerais.tentativas > 0
    ? Math.round((totaisGerais.acertos / totaisGerais.tentativas) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Prontuário da Sessão</h1>
              {isUsingMockData && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Dados Mock
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">Registro de ensaios discretos (DTT)</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMostrarGraficos(!mostrarGraficos)}
            disabled
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {mostrarGraficos ? 'Ocultar' : 'Mostrar'} Gráficos
          </Button>
          <Button onClick={salvarProntuario} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Prontuário'}
          </Button>
        </div>
      </div>

      {/* Botões de adicionar */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Registros</CardTitle>
          <CardDescription>Adicione comportamentos, demandas ou eventos para registro</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={() => adicionarRegistro('comportamento')} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Comportamento Problema
          </Button>
          <Button onClick={() => adicionarRegistro('demanda')} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Demanda
          </Button>
          <Button onClick={() => adicionarRegistro('evento')} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Evento
          </Button>
        </CardContent>
      </Card>

      {/* Tabela de registros */}
      {registros.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Registro de Tentativas</CardTitle>
            <CardDescription>
              Preencha os valores de acerto/erro para cada intervalo de tempo (em minutos)
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 bg-background z-10">
                    Comportamento/Demanda
                  </TableHead>
                  {INTERVALOS_PADRAO.map(min => (
                    <TableHead key={min} colSpan={2} className="text-center border-l">
                      {min} min
                    </TableHead>
                  ))}
                  <TableHead colSpan={2} className="text-center border-l bg-muted">
                    Total
                  </TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background z-10"></TableHead>
                  {INTERVALOS_PADRAO.map(min => (
                    <>
                      <TableHead key={`${min}-a`} className="text-center text-xs text-green-600">
                        A
                      </TableHead>
                      <TableHead key={`${min}-e`} className="text-center text-xs text-red-600">
                        E
                      </TableHead>
                    </>
                  ))}
                  <TableHead className="text-center text-xs text-green-600 bg-muted">
                    Acerto
                  </TableHead>
                  <TableHead className="text-center text-xs text-red-600 bg-muted">
                    Erro
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map(registro => (
                  <TableRow key={registro.id}>
                    <TableCell className="font-medium sticky left-0 bg-background z-10">
                      {registro.nome}
                    </TableCell>
                    {registro.intervalos.map(intervalo => (
                      <>
                        <TableCell key={`${registro.id}-${intervalo.minutos}-a`} className="p-1">
                          <Input
                            type="number"
                            min="0"
                            value={intervalo.acerto || ''}
                            onChange={(e) => atualizarIntervalo(
                              registro.id,
                              intervalo.minutos,
                              'acerto',
                              e.target.value
                            )}
                            className="w-12 h-8 text-center"
                          />
                        </TableCell>
                        <TableCell key={`${registro.id}-${intervalo.minutos}-e`} className="p-1">
                          <Input
                            type="number"
                            min="0"
                            value={intervalo.erro || ''}
                            onChange={(e) => atualizarIntervalo(
                              registro.id,
                              intervalo.minutos,
                              'erro',
                              e.target.value
                            )}
                            className="w-12 h-8 text-center"
                          />
                        </TableCell>
                      </>
                    ))}
                    <TableCell className="text-center font-bold text-green-600 bg-muted">
                      {registro.totalAcertos}
                    </TableCell>
                    <TableCell className="text-center font-bold text-red-600 bg-muted">
                      {registro.totalErros}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removerRegistro(registro.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Resumo Estatístico */}
      {registros.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-center">Acerto</TableHead>
                    <TableHead className="text-center">Erro</TableHead>
                    <TableHead className="text-center">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold bg-muted">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-center text-green-600">
                      {totaisGerais.acertos}
                    </TableCell>
                    <TableCell className="text-center text-red-600">
                      {totaisGerais.erros}
                    </TableCell>
                    <TableCell className="text-center">
                      {totaisGerais.porcentagem}%
                    </TableCell>
                  </TableRow>
                  {registros
                    .filter(r => r.tipo === 'demanda')
                    .map(registro => (
                      <TableRow key={registro.id}>
                        <TableCell>{registro.nome}</TableCell>
                        <TableCell className="text-center text-green-600">
                          {registro.totalAcertos}
                        </TableCell>
                        <TableCell className="text-center text-red-600">
                          {registro.totalErros}
                        </TableCell>
                        <TableCell className="text-center">
                          {registro.porcentagemAcerto}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comportamentos Problema</CardTitle>
            </CardHeader>
            <CardContent>
              {registros.filter(r => r.tipo === 'comportamento').length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nenhum comportamento problema registrado
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Comportamento</TableHead>
                      <TableHead className="text-center">Frequência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros
                      .filter(r => r.tipo === 'comportamento')
                      .map(registro => (
                        <TableRow key={registro.id}>
                          <TableCell>{registro.nome}</TableCell>
                          <TableCell className="text-center">
                            {registro.totalAcertos + registro.totalErros}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {registros.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum registro adicionado ainda. Clique em um dos botões acima para começar.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
