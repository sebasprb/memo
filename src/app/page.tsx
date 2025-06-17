"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MemoryCard {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

// Using more interesting symbols instead of letters
const CARD_VALUES = [
  '★', '♠', '♦', '♥', '⚡', '☘', '⚜', '✿'
]

export default function Home() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)
  const [moves, setMoves] = useState<number>(0)
  const [isRevealing, setIsRevealing] = useState<boolean>(false)

  const initializeGame = () => {
    const shuffledCards = [...CARD_VALUES, ...CARD_VALUES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setIsGameStarted(true)
    
    // Show all cards for 1.5 seconds at start
    setIsRevealing(true)
    setTimeout(() => {
      setIsRevealing(false)
    }, 1500)
  }

  const handleCardClick = (id: number) => {
    if (!isGameStarted || isRevealing) return
    if (flippedCards.length === 2) return
    if (cards[id].isMatched) return
    if (flippedCards.includes(id)) return

    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      const [firstId, secondId] = newFlippedCards
      if (cards[firstId].value === cards[secondId].value) {
        setMatchedPairs(prev => prev + 1)
        setCards(prev => prev.map(card => 
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ))
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Memo</h1>
          <p className="text-gray-400 mb-8">Test your memory with this modern card matching game</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              onClick={initializeGame}
              className="bg-white text-black hover:bg-gray-200 min-w-32 transition-all duration-300 transform hover:scale-105"
            >
              {isGameStarted ? 'Restart Game' : 'Start Game'}
            </Button>
            {isGameStarted && (
              <div className="flex items-center gap-6 text-lg">
                <span className="bg-white/10 px-4 py-2 rounded-lg">Moves: {moves}</span>
                <span className="bg-white/10 px-4 py-2 rounded-lg">Matches: {matchedPairs}/8</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {cards.map((card) => (
              <Card
               key={card.id}
               className={cn(
                 "h-32 w-32 md:h-40 md:w-40 cursor-pointer select-none",
                 card.isMatched && "opacity-50"
               )}
               onClick={() => handleCardClick(card.id)}
             >
              <div className="relative w-full h-full">
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-xl bg-transparent text-white text-6xl font-bold border border-transparent shadow-none",
                  !(card.isFlipped || flippedCards.includes(card.id) || isRevealing) && "block",
                  (card.isFlipped || flippedCards.includes(card.id) || isRevealing) && "hidden"
                )}>
                  <div className="mx-auto my-auto">{'?'}</div>
                </div>
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-xl bg-transparent text-white text-8xl font-bold shadow-none",
                  (card.isFlipped || flippedCards.includes(card.id) || isRevealing) && "block",
                  !(card.isFlipped || flippedCards.includes(card.id) || isRevealing) && "hidden"
                )}>
                  <div className="mx-auto my-auto">{card.value}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {matchedPairs === 8 && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-white text-black p-8 rounded-2xl text-center max-w-md mx-4">
              <h2 className="text-4xl font-bold mb-4">🎉 Congratulations!</h2>
              <p className="text-xl mb-6">You completed the game in {moves} moves</p>
              <Button 
                onClick={initializeGame}
                className="bg-black text-white hover:bg-gray-800 min-w-32 transition-all duration-300 transform hover:scale-105"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
