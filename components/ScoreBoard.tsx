type Props = {
  score: number
  highScore: number
}

export function ScoreBoard({ score, highScore }: Props) {
  return (
    <div className="absolute top-3 left-0 right-0 flex justify-between px-4 pointer-events-none select-none">
      <span className="text-cyan-400 font-mono text-xl font-bold drop-shadow">
        {(score / 1000).toFixed(1)}s
      </span>
      <span className="text-yellow-400 font-mono text-xl drop-shadow">
        HI&nbsp;{(highScore / 1000).toFixed(1)}s
      </span>
    </div>
  )
}
