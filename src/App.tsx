import { useState, useEffect, useMemo } from 'react'
import quotesData from './quotes.json'
import { Forward } from 'lucide-react'

interface Task {
  id: number
  text: string
  completed: boolean
}

interface Quote {
  text: string
  author?: string
}

const quotes: Quote[] = quotesData

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Bom dia!'
  if (hour >= 12 && hour < 18) return 'Boa tarde!'
  return 'Boa noite!'
}

function getFormattedDate(): string {
  const now = new Date()
  return now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).replace(/^./, (c) => c.toUpperCase())
}

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem('simplelist-tasks')
    if (saved) return JSON.parse(saved)
  } catch { }
  return []
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem('simplelist-tasks', JSON.stringify(tasks))
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [inputValue, setInputValue] = useState('')

  const randomQuote = useMemo(() => {
    return quotes[Math.floor(Math.random() * quotes.length)]
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function addTask() {
    const text = inputValue.trim()
    if (!text) return
    setTasks((prev) => [...prev, { id: Date.now(), text, completed: false }])
    setInputValue('')
  }

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') addTask()
  }

  return (
    <>
      {/* Header */}
      <div className="text-left mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)] mt-3 leading-tight">
          {getGreeting()}
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {getFormattedDate()}
        </p>
      </div>

      {/* Input da tarefa */}
      <div className="flex gap-3 mb-6 items-center shrink-0">
        <input
          id="inputTask"
          type="text"
          placeholder="Ir para a academia..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 py-2.5 px-0 text-base font-[inherit] bg-transparent border-0 border-b border-[var(--border)] text-[var(--text)] outline-none transition-colors duration-200 placeholder:text-[var(--text-muted)] focus:border-b-[var(--primary)] max-sm:w-full"
        />
        <button
          id="newTaskBtn"
          onClick={addTask}
          className="py-2.5 px-5 text-sm font-semibold font-[inherit] bg-[var(--primary)] text-[var(--btn-text)] border-none rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 hover:opacity-85 active:scale-[0.97]"
        >
          <span className='hidden sm:inline'>Adicionar tarefa</span>
          <span className='sm:hidden'>
            <Forward size={22} />
          </span>
        </button>
      </div>

      {/* Tarefas */}
      {tasks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-base italic">
          Adicione sua primeira tarefa.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 flex-1 min-h-0 overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3.5 py-3.5 px-4 border border-[var(--border)] rounded-xl bg-transparent transition-colors duration-150 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] ${task.completed ? 'task-completed' : ''}`}
            >
              <div
                onClick={() => toggleTask(task.id)}
                role="checkbox"
                aria-checked={task.completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleTask(task.id)
                }}
                className={`w-5 h-5 min-w-5 border-2 border-[var(--primary)] rounded cursor-pointer flex items-center justify-center transition-colors duration-150 ${task.completed ? 'bg-[var(--primary)]' : 'bg-transparent'}`}
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3 h-3 transition-opacity duration-150 ${task.completed ? 'opacity-100' : 'opacity-0'}`}
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="var(--btn-text)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className={`flex-1 text-sm text-left transition-all duration-200 ${task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text)]'}`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                aria-label="Deletar tarefa"
                className="bg-none border-none cursor-pointer p-1 text-[var(--text-muted)] text-lg leading-none transition-colors duration-150 flex items-center justify-center hover:text-[var(--primary)]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Frases */}
      <div className="text-left italic text-sm text-[var(--text-muted)] mt-4 pb-2 leading-relaxed shrink-0">
        "{randomQuote.text}"{randomQuote.author ? ` – ${randomQuote.author}` : ''}
      </div>

      {/* Repositório */}
      <a
        href="https://github.com/KachanChK/Simplelist"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 flex-col items-center gap-1 no-underline text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--primary)]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
        <span className="text-[0.7rem] font-medium">GitHub</span>
      </a>
    </>
  )
}

export default App
