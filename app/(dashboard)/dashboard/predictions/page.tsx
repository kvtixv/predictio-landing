"use client"

import Link from "next/link"
import { Calendar, Zap, ArrowRight } from "lucide-react"

export default function PredictionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono">Predykcje</h1>
        <p className="text-muted-foreground mt-1">
          Wybierz mecz, aby wygenerować nową predykcję AI
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link 
          href="/dashboard/matches"
          className="group bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 hover:border-primary/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Wybierz z listy meczów</h3>
          <p className="text-sm text-muted-foreground">
            Przeglądaj nadchodzące mecze i wybierz ten, który chcesz przeanalizować
          </p>
        </Link>

        <Link 
          href="/dashboard/history"
          className="group bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Historia predykcji</h3>
          <p className="text-sm text-muted-foreground">
            Zobacz wszystkie swoje wcześniejsze predykcje i ich wyniki
          </p>
        </Link>
      </div>

      {/* Info Section */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Jak działają predykcje AI?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
              <span className="font-mono font-bold text-primary">1</span>
            </div>
            <h4 className="font-medium mb-1">Wybierz mecz</h4>
            <p className="text-sm text-muted-foreground">
              Wybierz interesujący Cię mecz z listy nadchodzących spotkań
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
              <span className="font-mono font-bold text-primary">2</span>
            </div>
            <h4 className="font-medium mb-1">Wybierz rynek</h4>
            <p className="text-sm text-muted-foreground">
              Zdecyduj, jaki typ zakładu Cię interesuje (1X2, BTTS, O/U, itp.)
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
              <span className="font-mono font-bold text-primary">3</span>
            </div>
            <h4 className="font-medium mb-1">Otrzymaj analizę</h4>
            <p className="text-sm text-muted-foreground">
              AI przeanalizuje dane i dostarczy szczegółową predykcję
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
