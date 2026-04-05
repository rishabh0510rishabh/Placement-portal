import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-700">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 animate-pulse">
          Synchronizing
        </p>
        <div className="flex space-x-1 mt-1">
          <div className="h-1 w-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1 w-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1 w-1 bg-primary/40 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  )
}
